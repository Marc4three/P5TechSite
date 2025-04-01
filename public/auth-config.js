// Azure AD Configuration
const msalConfig = {
    auth: {
        clientId: "f70b0b12-7688-4e6a-92da-6dabcf271950",
        authority: "https://login.microsoftonline.com/202abb20-ccd1-4194-aa83-a8e73f57d637",
        redirectUri: "http://localhost:5501/login.html",
        postLogoutRedirectUri: "http://localhost:5501/login.html",
        navigateToLoginRequestUrl: true
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: true
    }
};

// Authentication request scopes
const loginRequest = {
    scopes: ["User.Read"]
}; 