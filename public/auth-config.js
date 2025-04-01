// MSAL configuration
const msalConfig = {
    auth: {
        clientId: "f70b0b12-7688-4e6a-92da-6dabcf271950",
        authority: "https://login.microsoftonline.com/202abb20-ccd1-4194-aa83-a8e73f57d637",
        redirectUri: window.location.origin + window.location.pathname,
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

// Login request object with required scopes
const loginRequest = {
    scopes: [
        "User.Read",
        "Sites.Read.All",
        "Sites.ReadWrite.All",
        "Files.Read.All",
        "Files.ReadWrite.All"
    ]
};

// Make these available globally
window.msalConfig = msalConfig;
window.loginRequest = loginRequest;

// Initialize MSAL instance only if it doesn't exist
if (!window.msalInstance) {
    window.msalInstance = new msal.PublicClientApplication(msalConfig);
    
    // Handle redirect promise
    window.msalInstance.handleRedirectPromise()
        .then(response => {
            if (response) {
                window.msalInstance.setActiveAccount(response.account);
            } else {
                // Try to select an account
                const accounts = window.msalInstance.getAllAccounts();
                if (accounts.length === 1) {
                    window.msalInstance.setActiveAccount(accounts[0]);
                }
            }
        })
        .catch(error => {
            console.error('Error handling redirect:', error);
        });
}

// Initialize auth handler
window.addEventListener('load', function() {
    if (window.AuthHandler) {
        window.AuthHandler.initialize();
    }
}); 