// MSAL configuration for Azure AD
const msalConfig = {
    auth: {
        clientId: "f70b0b12-7688-4e6a-92da-6dabcf271950",
        authority: "https://login.microsoftonline.com/202abb20-ccd1-4194-aa83-a8e73f57d637",
        redirectUri: window.location.origin + "/home.html", // Set home.html as the default redirect URI
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

// List of allowed pages
const ALLOWED_PAGES = [
    'login.html',
    'home.html',
    'customer-portal.html',
    'admin-portal.html',
    'admin.html',
    'Project-Price-Calculator.html',
    'project-price-calculator.html',
    'release-planner.html',
    'repository.html',
    'polling-test.html'
];

// Login request object with redirect URI
const loginRequest = {
    scopes: [
        "openid",
        "profile",
        "email",
        "Group.Read.All",
        "User.Read",
        "Tasks.Read",
        "Tasks.ReadWrite",
        "Tasks.Read.Shared"
    ],
    prompt: "select_account",
    redirectUri: window.location.origin + "/home.html" // Explicitly set redirect URI for login
};

// Make configurations available globally
window.msalConfig = msalConfig;
window.loginRequest = loginRequest;
window.ALLOWED_PAGES = ALLOWED_PAGES;

// Initialize MSAL instance
if (!window.msalInstance) {
    window.msalInstance = new msal.PublicClientApplication(msalConfig);
}

// Store the original acquireTokenSilent method
const originalAcquireTokenSilent = window.msalInstance.acquireTokenSilent;

// Initialize AuthHandler if not already done
window.AuthHandler = window.AuthHandler || {
    initialize: async function() {
        try {
            if (!window.msalInstance) {
                console.error('MSAL instance not initialized');
                return null;
            }
            
            const accounts = window.msalInstance.getAllAccounts();
            if (accounts.length > 0) {
                window.msalInstance.setActiveAccount(accounts[0]);
                console.log('Active account set to:', accounts[0].username);
                return accounts[0];
            }
            
            console.log('No authenticated accounts found');
            return null;
        } catch (error) {
            console.error('Error initializing AuthHandler:', error);
            return null;
        }
    },
    
    getCurrentAccount: function() {
        try {
            if (!window.msalInstance) {
                console.error('MSAL instance not initialized');
                return null;
            }
            return window.msalInstance.getActiveAccount();
        } catch (error) {
            console.error('Error getting current account:', error);
            return null;
        }
    },
    
    setActiveAccount: function() {
        try {
            if (!window.msalInstance) {
                console.error('MSAL instance not initialized');
                return false;
            }
            
            const accounts = window.msalInstance.getAllAccounts();
            if (accounts.length > 0) {
                window.msalInstance.setActiveAccount(accounts[0]);
                console.log('Active account set to:', accounts[0].username);
                return true;
            }
            
            console.error('No accounts found to set as active');
            return false;
        } catch (error) {
            console.error('Error setting active account:', error);
            return false;
        }
    }
};

// Enhanced error handling for token acquisition
window.msalInstance.acquireTokenSilent = async function(request) {
    try {
        const response = await originalAcquireTokenSilent.call(window.msalInstance, request);
        return response;
    } catch (error) {
        console.error('Silent token acquisition failed:', error);
        if (error.name === 'InteractionRequiredAuthError') {
            try {
                return await window.msalInstance.acquireTokenPopup(request);
            } catch (popupError) {
                console.error('Popup token acquisition failed:', popupError);
                throw popupError;
            }
        }
        throw error;
    }
};

// Simplified navigation handler function
function handleNavigation(url) {
    try {
        console.log('Navigation attempt to:', url);
        
        // Get the target path
        const targetUrl = new URL(url, window.location.origin);
        const targetPath = targetUrl.pathname.split('/').pop().toLowerCase();
        
        console.log('Target path:', targetPath);
        
        // Always allow navigation to login page
        if (targetPath === 'login.html') {
            window.location.href = url;
            return;
        }
        
        // Check if user is authenticated
        const accounts = window.msalInstance.getAllAccounts();
        if (accounts.length === 0) {
            console.log('No authenticated user, redirecting to login');
            // Store the intended destination
            sessionStorage.setItem('redirectAfterLogin', url);
            // Redirect to login with home.html as redirect URI
            window.msalInstance.loginRedirect({
                ...loginRequest,
                redirectUri: window.location.origin + "/home.html"
            });
            return;
        }
        
        // Get user email
        const email = accounts[0].username.toLowerCase();
        console.log('User email:', email);
        
        // Check if user is a team member
        const isTeamMember = email.includes('p5techsolutions.com') || email.includes('p5ts.com');
        console.log('Is team member:', isTeamMember);
        
        // Team members can access all pages
        if (isTeamMember) {
            console.log('Team member accessing:', targetPath);
            window.location.href = url;
            return;
        }
        
        // For guests, only allow specific pages
        const isGuest = email.includes('clinovators.com') || accounts[0].username.includes('#EXT#');
        if (isGuest) {
            if (targetPath === 'customer-portal.html' || 
                (targetPath === 'polling-test.html' && email === 'marcus.norman@clinovators.com')) {
                window.location.href = url;
                return;
            }
            // Redirect guests to customer portal if trying to access restricted page
            window.location.href = 'customer-portal.html';
            return;
        }
        
        // If we get here, user is neither team member nor guest
        console.log('Unknown user type, redirecting to login');
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Navigation error:', error);
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
            const account = response.account;
            if (account) {
                const isGuest = account.username.includes('#EXT#') || 
                              account.username.toLowerCase().includes('clinovators.com');
                const portal = isGuest ? 'customer-portal.html' : 'home.html';
                window.location.href = portal;
                return;
            }
        }
        
        // Initialize auth handler if available
        if (window.AuthHandler) {
            console.log('Initializing AuthHandler...');
            await window.AuthHandler.initialize();
        }
    } catch (error) {
        console.error('Auth initialization error:', error);
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

// Function to check if user is authorized for polling test page
function isAuthorizedForPollingTest() {
    try {
        const currentPath = window.location.pathname.split('/').pop();
        if (currentPath === 'polling-test.html') {
            // Check if MSAL is initialized
            if (!window.msalInstance) {
                console.log('MSAL instance not initialized yet');
                return false;
            }
            
            // Get all accounts
            const accounts = window.msalInstance.getAllAccounts();
            if (accounts.length === 0) {
                console.log('No authenticated user found');
                return false;
            }
            
            const email = accounts[0].username.toLowerCase();
            if (email === 'marcus.norman@clinovators.com' || 
                email === 'marcus.norman@p5techsolutions.com') {
                console.log('Authorized user accessing polling test page:', email);
                return true;
            }
            
            console.log('User not authorized for polling test page:', email);
            return false;
        }
        return false;
    } catch (error) {
        console.error('Error checking authorization:', error);
        return false;
    }
}

// Remove duplicate event listeners by using a flag
if (!window._navigationHandlersInitialized) {
    window._navigationHandlersInitialized = true;
    
    // Add click event listeners to all navigation links
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Setting up navigation handlers');
        
        // Handle link clicks using event delegation
        document.addEventListener('click', function(e) {
            const link = e.target.closest('a');
            if (link && link.href) {
                console.log('Link clicked:', link.href);
                e.preventDefault();
                handleNavigation(link.href);
            }
        });
        
        // Handle form submissions
        document.addEventListener('submit', function(e) {
            const form = e.target;
            if (form && form.action) {
                e.preventDefault();
                handleNavigation(form.action);
            }
        });
    });
}

// Override the auth handler's initialize method for this page
document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM Content Loaded - Setting up auth handler override');
    
    // Get current path
    const currentPath = window.location.pathname.split('/').pop().toLowerCase();
    console.log('Current path:', currentPath);
    
    // Store the original initialize method
    const originalInitialize = window.AuthHandler.initialize;
    
    // Add getCurrentAccount method to AuthHandler
    window.AuthHandler.getCurrentAccount = function() {
        if (!window.msalInstance) {
            console.error('MSAL instance not initialized');
            return null;
        }
        const accounts = window.msalInstance.getAllAccounts();
        return accounts.length > 0 ? accounts[0] : null;
    };
    
    // Set the active account in MSAL
    window.AuthHandler.setActiveAccount = function() {
        if (!window.msalInstance) {
            console.error('MSAL instance not initialized');
            return false;
        }
        
        const accounts = window.msalInstance.getAllAccounts();
        if (accounts.length > 0) {
            window.msalInstance.setActiveAccount(accounts[0]);
            console.log('Active account set to:', accounts[0].username);
            return true;
        }
        
        console.error('No accounts found to set as active');
        return false;
    };
    
    // Override the initialize method for all pages
    window.AuthHandler.initialize = async function() {
        console.log('Using custom auth handler for page:', currentPath);
        
        // Check if MSAL is loaded
        if (typeof msal === 'undefined') {
            console.error('MSAL library not loaded');
            return false;
        }
        
        // Check if MSAL instance exists
        if (!window.msalInstance) {
            console.error('MSAL instance not initialized');
            return false;
        }
        
        // Get all accounts
        const accounts = window.msalInstance.getAllAccounts();
        if (accounts.length > 0) {
            // Set the first account as active
            window.msalInstance.setActiveAccount(accounts[0]);
            console.log('Active account set to:', accounts[0].username);
            
            const email = accounts[0].username.toLowerCase();
            const isTeamMember = email.includes('p5techsolutions.com') || email.includes('p5ts.com');
            
            // Special case for polling test page
            if (currentPath === 'polling-test.html') {
                if (email === 'marcus.norman@clinovators.com' || 
                    email === 'marcus.norman@p5techsolutions.com') {
                    console.log('Authorized user accessing polling test page:', email);
                    if (document.getElementById('authStatus')) {
                        document.getElementById('authStatus').textContent = 'Authorized';
                        document.getElementById('authStatus').style.color = '#34c759';
                    }
                    return accounts[0];
                }
            }
            
            // For team members, allow access to all pages
            if (isTeamMember) {
                console.log('Team member accessing page:', currentPath);
                return accounts[0];
            }
            
            // For guests, only allow customer portal and authorized polling test
            const isGuest = email.includes('clinovators.com') || accounts[0].username.includes('#EXT#');
            if (isGuest) {
                if (currentPath === 'customer-portal.html' || 
                    (currentPath === 'polling-test.html' && email === 'marcus.norman@clinovators.com')) {
                    console.log('Guest accessing allowed page:', currentPath);
                    return accounts[0];
                }
                // Redirect guests to customer portal
                window.location.href = 'customer-portal.html';
                return null;
            }
        }
        
        // For polling test page, always return true to prevent redirection
        if (currentPath === 'polling-test.html') {
            return accounts.length > 0 ? accounts[0] : null;
        }
        
        // For all other pages, check if user is authenticated
        if (accounts.length === 0) {
            window.location.href = 'login.html';
            return null;
        }
        
        return accounts[0];
    };
});

