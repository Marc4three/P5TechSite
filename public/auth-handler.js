// Auth Handler for SharePoint integration
window.AuthHandler = {
    initialize: async function() {
        if (!window.msalInstance) {
            console.error('MSAL instance not found');
            return false;
        }
        
        try {
            // Handle redirect promise
            const response = await window.msalInstance.handleRedirectPromise();
            
            // Check if we're on the login page
            const isLoginPage = window.location.pathname.toLowerCase().includes('login.html');
            
            if (response) {
                // We got a response from a redirect
                window.msalInstance.setActiveAccount(response.account);
                
                // If we're on the login page, redirect to home
                if (isLoginPage) {
                    window.location.replace('home.html');
                }
                return response.account;
            }
            
            // No redirect response, check for existing account
            const accounts = window.msalInstance.getAllAccounts();
            if (accounts.length > 0) {
                const account = accounts[0];
                window.msalInstance.setActiveAccount(account);
                
                // If we're on the login page but already logged in, redirect to home
                if (isLoginPage) {
                    window.location.replace('home.html');
                }
                return account;
            }
            
            // No accounts found
            if (!isLoginPage) {
                // If we're not on the login page, redirect there
                window.location.replace('login.html');
                return null;
            }
            
            return null;
        } catch (error) {
            console.error('Error in initialize:', error);
            if (!isLoginPage) {
                window.location.replace('login.html');
            }
            return null;
        }
    },

    getCurrentAccount: function() {
        const accounts = window.msalInstance?.getAllAccounts() || [];
        if (accounts.length > 0) {
            const account = accounts[0];
            window.msalInstance.setActiveAccount(account);
            return account;
        }
        return null;
    },

    login: async function() {
        if (!window.msalInstance) {
            console.error('MSAL instance not found');
            return null;
        }

        try {
            const loginRequest = window.loginRequest || {
                scopes: [
                    'https://graph.microsoft.com/Sites.Read.All',
                    'https://graph.microsoft.com/Sites.ReadWrite.All',
                    'https://graph.microsoft.com/Files.Read.All',
                    'https://graph.microsoft.com/Files.ReadWrite.All'
                ]
            };
            
            const response = await window.msalInstance.loginPopup(loginRequest);
            window.msalInstance.setActiveAccount(response.account);
            return response.account;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    },

    ensureLoggedIn: async function() {
        const account = this.getCurrentAccount();
        if (!account) {
            return await this.login();
        }
        return account;
    },

    signOut: async function() {
        try {
            // Clear any session storage
            sessionStorage.clear();
            
            // Sign out from MSAL
            await window.msalInstance.logoutRedirect({
                onRedirectNavigate: () => {
                    // Redirect to login page instead of default Microsoft logout page
                    window.location.href = 'login.html';
                    return false;
                }
            });
        } catch (error) {
            console.error('Error during sign out:', error);
            // Ensure we redirect to login page even if there's an error
            window.location.href = 'login.html';
        }
    }
}; 