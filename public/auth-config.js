// MSAL configuration for Azure AD
const msalConfig = {
    auth: {
        clientId: "f70b0b12-7688-4e6a-92da-6dabcf271950",
        authority: "https://login.microsoftonline.com/202abb20-ccd1-4194-aa83-a8e73f57d637",
        redirectUri: window.location.origin + "/login.html", // Default redirect to login
        postLogoutRedirectUri: window.location.origin + "/login.html",
        navigateToLoginRequestUrl: true
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false
    },
    system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) return;
                switch (level) {
                    case msal.LogLevel.Error:
                        console.error(message);
                        return;
                    case msal.LogLevel.Info:
                        console.info(message);
                        return;
                    case msal.LogLevel.Warning:
                        console.warn(message);
                        return;
                }
            }
        }
    }
};

// Login request object
const loginRequest = {
    scopes: ["openid", "profile", "email", "Group.Read.All", "User.Read"],
    prompt: "select_account"
};

// Make configurations available globally
window.msalConfig = msalConfig;
window.loginRequest = loginRequest;

// Initialize MSAL instance
if (!window.msalInstance) {
    window.msalInstance = new msal.PublicClientApplication(msalConfig);
}

// Enhanced force refresh function
async function forceRefreshLogin() {
    try {
        console.log('Starting force refresh login...');
        
        // Clear all session storage
        sessionStorage.clear();
        
        // Clear any cookies related to authentication
        document.cookie.split(";").forEach(function(c) {
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
        
        // Use login request with forced prompt
        const loginRequestWithPrompt = {
            ...loginRequest,
            prompt: "select_account"
        };
        
        await window.msalInstance.loginRedirect(loginRequestWithPrompt);
    } catch (error) {
        console.error('Force refresh login failed:', error);
        throw error;
    }
}

// Enhanced load event listener
window.addEventListener('load', async function() {
    try {
        console.log('Checking authentication state...');
        
        // Handle the redirect promise
        const response = await window.msalInstance.handleRedirectPromise();
        
        if (response) {
            console.log('Handling redirect response:', response);
            
            // Get the authenticated account
            const account = response.account;
            
            if (account) {
                // Determine correct portal based on user type
                const isGuest = account.username.includes('#EXT#') || 
                              account.username.toLowerCase().includes('clinovators.com');
                              
                const portal = isGuest ? 'customer-portal.html' : 'home.html';
                
                console.log('Redirecting to portal:', portal);
                window.location.href = portal;
                return;
            }
        }
        
        // Check URL parameters for force refresh
        const urlParams = new URLSearchParams(window.location.search);
        const forceRefresh = urlParams.get('forceRefresh');
        
        if (forceRefresh === 'true') {
            console.log('Force refresh requested...');
            await forceRefreshLogin();
            return;
        }
        
        // Initialize auth handler if available
        if (window.AuthHandler) {
            console.log('Initializing AuthHandler...');
            await window.AuthHandler.initialize();
        }
        
    } catch (error) {
        console.error('Auth initialization error:', error);
        // On error, redirect to login
        window.location.href = 'login.html';
    }
});

// Debug logging - only run if we have the required objects
async function logDebugInfo() {
    try {
        // Wait for MSAL to be ready
        if (typeof msal === 'undefined') {
            console.log('MSAL library not loaded yet');
            return;
        }

        // Wait for MSAL instance to be initialized
        if (!window.msalInstance) {
            console.log('MSAL instance not initialized yet');
            return;
        }

        // Check for authenticated user
        const accounts = window.msalInstance.getAllAccounts();
        if (accounts.length === 0) {
            console.log('No authenticated user found');
            return;
        }

        // Log customer organizations if available
        if (window.customerOrganizations) {
            console.log('Customer Organizations:', window.customerOrganizations);
        } else {
            console.log('Customer Organizations not initialized yet');
        }

        // Log current user info
        const email = accounts[0].username;
        const domain = email.split('@')[1].toLowerCase();
        console.log('Current user:', email);

        // Check organization config
        if (window.PlannerConfig && window.PlannerConfig.getOrganizationFromEmail) {
            const org = window.PlannerConfig.getOrganizationFromEmail(email);
            if (org) {
                console.log('Organization config:', org);
                console.log('Organization planner groups:', org.plannerGroups);
            } else {
                console.log('No organization config found for user');
            }
        }

        // Check planner config
        if (window.plannerConfig?.projects) {
            const projects = window.plannerConfig.projects;
            console.log('Project Group IDs:', Object.values(projects).map(p => p.groupId));
            console.log('Expected Group ID:', '00f3ccab-022c-4b18-a290-9849685e3dde');

            // Check project properties
            console.log('Project properties:', Object.values(projects).map(p => ({
                id: p.id,
                name: p.name,
                groupId: p.groupId,
                planId: p.planId
            })));
        } else {
            console.log('Planner config not initialized yet');
        }

        // Check plans data
        if (window.fetchPlansForGroup) {
            try {
                const plans = await window.fetchPlansForGroup('00f3ccab-022c-4b18-a290-9849685e3dde');
                console.log('Raw plans:', plans);
                if (plans && plans.length > 0) {
                    plans.forEach(plan => console.log('Plan group:', plan.owner));
                } else {
                    console.log('No plans found for group');
                }
            } catch (error) {
                console.log('Error fetching plans:', error.message);
            }
        } else {
            console.log('fetchPlansForGroup not available yet');
        }
    } catch (error) {
        console.error('Error in debug logging:', error);
    }
}

// Run debug logging after a delay to allow for initialization
setTimeout(logDebugInfo, 2000);

try {
    // Authentication code
} catch (error) {
    console.error('Authentication error:', error);
    // Show error to user
} 