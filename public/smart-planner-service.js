// Smart Planner Service
class SmartPlannerService {
    constructor(plannerIntegration) {
        this.plannerIntegration = plannerIntegration;
        this.isTracking = false;
        this.trackingInterval = null;
        this.lastCheck = null;
        this.notificationCallbacks = [];
        this.onTaskUpdate = null; // Add this property to store the callback
        
        console.log('SmartPlannerService initialized');
    }
    
    // Start tracking tasks
    startTracking() {
        if (this.isTracking) {
            console.log('Already tracking tasks');
            return;
        }
        
        this.isTracking = true;
        this.lastCheck = new Date();
        
        // Check for updates every 5 minutes
        this.trackingInterval = setInterval(() => {
            this.checkForUpdates();
        }, 5 * 60 * 1000);
        
        // Also do an immediate check
        this.checkForUpdates();
        
        console.log('Started tracking tasks');
    }
    
    // Stop tracking tasks
    stopTracking() {
        if (!this.isTracking) {
            console.log('Not tracking tasks');
            return;
        }
        
        this.isTracking = false;
        clearInterval(this.trackingInterval);
        this.trackingInterval = null;
        
        console.log('Stopped tracking tasks');
    }
    
    // Check for updates
    async checkForUpdates() {
        if (!this.isTracking) {
            return;
        }
        
        try {
            console.log('Checking for task updates');
            
            // Get all tasks
            const tasks = await this.plannerIntegration.getAllTasks();
            
            // Always call onTaskUpdate with all tasks, regardless of changes
            if (this.onTaskUpdate && typeof this.onTaskUpdate === 'function') {
                console.log('Calling onTaskUpdate with', tasks.length, 'tasks');
                this.onTaskUpdate(tasks);
            }
            
            // Check for changes since last check
            const changes = this.detectChanges(tasks);
            
            // Notify listeners if there are changes
            if (changes.length > 0) {
                this.notifyListeners(changes);
            }
            
            this.lastCheck = new Date();
        } catch (error) {
            console.error('Error checking for updates:', error);
        }
    }
    
    // Detect changes in tasks
    detectChanges(tasks) {
        // This is a simplified implementation
        // In a real app, you would compare with previous state
        return tasks.filter(task => {
            // Consider tasks that have been updated in the last hour
            const lastModified = new Date(task.lastModifiedDateTime);
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
            return lastModified > oneHourAgo;
        });
    }
    
    // Register a callback for notifications
    onUpdate(callback) {
        if (typeof callback === 'function') {
            this.notificationCallbacks.push(callback);
        }
    }
    
    // Notify all listeners
    notifyListeners(changes) {
        this.notificationCallbacks.forEach(callback => {
            try {
                callback(changes);
            } catch (error) {
                console.error('Error in notification callback:', error);
            }
        });
    }
}

// Export the service
window.SmartPlannerService = SmartPlannerService;

// Log that the module has been loaded
console.log('Smart Planner Service module loaded successfully'); 