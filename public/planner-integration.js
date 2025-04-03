// Remove the graphConfig declaration and update the class
class PlannerIntegration {
    constructor() {
        this.msalInstance = null;
        this.account = null;
        this.planIds = [];
        this.defaultPlanId = null;
        // Use the correct base URL for Microsoft Graph API
        this.baseUrl = 'https://graph.microsoft.com/v1.0';
    }

    // Initialize with MSAL instance and account
    async initialize() {
        try {
            // Get the MSAL instance from the global scope
            this.msalInstance = window.msalInstance;
            if (!this.msalInstance) {
                throw new Error('MSAL instance not found');
            }

            const accounts = this.msalInstance.getAllAccounts();
            if (!accounts || accounts.length === 0) {
                throw new Error('No authenticated user found');
            }

            this.account = accounts[0];
            const tenantId = this.account.tenantId;
            
            // First discover available plans
            const availablePlans = await this.discoverPlans();
            console.log('Available Planner plans:', availablePlans);
            
            if (availablePlans.length === 0) {
                console.warn('No Planner plans found in your Teams. Please create a plan first.');
                return false;
            }
            
            // Use the discovered plans directly
            this.planIds = availablePlans.map(p => p.id);
            console.log('Using discovered plan IDs:', this.planIds);
            
            // Update the planner config with the discovered plans
            if (window.plannerConfig) {
                window.plannerConfig.projects = {};
                availablePlans.forEach(plan => {
                    const projectId = plan.title.toLowerCase().replace(/\s+/g, '-');
                    window.plannerConfig.projects[projectId] = {
                        id: projectId,
                        name: plan.title,
                        description: `Planner board for ${plan.groupName}`,
                        planId: plan.id,
                        team: plan.groupName,
                        channel: plan.title,
                        tenantId: tenantId
                    };
                });
                console.log('Updated planner config with discovered plans:', window.plannerConfig.projects);
            }
            
            // Start the smart service if it exists
            if (window.SmartPlannerService) {
                this.smartService = new window.SmartPlannerService(this);
                this.smartService.startTracking();
            } else {
                console.log('SmartPlannerService not available, continuing without it');
            }
            
            return true;
        } catch (error) {
            console.error('Error initializing Planner integration:', error);
            return false;
        }
    }

    // Discover available Planner plans
    async discoverPlans() {
        try {
            const token = await this.getAccessToken();
            if (!token) {
                throw new Error('Failed to get access token');
            }

            console.log('Fetching groups...');
            // Get all groups (teams) the user is a member of
            const groupsResponse = await fetch('https://graph.microsoft.com/v1.0/me/memberOf', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (!groupsResponse.ok) {
                const errorText = await groupsResponse.text();
                console.error('Failed to fetch groups:', {
                    status: groupsResponse.status,
                    statusText: groupsResponse.statusText,
                    error: errorText
                });
                
                // Check if it's a permission error
                if (groupsResponse.status === 403) {
                    console.error('Permission error: The application needs additional permissions to access your groups.');
                    console.error('Please contact your administrator to grant the following permissions:');
                    console.error('- GroupMember.Read.All');
                    console.error('- Group.Read.All');
                    console.error('- Tasks.Read');
                    console.error('- Tasks.ReadWrite');
                    
                    // Try a simpler API call to check if we have basic access
                    try {
                        const meResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Accept': 'application/json'
                            }
                        });
                        
                        if (meResponse.ok) {
                            const meData = await meResponse.json();
                            console.log('Basic user info access works:', meData.displayName);
                            console.log('But group access is restricted. This is a permissions issue.');
                            
                            // Log detailed error information for debugging
                            console.error('Detailed error information:');
                            console.error('- Status: 403 Forbidden');
                            console.error('- Error code: Authorization_RequestDenied');
                            console.error('- Message: Insufficient permissions to complete the operation');
                            console.error('- Client ID: ' + window.b2cConfig?.auth?.clientId);
                            console.error('- Tenant ID: ' + this.account?.tenantId);
                            console.error('- User: ' + this.account?.username);
                            console.error('- Required permissions: GroupMember.Read.All, Group.Read.All, Tasks.Read, Tasks.ReadWrite');
                            console.error('- Current token scopes: ' + JSON.stringify(window.PlannerConfig?.plannerScopes || []));
                        } else {
                            console.error('Even basic user info access is restricted.');
                            console.error('This indicates a more fundamental permissions issue.');
                            console.error('Please check if the User.Read permission is granted in Azure AD.');
                        }
                    } catch (meError) {
                        console.error('Error checking basic access:', meError);
                    }
                }
                
                throw new Error(`Failed to fetch groups: ${groupsResponse.statusText}`);
            }

            const groups = await groupsResponse.json();
            console.log('Found groups:', groups.value.map(g => ({
                id: g.id,
                displayName: g.displayName
            })));

            const plans = [];

            // For each group, try to get its plans
            for (const group of groups.value) {
                try {
                    console.log(`Fetching plans for group: ${group.displayName}`);
                    const plansResponse = await fetch(`https://graph.microsoft.com/v1.0/groups/${group.id}/planner/plans`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json'
                        }
                    });

