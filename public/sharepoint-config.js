// Initialize SharePoint Configuration after MSAL is ready
window.addEventListener('load', function() {
    // Initialize SharePoint Configuration
    window.SharePointConfig = {
        siteUrl: 'https://p5techsolutions.sharepoint.com/sites/P5TSQuoteRepository',
        libraryName: 'Project Price Calculator',
        libraryUrl: 'https://p5techsolutions.sharepoint.com/sites/P5TSQuoteRepository/Project%20Price%20Calculator/Forms/AllItems.aspx?id=%2Fsites%2FP5TSQuoteRepository%2FProject%20Price%20Calculator%2FProject%20Price%20Calculator&viewid=5e1038c5%2D6157%2D4c70%2D8d36%2D7389613366cd',
        folders: {
            monthlyReleases: 'Monthly Releases',
            root: 'Project Price Calculator'
        },
        auth: {
            clientId: window.msalConfig?.auth?.clientId,
            authority: window.msalConfig?.auth?.authority,
            redirectUri: window.msalConfig?.auth?.redirectUri,
            scopes: [
                'https://graph.microsoft.com/Sites.Read.All',
                'https://graph.microsoft.com/Sites.ReadWrite.All',
                'https://graph.microsoft.com/Files.Read.All',
                'https://graph.microsoft.com/Files.ReadWrite.All'
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
    window.SharePointFields = {
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
            Roles: 'Roles'
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
            Enhancements: 'Enhancements',
            TotalHours: 'TotalHours',
            TotalCost: 'TotalCost'
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
    window.ContentTypes = {
        projectQuotes: 'SP.Data.ProjectQuotesListItem',
        releaseItems: 'SP.Data.ReleaseItemsListItem',
        customers: 'SP.Data.CustomersListItem'
    };

    console.log('SharePoint configuration initialized');

    // Export configuration if needed
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = window.SharePointConfig;
    }
}); 