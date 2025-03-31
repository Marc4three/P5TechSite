// SharePoint Configuration
const SharePointConfig = {
    siteUrl: 'YOUR_SHAREPOINT_SITE_URL', // Replace with your SharePoint site URL
    auth: {
        clientId: 'YOUR_CLIENT_ID',
        authority: 'https://login.microsoftonline.com/YOUR_TENANT_ID',
        redirectUri: 'http://localhost:3000',
        scopes: [
            'https://graph.microsoft.com/Tasks.ReadWrite',
            'https://graph.microsoft.com/Group.ReadWrite.All',
            'https://YOUR_TENANT.sharepoint.com/Sites.ReadWrite.All',
            'https://YOUR_TENANT.sharepoint.com/AllSites.ReadWrite'
        ]
    },
    lists: {
        projectQuotes: {
            name: 'ProjectQuotes',
            endpoint: '/_api/web/lists/getbytitle(\'ProjectQuotes\')/items'
        },
        releaseItems: {
            name: 'ReleaseItems',
            endpoint: '/_api/web/lists/getbytitle(\'ReleaseItems\')/items'
        },
        customers: {
            name: 'Customers',
            endpoint: '/_api/web/lists/getbytitle(\'Customers\')/items'
        }
    },
    planner: {
        groupId: 'YOUR_GROUP_ID', // Microsoft 365 Group ID
        planId: 'YOUR_PLAN_ID'    // Planner Plan ID
    }
};

// Fields mapping for SharePoint lists
const SharePointFields = {
    // Project Quotes List
    projectQuotes: {
        Title: 'Title',
        ProjectName: 'ProjectName',
        Customer: 'Customer',
        TotalCost: 'TotalCost',
        MonthlyRevenue: 'MonthlyRevenue',
        MonthlyTeamPayout: 'MonthlyTeamPayout',
        MonthlyCustomerPayment: 'MonthlyCustomerPayment',
        MonthlyProfit: 'MonthlyProfit',
        Duration: 'Duration',
        ProfitAdjustment: 'ProfitAdjustment',
        Status: 'Status',
        Source: 'Source',
        CreatedDate: 'CreatedDate',
        Roles: 'Roles' // Will store as JSON string
    },
    // Release Items List
    releaseItems: {
        Title: 'Title',
        ReleaseName: 'ReleaseName',
        ProjectName: 'ProjectName',
        ReleaseMonth: 'ReleaseMonth',
        Customer: 'Customer',
        HourCap: 'HourCap',
        StartDate: 'StartDate',
        EndDate: 'EndDate',
        Status: 'Status',
        Enhancements: 'Enhancements', // Will store as JSON string
        TotalHours: 'TotalHours',
        TotalCost: 'TotalCost',
        PlannerPlanId: 'PlannerPlanId',
        PlannerGroupId: 'PlannerGroupId'
    },
    // Customers List
    customers: {
        Title: 'Title',
        CustomerName: 'CustomerName',
        CustomerID: 'CustomerID',
        DefaultClientRate: 'DefaultClientRate',
        DefaultDevRate: 'DefaultDevRate',
        Status: 'Status',
        CreatedDate: 'CreatedDate',
        CustomRates: 'CustomRates' // JSON string for role-specific rates
    }
};

// SharePoint List Content Types
const ContentTypes = {
    projectQuotes: 'SP.Data.ProjectQuotesListItem',
    releaseItems: 'SP.Data.ReleaseItemsListItem',
    customers: 'SP.Data.CustomersListItem'
};

export { SharePointConfig, SharePointFields, ContentTypes }; 