                    if (!plansResponse.ok) {
                        const errorText = await plansResponse.text();
                        console.error(`Failed to fetch plans for group ${group.displayName}:`, {
                            status: plansResponse.status,
                            statusText: plansResponse.statusText,
                            error: errorText
                        });
                        continue;
                    }

                    const groupPlans = await plansResponse.json();
                    if (groupPlans.value && groupPlans.value.length > 0) {
                        console.log(`Found ${groupPlans.value.length} plans in group ${group.displayName}:`, 
                            groupPlans.value.map(p => ({
                                id: p.id,
                                title: p.title
                            }))
                        );
                        plans.push(...groupPlans.value.map(p => ({
                            id: p.id,
                            title: p.title,
                            groupId: group.id,
                            groupName: group.displayName
                        })));
                    } else {
                        console.log(`No plans found in group ${group.displayName}`);
                    }
                } catch (error) {
                    console.error(`Error fetching plans for group ${group.displayName}:`, error);
                }
            }

            console.log('Total plans discovered:', plans.length);
            return plans;
        } catch (error) {
            console.error('Error discovering plans:', error);
            return [];
        }
    }

    // Get access token for Graph API
    async getAccessToken() {
        try {
            if (!this.msalInstance || !this.account) {
                throw new Error('MSAL instance or account not initialized');
            }

            // Default scopes if not defined in PlannerConfig
            const scopes = window.PlannerConfig?.plannerScopes || ["https://graph.microsoft.com/.default"];
            
            const response = await this.msalInstance.acquireTokenSilent({
                scopes: scopes,
                account: this.account
            });
            return response.accessToken;
        } catch (error) {
            if (error.name === 'InteractionRequiredAuthError') {
                // Fallback to interactive method
                const scopes = window.PlannerConfig?.plannerScopes || ["https://graph.microsoft.com/.default"];
                const response = await this.msalInstance.acquireTokenPopup({
                    scopes: scopes
                });
                return response.accessToken;
            }
            throw error;
        }
    }

    // Check if permissions have been granted correctly
    async checkPermissions() {
        try {
            const token = await this.getAccessToken();
            if (!token) {
                return {
                    success: false,
                    message: 'Failed to get access token',
                    details: null
                };
            }

            const results = {
                success: true,
                message: 'All permissions granted',
                details: {
                    userRead: false,
                    groupRead: false,
                    plannerRead: false,
                    missingPermissions: []
                }
            };

            // Test basic user info access
            try {
                const meResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });
                
                results.details.userRead = meResponse.ok;
                if (!meResponse.ok) {
                    results.details.missingPermissions.push('User.Read');
                }
            } catch (error) {
                console.error('Error checking User.Read permission:', error);
                results.details.missingPermissions.push('User.Read');
            }

            // Test group access
            try {
                const groupsResponse = await fetch('https://graph.microsoft.com/v1.0/me/memberOf', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });
                
                results.details.groupRead = groupsResponse.ok;
                if (!groupsResponse.ok) {
                    results.details.missingPermissions.push('GroupMember.Read.All');
                    results.details.missingPermissions.push('Group.Read.All');
                }
            } catch (error) {
                console.error('Error checking Group permissions:', error);
                results.details.missingPermissions.push('GroupMember.Read.All');
                results.details.missingPermissions.push('Group.Read.All');
            }

            // Test planner access if group access is available
            if (results.details.groupRead) {
                try {
                    const groupsResponse = await fetch('https://graph.microsoft.com/v1.0/me/memberOf', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json'
                        }
                    });
                    
                    const groups = await groupsResponse.json();
                    if (groups.value && groups.value.length > 0) {
                        const groupId = groups.value[0].id;
                        const plansResponse = await fetch(`https://graph.microsoft.com/v1.0/groups/${groupId}/planner/plans`, {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Accept': 'application/json'
                            }
                        });
                        
                        results.details.plannerRead = plansResponse.ok;
                        if (!plansResponse.ok) {
                            results.details.missingPermissions.push('Tasks.Read');
                            results.details.missingPermissions.push('Tasks.ReadWrite');
                        }
                    }
                } catch (error) {
                    console.error('Error checking Planner permissions:', error);
                    results.details.missingPermissions.push('Tasks.Read');
                    results.details.missingPermissions.push('Tasks.ReadWrite');
                }
            } else {
                // If group access is not available, we can't test planner access
                results.details.missingPermissions.push('Tasks.Read');
                results.details.missingPermissions.push('Tasks.ReadWrite');
            }

            // Update success status based on missing permissions
            results.success = results.details.missingPermissions.length === 0;
            results.message = results.success ? 'All permissions granted' : 'Missing permissions: ' + results.details.missingPermissions.join(', ');

            return results;
        } catch (error) {
            console.error('Error checking permissions:', error);
            return {
                success: false,
                message: 'Error checking permissions: ' + error.message,
                details: null
            };
        }
    }

    // Get tasks for a specific plan
    async getTasks(planId) {
        try {
            const token = await this.getAccessToken();
            if (!token) {
                throw new Error('Failed to get access token');
            }

            const response = await fetch(`${this.baseUrl}/planner/plans/${planId}/tasks`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 404) {
                    console.log(`No tasks found for plan ${planId} - this is normal if the plan is new or empty`);
                    return [];
                }
                throw new Error(`Failed to fetch tasks: ${response.statusText}`);
            }

            const data = await response.json();
            return data.value || [];
        } catch (error) {
            console.error(`Error fetching tasks for plan ${planId}:`, error);
            return []; // Return empty array instead of throwing
        }
    }

    // Get all tasks from all plans
    async getAllTasks() {
        try {
            const allTasks = [];
            
            for (const planId of this.planIds) {
                try {
                    const tasks = await this.getTasks(planId);
                    allTasks.push(...tasks);
                } catch (error) {
                    console.log(`Failed to fetch tasks for plan ${planId}:`, error);
                    // Continue with other plans even if one fails
                    continue;
                }
            }
            
            return allTasks;
        } catch (error) {
            console.error('Error fetching all tasks:', error);
            return [];
        }
    }

    // Create a new task in the default plan
    async createTask(taskDetails) {
        try {
            const accessToken = await this.getAccessToken();
            const response = await fetch(
                'https://graph.microsoft.com/v1.0/planner/tasks',
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        planId: this.defaultPlanId,
                        title: taskDetails.title,
                        dueDateTime: taskDetails.dueDate,
                        assignments: taskDetails.assignments || {},
                        ...taskDetails
                    })
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to create task: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating Planner task:', error);
            throw error;
        }
    }

    // Update a task
    async updateTask(taskId, taskDetails) {
        try {
            const accessToken = await this.getAccessToken();
            
            // Get the current etag
            const taskResponse = await fetch(
                `https://graph.microsoft.com/v1.0/planner/tasks/${taskId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Accept': 'application/json'
                    }
                }
            );

            if (!taskResponse.ok) {
                throw new Error(`Failed to fetch task: ${taskResponse.statusText}`);
            }

            const task = await taskResponse.json();
            
            // Update the task
            const response = await fetch(
                `https://graph.microsoft.com/v1.0/planner/tasks/${taskId}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                        'If-Match': task['@odata.etag']
                    },
                    body: JSON.stringify(taskDetails)
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to update task: ${response.statusText}`);
            }

            return true;
        } catch (error) {
            console.error('Error updating Planner task:', error);
            throw error;
        }
    }

    // Get task details including checklist and description
    async getTaskDetails(taskId) {
        try {
            const accessToken = await this.getAccessToken();
            const response = await fetch(
                `https://graph.microsoft.com/v1.0/planner/tasks/${taskId}/details`,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Accept': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch task details: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching task details:', error);
            throw error;
        }
    }
}