// Remove any existing location.href overrides
delete Object.getOwnPropertyDescriptor(window.location, 'href');
delete Object.getOwnPropertyDescriptor(window.location, 'replace');

// Export functions for use in other files
window.handleNavigation = handleNavigation;
window.ALLOWED_PAGES = ALLOWED_PAGES;

// Add retry logic for network requests
async function retryRequest(fn, maxRetries = 3, delay = 1000) {
    let lastError;
    
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            console.warn(`Request failed (attempt ${i + 1}/${maxRetries}):`, error);
            
            if (error.name === 'BrowserAuthError' && error.errorCode === 'user_cancelled') {
                throw error; // Don't retry if user cancelled
            }
            
            if (i < maxRetries - 1) {
                await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
            }
        }
    }
    
    throw lastError;
}

// Override fetch for Graph API calls
const originalFetch = window.fetch;
window.fetch = async function(url, options) {
    if (url.includes('graph.microsoft.com')) {
        return retryRequest(() => originalFetch(url, options));
    }
    return originalFetch(url, options);
};

// Check network connectivity periodically
function checkNetworkConnectivity() {
    try {
        // Check if we have an authenticated account
        const accounts = window.msalInstance.getAllAccounts();
        if (accounts.length > 0) {
            // Try to get a token silently to check connectivity
            window.msalInstance.acquireTokenSilent({
                ...loginRequest,
                account: accounts[0]
            }).then(() => {
                console.log('Network connectivity check passed');
            }).catch(error => {
                console.error('Network connectivity check failed:', error);
                console.warn('Network connectivity issues detected');
            });
        } else {
            // If no accounts, just check if we can reach the internet
            fetch('https://www.microsoft.com/favicon.ico', { method: 'HEAD' })
                .then(() => {
                    console.log('Network connectivity check passed (no account)');
                })
                .catch(error => {
                    console.error('Network connectivity check failed (no account):', error);
                    console.warn('Network connectivity issues detected');
                });
        }
    } catch (error) {
        console.error('Network connectivity check failed:', error);
        console.warn('Network connectivity issues detected');
    }
}

// Add periodic network check
setInterval(checkNetworkConnectivity, 60000); // Check every minute

async function toggleProjectDetails(event, planId) {
    try {
        // Existing code...
        const tasks = await plannerIntegration.getTasks(planId);
        
        // Add this new code without removing existing logic
        const buckets = await plannerIntegration.getBuckets(planId);
        console.log('Buckets:', buckets);
        
        // Create bucket map
        const bucketMap = {};
        buckets.forEach(bucket => {
            bucketMap[bucket.id] = bucket.name;
        });
        
        // Add bucket names to tasks without changing existing properties
        tasks.forEach(task => {
            task.actualBucketName = bucketMap[task.bucketId];
        });
        
        console.log('Tasks with bucket names:', tasks);
        
        // Log current categorization
        console.log('Current Pending Start:', tasks.filter(t => t.percentComplete === 0).length);
        console.log('Would be Pending Start:', tasks.filter(t => t.actualBucketName?.toLowerCase().includes('to do')).length);

        // Do this for each category
    } catch (error) {
        console.error('Error:', error);
    }
} 