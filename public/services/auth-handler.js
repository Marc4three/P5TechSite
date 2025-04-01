// Singleton instance
let msalInstance = null;
let authPromise = null;

class AuthHandler {
    static initialize() {
        if (!window.msalInstance) {
            throw new Error('MSAL instance not initialized');
        }
        return AuthHandler.handleAuth();
    }

    static async handleAuth() {
        try {
            // Handle redirect promise first
            await window.msalInstance.handleRedirectPromise();
            
            // Check for accounts
            const accounts = window.msalInstance.getAllAccounts();
            if (!accounts || accounts.length === 0) {
                // No accounts found, redirect to login
                await window.msalInstance.loginRedirect(window.loginRequest);
                return;
            }

            // Account found, initialize SharePoint
            if (window.SharePointService) {
                try {
                    await window.SharePointService.initialize(accounts[0]);
                } catch (error) {
                    console.warn('SharePoint initialization failed:', error);
                    // Don't fail auth if SharePoint fails
                }
            }

            return accounts[0];
        } catch (error) {
            console.error('Auth error:', error);
            if (error.errorCode === 'interaction_in_progress') {
                // Clear the interaction in progress
                sessionStorage.clear();
                window.location.reload();
                return;
            }
            throw error;
        }
    }

    static getCurrentAccount() {
        return window.msalInstance?.getAllAccounts()[0] || null;
    }

    static async signOut() {
        if (window.msalInstance) {
            sessionStorage.clear();
            await window.msalInstance.logoutRedirect({
                postLogoutRedirectUri: window.location.origin + '/login.html'
            });
        }
    }
}

// Export the class
window.AuthHandler = AuthHandler; 