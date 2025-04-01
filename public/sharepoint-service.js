class SharePointService {
    constructor() {
        this.siteUrl = window.SharePointConfig?.siteUrl;
        this.libraryName = window.SharePointConfig?.libraryName;
        this.libraryUrl = window.SharePointConfig?.libraryUrl;
        this.folders = window.SharePointConfig?.folders || {
            monthlyReleases: 'Monthly Releases',
            root: ''
        };
        this.siteId = null;
        this.driveId = null;
        this.folderIds = {};

        console.log('SharePoint service initialized with:', {
            siteUrl: this.siteUrl,
            libraryName: this.libraryName,
            libraryUrl: this.libraryUrl,
            folders: this.folders
        });
    }

    static async initialize() {
        try {
            // Wait for auth handler to be ready
            await window.AuthHandler.initialize();
            return new SharePointService();
        } catch (error) {
            console.error('Error initializing SharePoint service:', error);
            throw error;
        }
    }

    async getAccessToken() {
        try {
            // First try to get the token silently
            const account = window.msalInstance.getActiveAccount();
            if (!account) {
                throw new Error('No active account found');
            }

            try {
                const response = await window.msalInstance.acquireTokenSilent({
                    scopes: [
                        'https://graph.microsoft.com/Sites.Read.All',
                        'https://graph.microsoft.com/Sites.ReadWrite.All',
                        'https://graph.microsoft.com/Files.Read.All',
                        'https://graph.microsoft.com/Files.ReadWrite.All'
                    ],
                    account: account
                });
                return response.accessToken;
            } catch (error) {
                // If silent token acquisition fails, try interactive
                console.log('Silent token acquisition failed, trying interactive:', error);
                const response = await window.msalInstance.acquireTokenPopup({
                    scopes: [
                        'https://graph.microsoft.com/Sites.Read.All',
                        'https://graph.microsoft.com/Sites.ReadWrite.All',
                        'https://graph.microsoft.com/Files.Read.All',
                        'https://graph.microsoft.com/Files.ReadWrite.All'
                    ]
                });
                return response.accessToken;
            }
        } catch (error) {
            console.error('Token acquisition failed:', error);
            throw error;
        }
    }

    async getSiteId() {
        try {
            console.log('Getting site ID...');
            const token = await this.getAccessToken();
            
            // Extract the site name and domain from the URL
            const siteUrl = new URL(this.siteUrl);
            const siteName = siteUrl.pathname.split('/sites/')[1];
            const domain = siteUrl.hostname;
            
            // Use the site name with domain in the Graph API call
            const response = await fetch(`https://graph.microsoft.com/v1.0/sites/${domain}:/sites/${siteName}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Graph API error:', errorData);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.siteId = data.id;
            return data.id;
        } catch (error) {
            console.error('Error getting site ID:', error);
            throw error;
        }
    }

    async getDriveId() {
        try {
            const siteId = await this.getSiteId();
            const token = await this.getAccessToken();
            
            const response = await fetch(`https://graph.microsoft.com/v1.0/sites/${siteId}/drives`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const drive = data.value.find(d => d.name === this.libraryName);
            
            if (!drive) {
                throw new Error(`Drive "${this.libraryName}" not found`);
            }

            this.driveId = drive.id;
            return drive.id;
        } catch (error) {
            console.error('Error getting drive ID:', error);
            throw error;
        }
    }

    async listFiles(folderPath = '') {
        try {
            const driveId = await this.getDriveId();
            const token = await this.getAccessToken();
            
            // Extract the folder path from the libraryUrl if it exists
            let endpoint;
            if (folderPath === this.folders.root) {
                // Use the specific Project Price Calculator folder
                endpoint = `https://graph.microsoft.com/v1.0/sites/${this.siteId}/drives/${driveId}/root:/Project Price Calculator:/children`;
            } else if (folderPath === this.folders.monthlyReleases) {
                // Use the Monthly Releases folder
                endpoint = `https://graph.microsoft.com/v1.0/sites/${this.siteId}/drives/${driveId}/root:/Monthly Releases:/children`;
            } else {
                // Default to root
                endpoint = `https://graph.microsoft.com/v1.0/sites/${this.siteId}/drives/${driveId}/root/children`;
            }
            
            const response = await fetch(endpoint, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Graph API error:', errorData);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.value.map(item => ({
                name: item.name,
                id: item.id,
                webUrl: item.webUrl,
                createdDateTime: item.createdDateTime,
                lastModifiedDateTime: item.lastModifiedDateTime,
                size: item.size,
                folder: item.folder ? {
                    childCount: item.folder.childCount
                } : null,
                file: item.file ? {
                    mimeType: item.file.mimeType
                } : null
            }));
        } catch (error) {
            console.error('Error listing files:', error);
            throw error;
        }
    }

    async listAllFiles() {
        try {
            const [rootFiles, monthlyReleaseFiles] = await Promise.all([
                this.listFiles(this.folders.root),
                this.listFiles(this.folders.monthlyReleases)
            ]);

            return {
                root: rootFiles,
                monthlyReleases: monthlyReleaseFiles
            };
        } catch (error) {
            console.error('Error listing all files:', error);
            throw error;
        }
    }

    async uploadFile(folderPath, fileName, fileContent) {
        try {
            const driveId = await this.getDriveId();
            const token = await this.getAccessToken();
            
            // Construct the upload path
            const uploadPath = folderPath || '';
            const encodedFileName = encodeURIComponent(fileName);
            const encodedFolderPath = uploadPath ? encodeURIComponent(uploadPath) + '/' : '';
            
            const response = await fetch(
                `${this.siteUrl}/drives/${driveId}/root:/${encodedFolderPath}${encodedFileName}:/content`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: fileContent
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('File uploaded successfully:', data);
            return data;
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    }

    // Get authentication token
    async getFormDigestValue() {
        const response = await fetch(`${this.siteUrl}/_api/contextinfo`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json;odata=verbose'
            },
            credentials: 'include'
        });
        const data = await response.json();
        return data.d.GetContextWebInformation.FormDigestValue;
    }

    // Generic save method for any list
    async saveItem(listKey, data, contentType) {
        try {
            const formDigest = await this.getFormDigestValue();
            const endpoint = SharePointConfig.lists[listKey].endpoint;
            
            const spData = {
                __metadata: { type: ContentTypes[listKey] },
                ...data
            };

            const response = await fetch(`${this.siteUrl}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json;odata=verbose',
                    'Content-Type': 'application/json;odata=verbose',
                    'X-RequestDigest': formDigest,
                    'X-HTTP-Method': 'POST'
                },
                credentials: 'include',
                body: JSON.stringify(spData)
            });

            if (!response.ok) {
                throw new Error(`SharePoint save failed: ${response.statusText}`);
            }

            const result = await response.json();
            return result.d;
        } catch (error) {
            console.error(`Error saving to SharePoint ${listKey}:`, error);
            throw error;
        }
    }

    // Generic get method for any list
    async getItems(listKey, filter = '') {
        try {
            let url = `${this.siteUrl}${SharePointConfig.lists[listKey].endpoint}`;
            if (filter) {
                url += `?$filter=${encodeURIComponent(filter)}`;
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json;odata=verbose'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`SharePoint get failed: ${response.statusText}`);
            }

            const data = await response.json();
            return data.d.results;
        } catch (error) {
            console.error(`Error getting items from SharePoint ${listKey}:`, error);
            throw error;
        }
    }

    // Project Quotes Methods
    async saveProjectQuote(projectData) {
        const data = {
            Title: projectData.name,
            ProjectName: projectData.name,
            Customer: projectData.customer,
            TotalCost: projectData.totalCost,
            MonthlyRevenue: projectData.monthlyRevenue,
            MonthlyTeamPayout: projectData.monthlyTeamPayout,
            MonthlyCustomerPayment: projectData.monthlyCustomerPayment,
            MonthlyProfit: projectData.monthlyProfit,
            Duration: projectData.duration,
            ProfitAdjustment: projectData.profitAdjustment,
            Status: projectData.status,
            Source: projectData.source,
            CreatedDate: projectData.createdDate,
            Roles: JSON.stringify(projectData.roles)
        };
        
        return this.saveItem('projectQuotes', data);
    }

    async getProjectQuotes() {
        return this.getItems('projectQuotes');
    }

    // Release Planning Methods
    async saveRelease(releaseData) {
        const data = {
            Title: releaseData.name,
            ReleaseName: releaseData.name,
            ProjectName: releaseData.projectName,
            ReleaseMonth: releaseData.releaseMonth,
            Customer: releaseData.customer,
            HourCap: releaseData.hourCap,
            StartDate: releaseData.startDate,
            EndDate: releaseData.endDate,
            Status: releaseData.status,
            Enhancements: JSON.stringify(releaseData.enhancements),
            TotalHours: releaseData.totalHours,
            TotalCost: releaseData.totalCost,
            PlannerPlanId: releaseData.plannerPlanId,
            PlannerGroupId: releaseData.plannerGroupId
        };
        
        return this.saveItem('releaseItems', data);
    }

    async getReleases(filter = '') {
        return this.getItems('releaseItems', filter);
    }

    // Customer Methods
    async saveCustomer(customerData) {
        const data = {
            Title: customerData.name,
            CustomerName: customerData.name,
            CustomerID: customerData.id,
            DefaultClientRate: customerData.defaultClientRate,
            DefaultDevRate: customerData.defaultDevRate,
            Status: customerData.status,
            CreatedDate: new Date().toISOString(),
            CustomRates: JSON.stringify(customerData.customRates)
        };
        
        return this.saveItem('customers', data);
    }

    async getCustomers() {
        return this.getItems('customers');
    }

    // Planner Integration Methods
    async createPlannerTask(taskData) {
        try {
            const response = await fetch(`https://graph.microsoft.com/v1.0/planner/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await this.getGraphToken()}`
                },
                body: JSON.stringify({
                    planId: SharePointConfig.planner.planId,
                    title: taskData.title,
                    assignments: taskData.assignments,
                    dueDateTime: taskData.dueDate,
                    description: taskData.description
                })
            });

            if (!response.ok) {
                throw new Error(`Planner task creation failed: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating Planner task:', error);
            throw error;
        }
    }

    // Helper method to get Microsoft Graph token
    async getGraphToken() {
        return this.getAccessToken();
    }

    async getFileLink(fileName) {
        try {
            // Use the new library URL for direct access
            const encodedFileName = encodeURIComponent(fileName);
            return `${this.libraryUrl}&id=${encodedFileName}`;
        } catch (error) {
            console.error('Error getting file link:', error);
            return null;
        }
    }
}

// Export the service
window.SharePointService = SharePointService; 