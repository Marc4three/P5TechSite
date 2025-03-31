import { PublicClientApplication, InteractionRequiredAuthError } from "@azure/msal-browser";
import { msalConfig, b2cConfig, loginRequest, b2cPolicies } from "./auth-config.js";

class AuthService {
    constructor() {
        this.msalInstance = new PublicClientApplication(msalConfig);
        this.b2cInstance = new PublicClientApplication(b2cConfig);
        this.account = null;
        this.userType = null;
    }

    // Initialize authentication
    async initialize() {
        await this.msalInstance.initialize();
        await this.b2cInstance.initialize();
        
        // Handle redirect promise
        try {
            const response = await this.msalInstance.handleRedirectPromise();
            if (response) {
                this.account = response.account;
                this.userType = 'internal';
            } else {
                const b2cResponse = await this.b2cInstance.handleRedirectPromise();
                if (b2cResponse) {
                    this.account = b2cResponse.account;
                    this.userType = 'external';
                }
            }
        } catch (error) {
            console.error('Error during redirect handling:', error);
        }
    }

    // Check if user is authenticated
    async checkAuth() {
        if (this.account) {
            return {
                isAuthenticated: true,
                userType: this.userType,
                name: this.account.name,
                username: this.account.username
            };
        }

        // Check for active account
        const currentAccounts = this.msalInstance.getAllAccounts();
        if (currentAccounts.length > 0) {
            this.account = currentAccounts[0];
            this.userType = 'internal';
            return {
                isAuthenticated: true,
                userType: 'internal',
                name: this.account.name,
                username: this.account.username
            };
        }

        // Check B2C accounts
        const b2cAccounts = this.b2cInstance.getAllAccounts();
        if (b2cAccounts.length > 0) {
            this.account = b2cAccounts[0];
            this.userType = 'external';
            return {
                isAuthenticated: true,
                userType: 'external',
                name: this.account.name,
                username: this.account.username
            };
        }

        return { isAuthenticated: false };
    }

    // Login for internal users
    async loginInternal() {
        try {
            const response = await this.msalInstance.loginPopup(loginRequest);
            this.account = response.account;
            this.userType = 'internal';
            return {
                success: true,
                account: response.account
            };
        } catch (error) {
            console.error('Error during internal login:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Login for external users (B2C)
    async loginExternal() {
        try {
            const response = await this.b2cInstance.loginPopup({
                authority: b2cPolicies.signUpSignIn
            });
            this.account = response.account;
            this.userType = 'external';
            return {
                success: true,
                account: response.account
            };
        } catch (error) {
            console.error('Error during external login:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Logout
    async logout() {
        try {
            if (this.userType === 'internal') {
                await this.msalInstance.logout();
            } else {
                await this.b2cInstance.logout();
            }
            this.account = null;
            this.userType = null;
            return { success: true };
        } catch (error) {
            console.error('Error during logout:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Get access token
    async getAccessToken() {
        try {
            const instance = this.userType === 'internal' ? this.msalInstance : this.b2cInstance;
            const account = instance.getAccountByUsername(this.account.username);
            
            const response = await instance.acquireTokenSilent({
                ...loginRequest,
                account: account
            });
            
            return response.accessToken;
        } catch (error) {
            if (error instanceof InteractionRequiredAuthError) {
                // Token expired or user needs to login again
                return this.userType === 'internal' ? 
                    this.loginInternal() : 
                    this.loginExternal();
            }
            throw error;
        }
    }

    // Get user profile
    async getUserProfile() {
        if (!this.account) {
            throw new Error('User not authenticated');
        }

        const token = await this.getAccessToken();
        const response = await fetch('https://graph.microsoft.com/v1.0/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user profile');
        }

        return await response.json();
    }
}

// Create and export a single instance
export const authService = new AuthService(); 