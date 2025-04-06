class SharePointService {
    constructor() {
        this.baseUrl = 'https://graph.microsoft.com/v1.0';
        this.hostname = 'p5techsolutions.sharepoint.com';
        this.sitePath = '/sites/P5TSQuoteRepository';
        this.libraryName = 'Project Price Calculator';
        this.folderPath = 'Project Price Calculator';
        this.retryCount = 0;
        this.maxRetries = 3;
        console.log('SharePoint service initialized with:', {
            baseUrl: this.baseUrl,
            hostname: this.hostname,
            sitePath: this.sitePath,
            libraryName: this.libraryName,
            folderPath: this.folderPath
        });
    }

    static async initialize() {
        if (!window.msalInstance) {
            throw new Error('MSAL instance not found');
        }
        
        // Check for active account
        const account = window.msalInstance.getActiveAccount();
        if (!account) {
            // Try to set the active account
            const accounts = window.msalInstance.getAllAccounts();
            if (accounts.length > 0) {
                window.msalInstance.setActiveAccount(accounts[0]);
                console.log('Active account set in SharePointService.initialize:', accounts[0].username);
            } else {
                throw new Error('No accounts found for SharePoint initialization');
            }
        } else {
            console.log('Using active account for SharePoint:', account.username);
        }
        
        return new SharePointService();
    }

    async getAccessToken() {
        try {
            console.log('Getting access token...');
            
            // Get the active account
            const account = window.msalInstance.getActiveAccount();
            if (!account) {
                throw new Error('No active account found');
            }
            
            const tokenRequest = {
                scopes: [
                    "https://graph.microsoft.com/Sites.Read.All",
                    "https://graph.microsoft.com/Sites.ReadWrite.All",
                    "https://graph.microsoft.com/Files.Read.All",
                    "https://graph.microsoft.com/Files.ReadWrite.All"
                ],
                account: account
            };
            console.log('Token request:', tokenRequest);

            try {
                const response = await window.msalInstance.acquireTokenSilent(tokenRequest);
                console.log('Token acquired successfully');
                return response.accessToken;
            } catch (error) {
                console.log('Silent token acquisition failed, trying popup:', error);
                const response = await window.msalInstance.acquireTokenPopup(tokenRequest);
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
            
            const encodedHostname = encodeURIComponent(this.hostname);
            const encodedSitePath = encodeURIComponent(this.sitePath);
            const url = `${this.baseUrl}/sites/${encodedHostname}:${encodedSitePath}`;
            
            console.log('Requesting site ID from:', url);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to get site ID: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Site data:', data);
            return data.id;
        } catch (error) {
            console.error('Error getting site ID:', error);
            throw error;
        }
    }

    async getDriveId() {
        try {
            console.log('Getting drive ID...');
            const siteId = await this.getSiteId();
            const token = await this.getAccessToken();
            
            const response = await fetch(
                `${this.baseUrl}/sites/${siteId}/drives`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to get drives: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Drives data:', data);
            
            const drive = data.value.find(d => d.name === this.libraryName);
            if (!drive) {
                throw new Error(`Document library "${this.libraryName}" not found`);
            }

            console.log('Found drive:', drive);
            return drive.id;
        } catch (error) {
            console.error('Error getting drive ID:', error);
            throw error;
        }
    }

    async uploadFile(folderPath, fileName, file) {
        try {
            console.log('Uploading file:', { fileName });
            const driveId = await this.getDriveId();
            const token = await this.getAccessToken();

            // Use the Project Price Calculator folder path
            const fullPath = `${this.folderPath}/${fileName}`;
            console.log('Full path:', fullPath);

            // Upload the file
            const response = await fetch(
                `${this.baseUrl}/drives/${driveId}/root:/${fullPath}:/content`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: file
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Upload failed:', {
                    status: response.status,
                    statusText: response.statusText,
                    error: errorText
                });
                throw new Error(`Failed to upload file: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Upload successful:', result);
            return result;
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    }

    async listFiles(siteId, libraryName) {
        try {
            console.log('Listing files...', { siteId, libraryName });
            const token = await this.getAccessToken();

            // If siteId is not provided, get it
            if (!siteId) {
                siteId = await this.getSiteId();
            }

            // Get the drive ID for the library
            const drivesResponse = await fetch(
                `${this.baseUrl}/sites/${siteId}/drives`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                }
            );

            if (!drivesResponse.ok) {
                throw new Error(`Failed to get drives: ${drivesResponse.statusText}`);
            }

            const drivesData = await drivesResponse.json();
            console.log('Drives data:', drivesData);

            // Find the correct drive
            const drive = drivesData.value.find(d => d.name === (libraryName || this.libraryName));
            if (!drive) {
                throw new Error(`Document library "${libraryName || this.libraryName}" not found`);
            }

            // Get files from the drive
            const response = await fetch(
                `${this.baseUrl}/drives/${drive.id}/root/children`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to list files: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Files data:', data);
            return data;
        } catch (error) {
            console.error('Error listing files:', error);
            throw error;
        }
    }

    async createFolder(siteId, libraryName, folderName) {
        try {
            const token = await this.getAccessToken();
            // Update to use the correct library name format
            const response = await fetch(`${this.baseUrl}/sites/${siteId}/drives/root:/Project Price Calculator:/children`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "name": folderName,
                    "folder": {},
                    "@microsoft.graph.conflictBehavior": "rename"
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating folder:', error);
            throw error;
        }
    }

    async ensureFoldersExist(siteId, libraryName) {
        try {
            console.log('Ensuring folders exist...');
            
            // Get the drive first
            const drivesResponse = await this.getDriveId();

            // Check and create folders if they don't exist
            for (const folderName of Object.values(this.folders)) {
                try {
                    const folderResponse = await this.makeAuthenticatedRequest(
                        `${this.baseUrl}/drives/${drivesResponse}/root:/${folderName}`
                    );
                    
                    if (!folderResponse.ok) {
                        // Folder doesn't exist, create it
                        await this.makeAuthenticatedRequest(
                            `${this.baseUrl}/drives/${drivesResponse}/root/children`,
                            {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    "name": folderName,
                                    "folder": {},
                                    "@microsoft.graph.conflictBehavior": "rename"
                                })
                            }
                        );
                        console.log(`Created folder: ${folderName}`);
                    }
                } catch (error) {
                    if (error.message.includes('404')) {
                        // Folder doesn't exist, create it
                        await this.makeAuthenticatedRequest(
                            `${this.baseUrl}/drives/${drivesResponse}/root/children`,
                            {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    "name": folderName,
                                    "folder": {},
                                    "@microsoft.graph.conflictBehavior": "rename"
                                })
                            }
                        );
                        console.log(`Created folder: ${folderName}`);
                    } else {
                        throw error;
                    }
                }
            }
        } catch (error) {
            console.error('Error ensuring folders exist:', error);
            throw error;
        }
    }

    async deleteFile(siteId, libraryName, fileId) {
        try {
            console.log('Deleting file:', fileId, 'from library:', libraryName);
            
            // Get the lists first
            const response = await this.makeAuthenticatedRequest(
                `${this.baseUrl}/sites/${siteId}/lists`
            );
            
            const lists = await response.json();
            const docLib = lists.value.find(list => list.name === libraryName);
            
            if (!docLib) {
                throw new Error(`Library "${libraryName}" not found`);
            }

            // Get the drive for this library
            const driveResponse = await this.makeAuthenticatedRequest(
                `${this.baseUrl}/sites/${siteId}/lists/${docLib.id}/drive`
            );
            const drive = await driveResponse.json();

            // Delete the file
            const deleteResponse = await this.makeAuthenticatedRequest(
                `${this.baseUrl}/drives/${drive.id}/items/${fileId}`,
                {
                    method: 'DELETE'
                }
            );

            console.log('File deletion response:', deleteResponse.status);
            return deleteResponse.status === 204;
        } catch (error) {
            console.error('Error deleting file:', error);
            throw new Error(`Failed to delete file: ${error.message}`);
        }
    }

    async updateFile(siteId, libraryName, fileId, content) {
        try {
            console.log('Updating file:', fileId, 'in library:', libraryName);
            
            // Get the drive
            const drivesResponse = await this.makeAuthenticatedRequest(
                `${this.baseUrl}/sites/${siteId}/drives`
            );

            const drivesData = await drivesResponse.json();
            const drive = drivesData.value.find(d => d.name === libraryName);
            
            if (!drive) {
                throw new Error(`Library "${libraryName}" not found`);
            }

            // Update the file content
            const updateResponse = await this.makeAuthenticatedRequest(
                `${this.baseUrl}/drives/${drive.id}/items/${fileId}/content`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(content)
                }
            );

            const updateData = await updateResponse.json();
            console.log('File update response:', updateData);
            return updateData;
        } catch (error) {
            console.error('Error updating file:', error);
            throw new Error(`Failed to update file: ${error.message}`);
        }
    }
}

// Create and export a singleton instance
let instance = null;

window.initializeSharePointService = async function(msalInstance) {
    if (!instance) {
        instance = new SharePointService(msalInstance);
    }
    return instance;
};

window.SharePointService = {
    initialize: async function(account) {
        const msalInstance = window.msalInstance;
        if (!msalInstance) {
            throw new Error('MSAL instance not found');
        }
        instance = await window.initializeSharePointService(msalInstance);
        return instance;
    },
    getInstance: function() {
        if (!instance) {
            throw new Error('SharePoint service not initialized');
        }
        return instance;
    }
}; 