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
        authority: "https://login.microsoftonline.com/common",
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
    scopes: ["openid", "profile", "email"],
    redirectUri: "http://localhost:5501/home.html"
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