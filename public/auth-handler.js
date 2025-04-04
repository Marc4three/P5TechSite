// Auth Handler for Microsoft Graph API
class AuthHandler {
    constructor() {
        this.isAuthenticated = false;
        this.currentUser = null;
        this.authCheckInterval = null;
    }

    // Determine which portal to use based on user type
    determineUserPortal(account) {
        if (!account) return 'login.html';
        
        const email = account.username.toLowerCase();
        
        // Check if user is a guest (external) user
        const isGuest = account.username.includes('#EXT#') || 
                       email.includes('clinovators.com');
                       
        // Check if user is internal team member
        const isTeamMember = email.includes('p5techsolutions.com') || 
                           email.includes('p5ts.com');
        
        console.log('User type check:', {
            username: account.username,
            email: email,
            isGuest: isGuest,
            isTeamMember: isTeamMember
        });
        
        // Internal team members go to home.html, guests to customer-portal.html
        if (isTeamMember) {
            return 'home.html';
        } else if (isGuest) {
            return 'customer-portal.html';
        } else {
            // If neither, redirect to login for security
            console.log('Unknown user type, redirecting to login');
            return 'login.html';
        }
    }

    // Initialize the auth handler
    async initialize() {
        console.log('Initializing Auth Handler...');
        
        try {
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
            
            // Check for authenticated user
            const accounts = window.msalInstance.getAllAccounts();
            console.log('Found accounts:', accounts);
            
            if (accounts.length > 0) {
                this.currentUser = accounts[0];
                this.isAuthenticated = true;
                
                // Determine correct portal
                const currentPath = window.location.pathname.split('/').pop();
                const correctPortal = this.determineUserPortal(this.currentUser);
                
                console.log('Portal check:', {
                    currentPath: currentPath,
                    correctPortal: correctPortal,
                    userEmail: this.currentUser.username
                });
                
                // Redirect if user is on wrong portal
                if (currentPath !== correctPortal && !currentPath.includes('login')) {
                    console.log('Redirecting to correct portal...');
                    window.location.href = correctPortal;
                    return true;
                }
                
                console.log('User authenticated:', this.currentUser.username);
                return true;
            }
            
            // No authenticated user, redirect to login
            console.log('No authenticated user found, redirecting to login...');
            window.location.href = 'login.html';
            return false;
            
        } catch (error) {
            console.error('Auth initialization error:', error);
            return false;
        }
    }
    
    // Check if user is authenticated
    async checkAuthentication() {
        if (!window.msalInstance) {
            console.error('MSAL instance not initialized');
            return false;
        }
        
        const accounts = window.msalInstance.getAllAccounts();
        if (accounts.length === 0) {
            this.isAuthenticated = false;
            this.currentUser = null;
            return false;
        }
        
        this.currentUser = accounts[0];
        this.isAuthenticated = true;
        return true;
    }
    
    // Get the current user
    getCurrentUser() {
        return this.currentUser;
    }
    
    // Get the current user's email
    getCurrentUserEmail() {
        return this.currentUser ? this.currentUser.username : null;
    }
    
    // Start periodic authentication checks
    startAuthChecks(intervalMs = 60000) {
        if (this.authCheckInterval) {
            clearInterval(this.authCheckInterval);
        }
        
        this.authCheckInterval = setInterval(async () => {
            const isAuth = await this.checkAuthentication();
            if (!isAuth) {
                console.log('User no longer authenticated, redirecting to login...');
                window.location.href = 'login.html';
            }
        }, intervalMs);
    }
    
    // Stop periodic authentication checks
    stopAuthChecks() {
        if (this.authCheckInterval) {
            clearInterval(this.authCheckInterval);
            this.authCheckInterval = null;
        }
    }
    
    // Login the user
    async login() {
        if (!window.msalInstance) {
            console.error('MSAL instance not initialized');
            return false;
        }
        
        try {
            const response = await window.msalInstance.loginPopup(window.loginRequest);
            this.currentUser = response.account;
            this.isAuthenticated = true;
            return true;
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        }
    }
    
    // Logout the user
    async logout() {
        if (!window.msalInstance) {
            console.error('MSAL instance not initialized');
            return false;
        }
        
        try {
            await window.msalInstance.logoutPopup();
            this.currentUser = null;
            this.isAuthenticated = false;
            return true;
        } catch (error) {
            console.error('Logout failed:', error);
            return false;
        }
    }
}

// Create global instance
if (typeof window !== 'undefined') {
    window.AuthHandler = AuthHandler;
    window.authHandler = new AuthHandler();
}

// Log initialization
console.log('Auth Handler module loaded successfully'); 