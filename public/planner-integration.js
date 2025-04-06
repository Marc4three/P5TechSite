// Remove the graphConfig declaration and update the class
class PlannerIntegration {
    constructor() {
        this.msalInstance = null;
        this.account = null;
        this.planIds = [];
        this.defaultPlanId = null;
        // Use the correct base URL for Microsoft Graph API
        this.baseUrl = 'https://graph.microsoft.com/v1.0';
        // Define required scopes
        this.requiredScopes = [
            'https://graph.microsoft.com/Group.Read.All',
            'https://graph.microsoft.com/Tasks.Read',
            'https://graph.microsoft.com/Tasks.Read.Shared',
            'https://graph.microsoft.com/User.Read'
        ];
    }

    // Initialize with MSAL instance and account
    async initialize() {
        try {
            console.log('Initializing Planner integration...');
            
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
            
            // Get the current account
            const accounts = window.msalInstance.getAllAccounts();
            if (accounts.length === 0) {
                console.error('No authenticated user found');
                return false;
            }
            
            this.account = accounts[0];
            console.log('Using account:', this.account.username);
            
            // Set the active account in MSAL
            window.msalInstance.setActiveAccount(this.account);
            
            // Check permissions
            const permissions = await this.checkPermissions();
            console.log('Permissions check result:', permissions);
            
            // Get tenant ID from the account
            const tenantId = this.account.tenantId || 'common';
            console.log('Using tenant ID:', tenantId);
            
            // If we don't have Group.Read.All permission, use mock data
            if (!permissions.groupReadAll) {
                console.warn('Group.Read.All permission not available. Using mock data.');
                
                // Create mock data for testing
                if (window.plannerConfig) {
                    window.plannerConfig.projects = {
                        'project-a': {
                            id: 'project-a',
                            name: 'Project A',
                            description: 'Mock project for testing',
                            planId: 'mock-plan-id-1',
                            team: 'Clinovators Team',
                            channel: 'Project A',
                            tenantId: tenantId
                        },
                        'project-b': {
                            id: 'project-b',
                            name: 'Project B',
                            description: 'Mock project for testing',
                            planId: 'mock-plan-id-2',
                            team: 'Clinovators Team',
                            channel: 'Project B',
                            tenantId: tenantId
                        }
                    };
                    console.log('Using mock planner data:', window.plannerConfig.projects);
                }
                
                // Set the plan IDs for mock data
                this.planIds = ['mock-plan-id-1', 'mock-plan-id-2'];
                this.defaultPlanId = 'mock-plan-id-1';
                
                // Start the smart service if it exists
                if (window.SmartPlannerService) {
                    console.log('Creating SmartPlannerService instance...');
                    this.smartService = new window.SmartPlannerService(this);
                    console.log('SmartPlannerService created successfully');
                    
                    // Set up task update listener
                    if (this.smartService) {
                        console.log('Setting up task update listener...');
                        this.smartService.onTaskUpdate = (tasks) => {
                            console.log(`Task update received: ${tasks.length} tasks`);
                            // This will be overridden by the polling-test.html page
                        };
                    }
                } else {
                    console.error('SmartPlannerService not available, continuing without it');
                }
                
                return true;
            }
            
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
                        tenantId: tenantId,
                        groupId: plan.groupId
                    };
                });
                console.log('Updated planner config with discovered plans:', window.plannerConfig.projects);
            }
            
            // Start the smart service if it exists
            if (window.SmartPlannerService) {
                console.log('Creating SmartPlannerService instance...');
                this.smartService = new window.SmartPlannerService(this);
                console.log('SmartPlannerService created successfully');
                
                // Set up task update listener
                if (this.smartService) {
                    console.log('Setting up task update listener...');
                    this.smartService.onTaskUpdate = (tasks) => {
                        console.log(`Task update received: ${tasks.length} tasks`);
                        // This will be overridden by the polling-test.html page
                    };
                }
            } else {
                console.error('SmartPlannerService not available, continuing without it');
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

            // Check if we have the required permissions
            const permissions = await this.checkPermissions();
            
            // If we don't have Group.Read.All permission, return mock data
            if (!permissions.groupReadAll) {
                console.warn('Group.Read.All permission not available. Using mock data.');
                return [
                    {
                        id: 'mock-plan-id-1',
                        title: 'Project A',
                        groupId: '00f3ccab-022c-4b18-a290-9849685e3dde',
                        groupName: 'Mock Team'
                    },
                    {
                        id: 'mock-plan-id-2',
                        title: 'Project B',
                        groupId: '00f3ccab-022c-4b18-a290-9849685e3dde',
                        groupName: 'Mock Team'
                    }
                ];
            }

            // Use the specific target group ID
            const targetGroupId = '00f3ccab-022c-4b18-a290-9849685e3dde';
            console.log(`Fetching plans for group: ${targetGroupId}`);
            
            // Get a fresh token specifically for this request
            const planToken = await this.getAccessToken();
            
            // Directly fetch plans for the target group
            try {
                const plansResponse = await fetch(`https://graph.microsoft.com/v1.0/groups/${targetGroupId}/planner/plans`, {
                    headers: {
                        'Authorization': `Bearer ${planToken}`,
                        'Accept': 'application/json'
                    }
                });
                
                if (plansResponse.ok) {
                    const plansData = await plansResponse.json();
                    console.log('Successfully fetched plans:', plansData);
                    
                    // Get group details to include the group name
                    const groupResponse = await fetch(`https://graph.microsoft.com/v1.0/groups/${targetGroupId}`, {
                        headers: {
                            'Authorization': `Bearer ${planToken}`,
                            'Accept': 'application/json'
                        }
                    });
                    
                    let groupName = 'Clinovators Team';
                    if (groupResponse.ok) {
                        const groupData = await groupResponse.json();
                        groupName = groupData.displayName || 'Clinovators Team';
                    }
                    
                    // Map the plans to the expected format
                    return plansData.value.map(plan => ({
                        id: plan.id,
                        title: plan.title,
                        groupId: targetGroupId,
                        groupName: groupName
                    }));
                } else {
                    const errorText = await plansResponse.text();
                    console.error('Failed to fetch plans:', {
                        status: plansResponse.status,
                        statusText: plansResponse.statusText,
                        error: errorText
                    });
                    
                    // Return mock data if we can't access the real data
                    console.warn('Using mock data due to API error.');
                    return [
                        {
                            id: 'mock-plan-id-1',
                            title: 'Project A',
                            groupId: targetGroupId,
                            groupName: 'Clinovators Team'
                        },
                        {
                            id: 'mock-plan-id-2',
                            title: 'Project B',
                            groupId: targetGroupId,
                            groupName: 'Clinovators Team'
                        }
                    ];
                }
            } catch (planError) {
                console.error('Error fetching plans:', planError);
                
                // Return mock data if we can't access the real data
                console.warn('Using mock data due to error.');
                return [
                    {
                        id: 'mock-plan-id-1',
                        title: 'Project A',
                        groupId: targetGroupId,
                        groupName: 'Clinovators Team'
                    },
                    {
                        id: 'mock-plan-id-2',
                        title: 'Project B',
                        groupId: targetGroupId,
                        groupName: 'Clinovators Team'
                    }
                ];
            }
        } catch (error) {
            console.error('Error discovering plans:', error);
            return [];
        }
    }

    // Get access token for Microsoft Graph API
    async getAccessToken() {
        try {
            // Check if MSAL instance exists
            if (!window.msalInstance) {
                throw new Error('MSAL instance not initialized');
            }

            // Get all accounts
            const accounts = window.msalInstance.getAllAccounts();
            if (accounts.length === 0) {
                throw new Error('No authenticated user found');
            }

            // Try to get token silently first
            try {
                const response = await window.msalInstance.acquireTokenSilent({
                    ...window.loginRequest,
                    account: accounts[0]
                });
                return response.accessToken;
            } catch (silentError) {
                console.log('Silent token acquisition failed, trying interactive:', silentError);
                
                // If silent fails, try interactive
                const response = await window.msalInstance.acquireTokenPopup({
                    ...window.loginRequest,
                    account: accounts[0]
                });
                return response.accessToken;
            }
        } catch (error) {
            console.error(' Error getting access token:', error);
            throw new Error('Failed to get access token: ' + error.message);
        }
    }

    // Check if we have the required permissions
    async checkPermissions() {
        try {
            console.log('Checking permissions...');
            const token = await this.getAccessToken();
            if (!token) {
                throw new Error('Failed to get access token');
            }
            
            console.log('Got access token, checking permissions...');
            
            // Check Group.Read.All permission
            let groupReadAll = false;
            try {
                console.log('Checking Group.Read.All permission...');
                const groupsResponse = await fetch('https://graph.microsoft.com/v1.0/me/memberOf', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });
                
                groupReadAll = groupsResponse.ok;
                console.log('Group.Read.All permission check result:', groupReadAll);
                if (!groupReadAll) {
                    console.error('Group.Read.All permission check failed:', groupsResponse.statusText);
                    const errorText = await groupsResponse.text();
                    console.error('Error details:', errorText);
                }
            } catch (error) {
                console.error('Error checking Group.Read.All permission:', error);
            }
            
            // Check User.Read permission
            let userRead = false;
            try {
                console.log('Checking User.Read permission...');
                const userResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });
                
                userRead = userResponse.ok;
                console.log('User.Read permission check result:', userRead);
                if (!userRead) {
                    console.error('User.Read permission check failed:', userResponse.statusText);
                    const errorText = await userResponse.text();
                    console.error('Error details:', errorText);
                }
            } catch (error) {
                console.error('Error checking User.Read permission:', error);
            }
            
            // Collect missing permissions
            const missingPermissions = [];
            if (!groupReadAll) missingPermissions.push('Group.Read.All');
            if (!userRead) missingPermissions.push('User.Read');
            
            console.log('Permission check results:', {
                groupReadAll,
                userRead,
                missingPermissions,
                hasAllPermissions: missingPermissions.length === 0
            });
            
            // Return the results
            return {
                groupReadAll,
                userRead,
                missingPermissions,
                hasAllPermissions: missingPermissions.length === 0
            };
        } catch (error) {
            console.error('Error checking permissions:', error);
            return {
                groupReadAll: false,
                userRead: false,
                missingPermissions: ['Group.Read.All', 'User.Read'],
                hasAllPermissions: false,
                error: error.message
            };
        }
    }

    // Get tasks for a specific plan
    async getTasks(planId) {
        try {
            // Check if we're using mock data
            if (planId.startsWith('mock-')) {
                console.log('Using mock tasks for plan:', planId);
                return [
                    {
                        id: 'mock-task-1',
                        title: 'Initial Project Setup',
                        planId: planId,
                        bucketId: 'mock-bucket-1',
                        percentComplete: 0,
                        appliedCategories: {},
                        orderHint: ' !',
                        dueDateTime: null
                    },
                    {
                        id: 'mock-task-2',
                        title: 'Requirements Gathering',
                        planId: planId,
                        bucketId: 'mock-bucket-2',
                        percentComplete: 50,
                        appliedCategories: {},
                        orderHint: ' !',
                        dueDateTime: null
                    },
                    {
                        id: 'mock-task-3',
                        title: 'Project Documentation',
                        planId: planId,
                        bucketId: 'mock-bucket-3',
                        percentComplete: 100,
                        appliedCategories: {},
                        orderHint: ' !',
                        dueDateTime: null
                    }
                ];
            }
            
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
                
                // If we get a permission error, return mock data
                if (response.status === 403) {
                    console.warn('Permission error accessing tasks. Using mock data.');
                    return [
                        {
                            id: 'mock-task-1',
                            title: 'Initial Project Setup',
                            planId: planId,
                            bucketId: 'mock-bucket-1',
                            percentComplete: 0,
                            appliedCategories: {},
                            orderHint: ' !',
                            dueDateTime: null
                        },
                        {
                            id: 'mock-task-2',
                            title: 'Requirements Gathering',
                            planId: planId,
                            bucketId: 'mock-bucket-2',
                            percentComplete: 50,
                            appliedCategories: {},
                            orderHint: ' !',
                            dueDateTime: null
                        },
                        {
                            id: 'mock-task-3',
                            title: 'Project Documentation',
                            planId: planId,
                            bucketId: 'mock-bucket-3',
                            percentComplete: 100,
                            appliedCategories: {},
                            orderHint: ' !',
                            dueDateTime: null
                        }
                    ];
                }
                
                throw new Error(`Failed to fetch tasks: ${response.statusText}`);
            }

            const data = await response.json();
            return data.value || [];
        } catch (error) {
            console.error(`Error fetching tasks for plan ${planId}:`, error);
            
            // Return mock data on error
            console.warn('Using mock tasks due to error.');
            return [
                {
                    id: 'mock-task-1',
                    title: 'Initial Project Setup',
                    planId: planId,
                    bucketId: 'mock-bucket-1',
                    percentComplete: 0,
                    appliedCategories: {},
                    orderHint: ' !',
                    dueDateTime: null
                },
                {
                    id: 'mock-task-2',
                    title: 'Requirements Gathering',
                    planId: planId,
                    bucketId: 'mock-bucket-2',
                    percentComplete: 50,
                    appliedCategories: {},
                    orderHint: ' !',
                    dueDateTime: null
                },
                {
                    id: 'mock-task-3',
                    title: 'Project Documentation',
                    planId: planId,
                    bucketId: 'mock-bucket-3',
                    percentComplete: 100,
                    appliedCategories: {},
                    orderHint: ' !',
                    dueDateTime: null
                }
            ];
        }
    }

    // Get all tasks from all plans
    async getAllTasks() {
        try {
            console.log('Getting all tasks from all plans...');
            const allTasks = [];
            
            for (const planId of this.planIds) {
                try {
                    console.log(`Fetching tasks for plan ${planId}...`);
                    const tasks = await this.getTasks(planId);
                    console.log(`Found ${tasks.length} tasks for plan ${planId}`);
                    allTasks.push(...tasks);
                } catch (error) {
                    console.error(`Failed to fetch tasks for plan ${planId}:`, error);
                    // Continue with other plans even if one fails
                    continue;
                }
            }
            
            console.log(`Total tasks found: ${allTasks.length}`);
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
            const token = await this.getAccessToken();
            if (!token) {
                throw new Error('Failed to get access token');
            }

            const response = await fetch(`${this.baseUrl}/planner/tasks/${taskId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch task details: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Error fetching task details for ${taskId}:`, error);
            return null;
        }
    }

    // Get buckets for a specific plan
    async getBuckets(planId) {
        try {
            // Check if we're using mock data
            if (planId.startsWith('mock-')) {
                console.log('Using mock buckets for plan:', planId);
                return [
                    {
                        id: 'mock-bucket-1',
                        name: 'To Do',
                        planId: planId,
                        orderHint: ' !'
                    },
                    {
                        id: 'mock-bucket-2',
                        name: 'In Progress',
                        planId: planId,
                        orderHint: ' !'
                    },
                    {
                        id: 'mock-bucket-3',
                        name: 'Completed',
                        planId: planId,
                        orderHint: ' !'
                    }
                ];
            }
            
            const token = await this.getAccessToken();
            if (!token) {
                throw new Error('Failed to get access token');
            }

            console.log(`Fetching buckets for plan ${planId}...`);
            const response = await fetch(`${this.baseUrl}/planner/plans/${planId}/buckets`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 404) {
                    console.log(`No buckets found for plan ${planId} - this is normal if the plan is new or empty`);
                    return [];
                }
                
                // If we get a permission error, return mock data
                if (response.status === 403) {
                    console.warn('Permission error accessing buckets. Using mock data.');
                    return [
                        {
                            id: 'mock-bucket-1',
                            name: 'To Do',
                            planId: planId,
                            orderHint: ' !'
                        },
                        {
                            id: 'mock-bucket-2',
                            name: 'In Progress',
                            planId: planId,
                            orderHint: ' !'
                        },
                        {
                            id: 'mock-bucket-3',
                            name: 'Completed',
                            planId: planId,
                            orderHint: ' !'
                        }
                    ];
                }
                
                throw new Error(`Failed to fetch buckets: ${response.statusText}`);
            }

            const data = await response.json();
            console.log(`Found ${data.value.length} buckets for plan ${planId}:`, data.value);
            return data.value || [];
        } catch (error) {
            console.error(`Error fetching buckets for plan ${planId}:`, error);
            
            // Return mock data on error
            console.warn('Using mock buckets due to error.');
            return [
                {
                    id: 'mock-bucket-1',
                    name: 'To Do',
                    planId: planId,
                    orderHint: ' !'
                },
                {
                    id: 'mock-bucket-2',
                    name: 'In Progress',
                    planId: planId,
                    orderHint: ' !'
                },
                {
                    id: 'mock-bucket-3',
                    name: 'Completed',
                    planId: planId,
                    orderHint: ' !'
                }
            ];
        }
    }

    // Fetch all Microsoft Planner plan IDs associated with a specific Microsoft 365 Group ID
    async fetchPlansByGroupId(groupId) {
        try {
            const token = await this.getAccessToken();
            if (!token) {
                throw new Error('Failed to get access token');
            }
            
            try {
                const response = await fetch(
                    `${this.baseUrl}/groups/${groupId}/planner/plans`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json'
                        }
                    }
                );
                
                if (!response.ok) {
                    if (response.status === 403) {
                        throw new Error('Access denied. Please check your permissions.');
                    }
                    throw new Error(`Failed to fetch plans: ${response.statusText}`);
                }
                
                const data = await response.json();
                
                if (!data.value || data.value.length === 0) {
                    const message = "No plans found for this group. Please check that the team has Planner set up.";
                    console.warn(message);
                    if (window.showError) {
                        window.showError(message);
                    }
                    return [];
                }
                
                // Log each plan's id and title
                data.value.forEach(plan => {
                    console.log(`Plan ID: ${plan.id}, Title: ${plan.title}`);
                });
                
                return data.value.map(plan => ({
                    id: plan.id,
                    title: plan.title
                }));
            } catch (fetchError) {
                // Check if the error is due to tracking prevention
                if (fetchError.message.includes('Failed to fetch') || 
                    fetchError.name === 'TypeError' || 
                    fetchError.message.includes('NetworkError')) {
                    const trackingMessage = "Your browser's tracking prevention may be blocking access to Microsoft Planner. Please allow access or try using a different browser.";
                    console.warn(trackingMessage);
                    if (window.showError) {
                        window.showError(trackingMessage);
                    }
                }
                throw fetchError;
            }
        } catch (error) {
            console.error('Error fetching plans by group ID:', error);
            throw error;
        }
    }

    async updateTaskBucket(taskId, bucketId) {
        try {
            console.log(`Updating task ${taskId} to bucket ${bucketId}`);
            
            // Check if we're using mock data
            if (taskId.startsWith('mock-') || bucketId.startsWith('mock-')) {
                console.log('Using mock data for task bucket update');
                return true;
            }
            
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
            
            // Update the task's bucket
            const response = await fetch(
                `https://graph.microsoft.com/v1.0/planner/tasks/${taskId}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                        'If-Match': task['@odata.etag']
                    },
                    body: JSON.stringify({
                        bucketId: bucketId
                    })
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to update task bucket: ${response.statusText}`);
            }

            console.log(`Successfully updated task ${taskId} to bucket ${bucketId}`);
            return true;
        } catch (error) {
            console.error('Error updating task bucket:', error);
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

// Utility function to fetch plans for a specific group
async function fetchPlansForGroup(groupId = '00f3ccab-022c-4b18-a290-9849685e3dde') {
    try {
        // Ensure the PlannerIntegration is initialized
        if (!window.plannerIntegration) {
            window.plannerIntegration = new PlannerIntegration();
            await window.plannerIntegration.initialize();
        }
        
        // Fetch plans for the specified group
        const plans = await window.plannerIntegration.fetchPlansByGroupId(groupId);
        console.log(`Found ${plans.length} plans for group ${groupId}:`, plans);
        return plans;
    } catch (error) {
        console.error('Error fetching plans for group:', error);
        return [];
    }
}

// Make the utility function available globally
if (typeof window !== 'undefined') {
    window.fetchPlansForGroup = fetchPlansForGroup;
} 