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
function getCustomerOrganization(email) {
    if (!email) {
        console.error('No email provided to getCustomerOrganization');
        return null;
    }
    
    const domain = email.split('@')[1];
    if (!domain) {
        console.error('Invalid email format:', email);
        return null;
    }
    
    const organization = customerOrganizations[domain];
    console.log('Organization lookup for domain', domain, ':', organization);
    return organization;
}

// Get projects for a specific customer
function getCustomerProjects(email) {
    const organization = getCustomerOrganization(email);
    return organization ? organization.projects : [];
}

// Check if a project belongs to a customer
function isProjectForCustomer(projectId, email) {
    const customerProjects = getCustomerProjects(email);
    return customerProjects.includes(projectId);
}

// Make functions and data available globally
window.customerOrganizations = customerOrganizations;
window.getCustomerOrganization = getCustomerOrganization;
window.getCustomerProjects = getCustomerProjects;
window.isProjectForCustomer = isProjectForCustomer;

// Log that the module has been loaded
console.log('Customer data module loaded successfully'); 