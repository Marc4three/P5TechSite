import { SharePointConfig, SharePointFields, ContentTypes } from './sharepoint-config.js';

class SharePointService {
    constructor() {
        this.config = SharePointConfig;
        this.fields = SharePointFields;
        this.contentTypes = ContentTypes;
    }

    // Get authentication token
    async getFormDigestValue() {
        const response = await fetch(`${this.config.siteUrl}/_api/contextinfo`, {
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
            const endpoint = this.config.lists[listKey].endpoint;
            
            const spData = {
                __metadata: { type: this.contentTypes[listKey] },
                ...data
            };

            const response = await fetch(`${this.config.siteUrl}${endpoint}`, {
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
            let url = `${this.config.siteUrl}${this.config.lists[listKey].endpoint}`;
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
                    planId: this.config.planner.planId,
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
        // Implement token acquisition logic here
        // This will depend on your authentication setup
        throw new Error('Graph token acquisition not implemented');
    }
}

export const sharePointService = new SharePointService(); 