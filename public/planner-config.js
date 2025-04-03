// Planner Configuration
const customerOrganizations = {
    // Clinovators organization
    "marcus.norman@clinovators.com": {
        name: "Clinovators",
        domain: "clinovators.com",
        logoUrl: "images/clinovators-logo.png",
        plannerGroups: [
            "00f3ccab-022c-4b18-a290-9849685e3dde"  // Clinovators Team
        ]
    }
};

const plannerConfig = {
    // Default board settings
    defaultBoard: {
        id: "1fQUq0NDQEyqbwY1NVxMrGUAGgM8",
        name: "Default Board"
    },
    
    // Task settings
    taskSettings: {
        defaultBucket: "To Do",
        defaultPriority: 5,
        defaultPercentComplete: 0
    },
    
    // Organization-specific board mappings
    organizationBoards: {
        "clinovators.com": {
            boardId: "1fQUq0NDQEyqbwY1NVxMrGUAGgM8",
            name: "Clinovators Board",
            teamId: "00f3ccab-022c-4b18-a290-9849685e3dde",  // Clinovators Team ID
            channelId: "19:X1AC2z7AjE-mvZjX9rBuV6BwvAQ3YVJQ7L_rOrrFxz81@thread.tacv2"  // CRM App channel
        }
        // Add other organizations as needed
    },
    
    // Project mappings
    projects: {
        // Projects will be dynamically loaded based on user's group membership
    }
};

// Get organization from email
function getOrganizationFromEmail(email) {
    if (!email) {
        console.error('No email provided to getOrganizationFromEmail');
        return null;
    }
    
    // First check if this is a direct match (for specific users)
    if (customerOrganizations[email.toLowerCase()]) {
        return customerOrganizations[email.toLowerCase()];
    }
    
    // Then check domain
    const domain = email.split('@')[1].toLowerCase();
    
    // Check if we have a matching organization by domain
    const matchingOrg = Object.values(customerOrganizations).find(org => 
        org.domain.toLowerCase() === domain
    );

    console.log('Organization lookup for domain', domain, ':', matchingOrg);
    return matchingOrg;
}

// Get projects for a specific organization
async function getProjectsForOrganization(organization) {
    if (!organization) {
        console.error('No organization provided to getProjectsForOrganization');
        return [];
    }
    
    try {
        // Get current account
        const currentAccounts = window.msalInstance.getAllAccounts();
        if (!currentAccounts || currentAccounts.length === 0) {
            throw new Error('No active account! Please sign in first.');
        }
        
        // Set active account
        window.msalInstance.setActiveAccount(currentAccounts[0]);
        
        // Get the user's groups from Microsoft Graph API
        const token = await window.msalInstance.acquireTokenSilent({
            scopes: ["https://graph.microsoft.com/GroupMember.Read.All"],
            account: currentAccounts[0]
        });

        const groupsResponse = await fetch('https://graph.microsoft.com/v1.0/me/memberOf', {
            headers: {
                'Authorization': `Bearer ${token.accessToken}`,
                'Accept': 'application/json'
            }
        });

        if (!groupsResponse.ok) {
            throw new Error('Failed to fetch groups: ' + groupsResponse.statusText);
        }

        const groups = await groupsResponse.json();
        
        // Filter to only the groups that contain Planner plans
        const plannerGroups = groups.value.filter(group => 
            organization.plannerGroups?.includes(group.id)
        );

        console.log('Found Planner groups:', plannerGroups);

        // Get plans for each group
        const projects = [];
        for (const group of plannerGroups) {
            try {
                // Get a fresh token for each request to avoid expiration
                const planToken = await window.msalInstance.acquireTokenSilent({
                    scopes: ["https://graph.microsoft.com/GroupMember.Read.All"],
                    account: currentAccounts[0]
                });

                const plansResponse = await fetch(`https://graph.microsoft.com/v1.0/groups/${group.id}/planner/plans`, {
                    headers: {
                        'Authorization': `Bearer ${planToken.accessToken}`,
                        'Accept': 'application/json'
                    }
                });

                if (plansResponse.ok) {
                    const plans = await plansResponse.json();
                    projects.push(...plans.value.map(plan => ({
                        id: plan.id,
                        name: plan.title,
                        description: `Planner board for ${group.displayName}`,
                        planId: plan.id,
                        team: group.displayName,
                        channel: plan.title,
                        groupId: group.id
                    })));
                } else {
                    console.error(`Failed to fetch plans for group ${group.displayName}:`, plansResponse.statusText);
                }
            } catch (groupError) {
                console.error(`Error fetching plans for group ${group.displayName}:`, groupError);
                // Continue with other groups even if one fails
                continue;
            }
        }

        console.log('Found projects:', projects);
        return projects;
    } catch (error) {
        console.error('Error getting projects:', error);
        if (error.name === 'BrowserAuthError' || error.message.includes('Please sign in')) {
            // Trigger interactive login if silent token acquisition fails
            try {
                const response = await window.msalInstance.loginPopup({
                    scopes: ["https://graph.microsoft.com/GroupMember.Read.All"]
                });
                if (response?.account) {
                    // Retry getting projects after successful login
                    return getProjectsForOrganization(organization);
                }
            } catch (loginError) {
                console.error('Login failed:', loginError);
            }
        }
        return [];
    }
}

// Get all planner IDs for a tenant
function getAllPlannerIdsForTenant(tenantId) {
    console.log('Getting all planner IDs for tenant:', tenantId);
    
    // If no tenant ID is provided, return all plan IDs
    if (!tenantId) {
        const allPlanIds = [];
        for (const [projectId, project] of Object.entries(plannerConfig.projects)) {
            if (project.planId) {
                allPlanIds.push(project.planId);
            }
        }
        console.log('Found plan IDs:', allPlanIds);
        return allPlanIds;
    }
    
    // If tenant ID is provided, filter by tenant
    const planIds = [];
    for (const [projectId, project] of Object.entries(plannerConfig.projects)) {
        // Check if the project belongs to the tenant
        if (project.tenantId === tenantId && project.planId) {
            planIds.push(project.planId);
        }
    }
    
    console.log('Found plan IDs for tenant', tenantId, ':', planIds);
    return planIds;
}

// Export the configuration and functions
window.customerOrganizations = customerOrganizations;
window.plannerConfig = plannerConfig;
window.PlannerConfig = {
    getProjectsForOrganization: getProjectsForOrganization,
    getOrganizationFromEmail: getOrganizationFromEmail,
    getAllPlannerIdsForTenant: getAllPlannerIdsForTenant,
    plannerScopes: [
        "https://graph.microsoft.com/User.Read",
        "https://graph.microsoft.com/GroupMember.Read.All",
        "https://graph.microsoft.com/Group.Read.All",
        "https://graph.microsoft.com/Tasks.Read",
        "https://graph.microsoft.com/Tasks.ReadWrite"
    ]
};

console.log('Planner config module loaded successfully'); 