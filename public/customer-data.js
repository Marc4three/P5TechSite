// Customer organization data
const customerOrganizations = {
    'clinovators.com': {
        name: 'Clinovators',
        logo: 'Clinovators Logos-04.png',
        projects: ['patient-portal', 'scheduling-tool']
    },
    'mlt.com': {
        name: 'MLT',
        logo: 'MLT.png',
        projects: ['internal-dashboard', 'crm-dashboards']
    },
    'p5ts.com': {
        name: 'P5TS',
        logo: 'P5TS Logo.png',
        projects: ['rfp-pricing-tool']
    }
};

// Get customer organization based on email
window.getCustomerOrganization = function(email) {
    const domain = email.split('@')[1];
    return customerOrganizations[domain];
};

// Get projects for a specific customer
window.getCustomerProjects = function(email) {
    const organization = window.getCustomerOrganization(email);
    return organization ? organization.projects : [];
};

// Check if a project belongs to a customer
window.isProjectForCustomer = function(projectId, email) {
    const customerProjects = window.getCustomerProjects(email);
    return customerProjects.includes(projectId);
};

// Make functions and data available globally
window.customerOrganizations = customerOrganizations; 