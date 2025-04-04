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
        // Check if we have projects in plannerConfig
        if (window.plannerConfig && window.plannerConfig.projects) {
            console.log('Using cached projects from plannerConfig');
            const projects = Object.values(window.plannerConfig.projects);
            
            // Filter projects for the organization's groups
            const orgProjects = projects.filter(project => {
                // Check if the project's group ID is in the organization's plannerGroups
                return organization.plannerGroups?.includes(project.groupId);
            });
            
            console.log('Found projects for organization:', orgProjects);
            return orgProjects;
        }
        
        console.warn('No projects found in plannerConfig, returning empty array');
        return [];
    } catch (error) {
        console.error('Error getting projects:', error);
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