// Export the class
if (typeof window !== 'undefined') {
    window.PlannerIntegration = PlannerIntegration;
}

// Create global instance
if (typeof window !== 'undefined' && !window.plannerIntegration) {
    window.plannerIntegration = new PlannerIntegration();
}

// Function to sync project with Planner
async function syncProjectWithPlanner(projectId, planId) {
    try {
        const project = window.projectsData[projectId];
        if (!project) {
            throw new Error('Project not found');
        }

        // Get existing Planner tasks
        const plannerTasks = await window.plannerIntegration.getTasks(planId);
        
        // Sync completed tasks
        for (const task of project.tasks.completed) {
            const existingTask = plannerTasks.find(t => t.title === task.name);
            if (!existingTask) {
                await window.plannerIntegration.createTask({
                    planId: planId,
                    title: task.name,
                    dueDate: task.date,
                    percentComplete: 100
                });
            }
        }
        
        // Sync in-progress tasks
        for (const task of project.tasks.inProgress) {
            const existingTask = plannerTasks.find(t => t.title === task.name);
            if (existingTask) {
                await window.plannerIntegration.updateTask(existingTask.id, {
                    percentComplete: task.progress
                });
            } else {
                await window.plannerIntegration.createTask({
                    planId: planId,
                    title: task.name,
                    percentComplete: task.progress
                });
            }
        }
        
        // Sync upcoming tasks
        for (const task of project.tasks.upcoming) {
            const existingTask = plannerTasks.find(t => t.title === task.name);
            if (!existingTask) {
                await window.plannerIntegration.createTask({
                    planId: planId,
                    title: task.name,
                    dueDate: task.date,
                    percentComplete: 0
                });
            }
        }
        
        return true;
    } catch (error) {
        console.error('Error syncing project with Planner:', error);
        throw error;
    }
}

// Make functions available globally
if (typeof window !== 'undefined') {
    window.plannerApi = {
        getTasks: (planId) => window.plannerIntegration.getTasks(planId),
        createTask: (taskDetails) => window.plannerIntegration.createTask(taskDetails),
        updateTask: (taskId, taskDetails) => window.plannerIntegration.updateTask(taskId, taskDetails),
        syncProjectWithPlanner
    };
}

// Log initialization
console.log('Initialized Planner integration'); 