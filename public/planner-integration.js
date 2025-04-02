// Microsoft Graph API endpoints
const graphConfig = {
    plannerEndpoint: 'https://graph.microsoft.com/v1.0/planner',
    groupsEndpoint: 'https://graph.microsoft.com/v1.0/groups'
};

// Function to get Planner tasks for a specific project
async function getPlannerTasks(planId) {
    try {
        const token = await window.b2cInstance.acquireTokenSilent({
            scopes: ['Tasks.Read']
        });
        
        const response = await fetch(`${graphConfig.plannerEndpoint}/plans/${planId}/tasks`, {
            headers: {
                'Authorization': `Bearer ${token.accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch Planner tasks');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching Planner tasks:', error);
        throw error;
    }
}

// Function to create a new Planner task
async function createPlannerTask(planId, task) {
    try {
        const token = await window.b2cInstance.acquireTokenSilent({
            scopes: ['Tasks.ReadWrite']
        });
        
        const response = await fetch(`${graphConfig.plannerEndpoint}/tasks`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                planId: planId,
                title: task.title,
                dueDateTime: task.dueDate,
                percentComplete: task.progress,
                assignments: task.assignments
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to create Planner task');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error creating Planner task:', error);
        throw error;
    }
}

// Function to update a Planner task
async function updatePlannerTask(taskId, etag, updates) {
    try {
        const token = await window.b2cInstance.acquireTokenSilent({
            scopes: ['Tasks.ReadWrite']
        });
        
        const response = await fetch(`${graphConfig.plannerEndpoint}/tasks/${taskId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token.accessToken}`,
                'Content-Type': 'application/json',
                'If-Match': etag
            },
            body: JSON.stringify(updates)
        });
        
        if (!response.ok) {
            throw new Error('Failed to update Planner task');
        }
        
        return true;
    } catch (error) {
        console.error('Error updating Planner task:', error);
        throw error;
    }
}

// Function to sync project tasks with Planner
async function syncProjectWithPlanner(projectId, planId) {
    try {
        const project = window.projectsData[projectId];
        if (!project) {
            throw new Error('Project not found');
        }

        // Get existing Planner tasks
        const plannerTasks = await getPlannerTasks(planId);
        
        // Sync completed tasks
        for (const task of project.tasks.completed) {
            const existingTask = plannerTasks.value.find(t => t.title === task.name);
            if (!existingTask) {
                await createPlannerTask(planId, {
                    title: task.name,
                    dueDate: task.date,
                    progress: 100,
                    assignments: {}
                });
            }
        }
        
        // Sync in-progress tasks
        for (const task of project.tasks.inProgress) {
            const existingTask = plannerTasks.value.find(t => t.title === task.name);
            if (existingTask) {
                await updatePlannerTask(existingTask.id, existingTask['@odata.etag'], {
                    percentComplete: task.progress
                });
            } else {
                await createPlannerTask(planId, {
                    title: task.name,
                    progress: task.progress,
                    assignments: {}
                });
            }
        }
        
        // Sync upcoming tasks
        for (const task of project.tasks.upcoming) {
            const existingTask = plannerTasks.value.find(t => t.title === task.name);
            if (!existingTask) {
                await createPlannerTask(planId, {
                    title: task.name,
                    dueDate: task.date,
                    progress: 0,
                    assignments: {}
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
window.plannerIntegration = {
    getPlannerTasks,
    createPlannerTask,
    updatePlannerTask,
    syncProjectWithPlanner
}; 