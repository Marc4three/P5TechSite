// MSAL configuration for customer portal (B2C)
const b2cPolicies = {
    names: {
        signUpSignIn: "B2C_1_1_signup_signin"
    },
    authorities: {
        signUpSignIn: {
            authority: "https://p5tsportal.b2clogin.com/p5tsportal.onmicrosoft.com/B2C_1_1_signup_signin"
        }
    },
    authorityDomain: "p5tsportal.b2clogin.com"
};

const b2cConfig = {
    auth: {
        clientId: "239638c9-4484-4eab-8820-9f070d2b1998",
        authority: b2cPolicies.authorities.signUpSignIn.authority,
        knownAuthorities: [b2cPolicies.authorityDomain],
        redirectUri: "http://localhost:5501/customer-portal.html",
        postLogoutRedirectUri: "http://localhost:5501/login.html",
        navigateToLoginRequestUrl: true
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: true
    },
    system: {
        allowNativeBroker: false,
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

// B2C login request configuration
const b2cLoginRequest = {
    scopes: ["offline_access", "openid"],
    prompt: "select_account"
};

// Initialize MSAL instance
if (!window.b2cInstance) {
    window.b2cInstance = new msal.PublicClientApplication(b2cConfig);
}

// MSAL configuration
const msalConfig = {
    auth: {
        clientId: "f70b0b12-7688-4e6a-92da-6dabcf271950",
        authority: "https://login.microsoftonline.com/202abb20-ccd1-4194-aa83-a8e73f57d637",
        redirectUri: "http://localhost:5501/home.html",
        postLogoutRedirectUri: "http://localhost:5501/login.html",
        navigateToLoginRequestUrl: true
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false
    },
    system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case msal.LogLevel.Error:
                        console.error(message);
                        return;
                    case msal.LogLevel.Info:
                        console.info(message);
                        return;
                    case msal.LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case msal.LogLevel.Warning:
                        console.warn(message);
                        return;
                }
            }
        }
    }
};

// Login request object for customer portal
const loginRequest = {
    scopes: ["openid", "profile", "email", "Group.Read.All", "User.Read"],
    redirectUri: "http://localhost:5501/customer-portal.html"
};

// Make configurations available globally
window.msalConfig = msalConfig;
window.loginRequest = loginRequest;

// Initialize MSAL instance
window.msalInstance = new msal.PublicClientApplication(msalConfig);

// Initialize auth handler
window.addEventListener('load', function() {
    if (window.AuthHandler) {
        window.AuthHandler.initialize();
    }
});

// Run this in browser console to see what task data we're getting
const planId = '1fQUq0NDQEyqbwY1NVxMrGUAGgM8'; // Your default board ID from config
window.plannerIntegration.getTasks(planId)
  .then(tasks => {
    console.log('Tasks:', tasks);
    // Let's see what plan/project info we get with each task
    console.log('First task plan info:', tasks[0]?.planId, tasks[0]?.planTitle);
  });

console.log('PlannerConfig state:', {
    exists: !!window.plannerConfig,
    projects: window.plannerConfig?.projects,
    organizations: window.customerOrganizations
});

window.fetchPlansForGroup('00f3ccab-022c-4b18-a290-9849685e3dde')
    .then(plans => console.log('Fresh plans fetch:', plans))
    .catch(err => console.log('Fetch error:', err));

// Check organization detection
const email = window.msalInstance.getAllAccounts()[0].username;
console.log('Current user:', email);
const org = window.PlannerConfig.getOrganizationFromEmail(email);
console.log('Organization config:', org);
console.log('Organization planner groups:', org?.plannerGroups);

// Check if plans match organization groups
const allProjects = window.plannerConfig.projects;
console.log('All cached projects:', allProjects);
Object.values(allProjects).forEach(project => {
    console.log('Project group ID:', project.groupId, 
                'Matches org groups?:', org?.plannerGroups?.includes(project.groupId));
});

// Run this in console
console.log('Customer Organizations:', window.customerOrganizations);
console.log('Current email:', window.msalInstance.getAllAccounts()[0].username);

// Check the specific organization config
const orgConfig = window.customerOrganizations["marcus.norman@clinovators.com"];
console.log('Org Config:', orgConfig);
console.log('Planner Groups:', orgConfig?.plannerGroups);

// Check if group IDs match
const projects = window.plannerConfig.projects;
console.log('Project Group IDs:', Object.values(projects).map(p => p.groupId));
console.log('Expected Group ID:', '00f3ccab-022c-4b18-a290-9849685e3dde');

// Check what properties the cached projects have
console.log('Project properties:', Object.values(window.plannerConfig.projects).map(p => ({
    id: p.id,
    name: p.name,
    groupId: p.groupId,  // This is probably undefined or wrong
    planId: p.planId
})));

// Check the raw plans data
window.fetchPlansForGroup('00f3ccab-022c-4b18-a290-9849685e3dde')
    .then(plans => {
        console.log('Raw plans:', plans);
        // Each plan should have an owner property that contains the group ID
        plans.forEach(plan => console.log('Plan group:', plan.owner));
    }); 