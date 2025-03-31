// Azure AD Configuration
const msalConfig = {
    auth: {
        clientId: "f70b0b12-7688-4e6a-92da-6dabcf271950", // Application (client) ID
        authority: "https://login.microsoftonline.com/202abb20-ccd1-4194-aa83-a8e73f57d637", // Directory (tenant) ID
        redirectUri: "http://127.0.0.1:5501/",
        postLogoutRedirectUri: "http://127.0.0.1:5501/login.html"
    },
    cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: true
    }
};

// Authentication request scopes
const loginRequest = {
    scopes: [
        "openid",
        "profile",
        "email",
        "offline_access",
        "User.Read"
    ]
};

export { msalConfig, loginRequest }; 