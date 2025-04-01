// Initialize MSAL and SharePoint service
window.msalInstance = window.msalInstance || new msal.PublicClientApplication(msalConfig);
window.sharePointService = new SharePointService(window.msalInstance);
window.siteName = 'P5TS Quote Repository';
window.libraryName = 'Project Price Calculator';
window.currentSiteId = null;

// Initialize projects and customers
window.projects = [];
window.customers = {
    'clinovators': {
        clientRate: 60,
        devRate: 50
    },
    'custom': {
        clientRate: 150,
        devRate: 125
    },
    'mlt': {
        clientRate: 150,
        devRate: 125
    },
    'points-of-light': {
        clientRate: 150,
        devRate: 125
    }
};

// State management functions - export to window object
window.showLoading = function() {
    document.getElementById('loadingState').style.display = 'flex';
    document.getElementById('errorState').style.display = 'none';
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('projectsGrid').style.display = 'none';
    
    // Add visible class after a small delay to trigger animation
    setTimeout(() => {
        document.getElementById('loadingState').classList.add('visible');
    }, 10);
};

window.showError = function(message) {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('errorState').style.display = 'flex';
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('projectsGrid').style.display = 'none';
    
    if (message && document.getElementById('errorMessage')) {
        document.getElementById('errorMessage').textContent = message;
    }
    
    setTimeout(() => {
        document.getElementById('errorState').classList.add('visible');
    }, 10);
};

window.showEmpty = function() {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('errorState').style.display = 'none';
    document.getElementById('emptyState').style.display = 'flex';
    document.getElementById('projectsGrid').style.display = 'none';
    
    setTimeout(() => {
        document.getElementById('emptyState').classList.add('visible');
    }, 10);
};

window.showProjects = function() {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('errorState').style.display = 'none';
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('projectsGrid').style.display = 'grid';
};

// Export other functions to window
window.refreshFilesList = async function() {
    try {
        console.log('Starting refresh files list...');
        window.showLoading();

        // Get SharePoint service instance
        if (!window.currentSiteId) {
            console.log('Getting SharePoint site ID...');
            window.currentSiteId = await window.sharePointService.getSiteId(window.siteName);
            console.log('Retrieved site ID:', window.currentSiteId);
        }

        console.log('Fetching files from SharePoint...');
        const filesData = await window.sharePointService.listFiles(window.currentSiteId, window.libraryName);
        console.log('Raw files data:', filesData);

        if (!filesData || !filesData.value || filesData.value.length === 0) {
            console.log('No files found in response');
            window.showEmpty();
            return;
        }

        // Rest of the refreshFilesList function...
    } catch (error) {
        console.error('Error refreshing files:', error);
        window.showError(error.message);
    }
};

// Initialize the repository page
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('Initializing repository...');
        showLoading();
        
        // Check authentication
        const accounts = window.msalInstance.getAllAccounts();
        console.log('MSAL accounts:', accounts);
        
        if (accounts.length === 0) {
            console.log('No authenticated accounts found, redirecting to login...');
            window.location.href = '/login.html';
            return;
        }

        // Get SharePoint site ID
        console.log('Getting SharePoint site ID for:', window.siteName);
        window.currentSiteId = await window.sharePointService.getSiteId(window.siteName);
        console.log('Retrieved site ID:', window.currentSiteId);
        
        if (!window.currentSiteId) {
            throw new Error('Failed to retrieve SharePoint site ID');
        }
        
        // Load projects from SharePoint
        console.log('Loading projects from SharePoint...');
        await loadProjectsFromSharePoint();
        
        // Setup event listeners
        setupEventListeners();
        
        // Initial render
        renderProjects(window.projects);
    } catch (error) {
        console.error('Initialization error:', error);
        showError(error.message || 'Error initializing the repository. Please try again.');
    }
});

function setupEventListeners() {
    const customerFilter = document.getElementById('customer-filter');
    const typeFilter = document.getElementById('source-filter');
    const searchInput = document.getElementById('searchInput');
    const sortBy = document.getElementById('sortBy');
    const retryButton = document.getElementById('retryButton');
    
    // Add event listeners for filters
    if (customerFilter) {
        customerFilter.addEventListener('change', (e) => {
            if (e.target.value === 'add-new') {
                showNewCustomerOverlay();
            } else {
                filterAndSortProjects();
            }
        });
    }
    
    if (typeFilter) {
        typeFilter.addEventListener('change', filterAndSortProjects);
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', filterAndSortProjects);
    }
    
    if (sortBy) {
        sortBy.addEventListener('change', filterAndSortProjects);
    }
    
    // Add retry button handler
    if (retryButton) {
        retryButton.addEventListener('click', async () => {
            showLoading();
            try {
                await loadProjectsFromSharePoint();
                renderProjects(window.projects);
            } catch (error) {
                console.error('Retry failed:', error);
                showError(error.message || 'Failed to load projects. Please try again.');
            }
        });
    }

    // Add customer management handlers
    const newCustomerForm = document.getElementById('new-customer-form');
    if (newCustomerForm) {
        newCustomerForm.addEventListener('submit', addNewCustomer);
    }

    const closeButton = document.querySelector('.close-button');
    if (closeButton) {
        closeButton.addEventListener('click', hideNewCustomerOverlay);
    }

    const cancelButton = document.getElementById('cancelCustomer');
    if (cancelButton) {
        cancelButton.addEventListener('click', hideNewCustomerOverlay);
    }
}

function filterAndSortProjects() {
    const customerValue = document.getElementById('customer-filter').value;
    const typeValue = document.getElementById('source-filter').value;
    const searchValue = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const sortValue = document.getElementById('sortBy')?.value;
    
    // Filter projects
    let filtered = window.projects.filter(project => {
        const matchesCustomer = customerValue === 'all' || project.customer?.toLowerCase() === customerValue;
        const matchesType = typeValue === 'all' || project.type === typeValue;
        const matchesSearch = !searchValue || 
            project.name.toLowerCase().includes(searchValue) ||
            project.customer?.toLowerCase().includes(searchValue);
        
        return matchesCustomer && matchesType && matchesSearch;
    });
    
    // Sort projects if sort value is provided
    if (sortValue) {
        filtered.sort((a, b) => {
            switch (sortValue) {
                case 'date-desc':
                    return new Date(b.createdDate) - new Date(a.createdDate);
                case 'date-asc':
                    return new Date(a.createdDate) - new Date(b.createdDate);
                case 'name-asc':
                    return a.name.localeCompare(b.name);
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                case 'customer-asc':
                    return (a.customer || '').localeCompare(b.customer || '');
                case 'customer-desc':
                    return (b.customer || '').localeCompare(a.customer || '');
                default:
                    return 0;
            }
        });
    }
    
    renderProjects(filtered);
}

// Load projects from SharePoint
async function loadProjectsFromSharePoint() {
    try {
        console.log('Loading projects from SharePoint...');
        showLoading();
        
        const siteId = await window.sharePointService.getSiteId('P5TSQuoteRepository');
        console.log('Got site ID:', siteId);
        
        const files = await window.sharePointService.listFiles(siteId, 'Project Price Calculator');
        console.log('Files loaded:', files);

        if (!files.value || files.value.length === 0) {
            console.log('No files found');
            showEmpty();
            return;
        }

        // Filter out any undefined or invalid files
        const validFiles = files.value.filter(file => 
            file && 
            file.name && 
            file.name.endsWith('.json') && 
            !file.name.startsWith('~') &&
            !file.name.startsWith('project_repository') // Exclude the repository file
        );
        console.log('Valid files:', validFiles);

        window.projects = validFiles.map(file => {
            console.log('Processing file:', file);
            try {
                const content = file.content || {};
                // Use the content directly as it contains the project data
                return {
                    id: file.id,
                    name: content.projectName || content.name || file.name.replace('.json', '').replace(/_/g, ' '),
                    customer: content.customer || content.customerSelect || 'Unknown',
                    type: content.type || 'project-price',
                    status: content.status || 'Draft',
                    totalProjectCost: parseFloat(content.totalProjectCost) || 0,
                    monthlyCustomerPayment: parseFloat(content.monthlyCustomerPayment) || 0,
                    duration: parseInt(content.duration) || 0,
                    createdDate: file.createdDateTime,
                    modifiedDate: file.lastModifiedDateTime,
                    rawContent: content
                };
            } catch (error) {
                console.warn(`Error processing file ${file.name}:`, error);
                return null;
            }
        }).filter(project => project !== null); // Remove any failed conversions

        console.log('Processed projects:', window.projects);
        
        if (window.projects.length === 0) {
            showEmpty();
        } else {
            renderProjects();
        }
    } catch (error) {
        console.error('Error loading projects:', error);
        showError(error.message);
    }
}

function renderProjects() {
    const container = document.getElementById('projectsGrid');
    container.innerHTML = '';

    if (!window.projects || window.projects.length === 0) {
        showEmpty();
        return;
    }

    window.projects.forEach(project => {
    const card = document.createElement('div');
    card.className = 'project-card';
        
        // Calculate monthly amount
        const monthlyAmount = project.monthlyCustomerPayment || (project.totalProjectCost / (project.duration || 1));
    
    card.innerHTML = `
        <div class="project-header">
            <div class="header-content">
                    <h3>${project.name || 'Unnamed Project'}</h3>
                    <div class="quote-source ${project.type || 'project-price'}">
                        <i class="fas ${project.type === 'release-planner' ? 'fa-calendar-alt' : 'fa-calculator'}"></i>
                        ${project.type === 'release-planner' ? 'Release Plan' : 'Project Price'}
                    </div>
                </div>
                <div class="status-badge ${(project.status || 'draft').toLowerCase()}">${project.status || 'Draft'}</div>
            </div>
            <div class="project-details">
                <div class="customer-info">
                    <p class="customer-name">${project.customer || 'Unknown'}</p>
                </div>
                <div class="cost-details">
                    <div class="total-cost">
                        <span class="label">Total Cost</span>
                        <span class="amount">${formatCurrency(project.totalProjectCost || 0)}</span>
                    </div>
                    <div class="monthly-cost">
                        <span class="label">Monthly</span>
                        <span class="amount">${formatCurrency(monthlyAmount || 0)}</span>
                    </div>
                </div>
                <div class="duration-info">
                    <i class="fas fa-clock"></i>
                    <span>${project.duration || 0} month${project.duration !== 1 ? 's' : ''}</span>
        </div>
        </div>
            <div class="action-buttons">
                <button onclick="viewProject('${project.id}')" class="action-button primary">
                    <i class="fas fa-eye"></i>
                    View Details
                </button>
                <button onclick="editProject('${project.id}')" class="action-button secondary">
                    <i class="fas fa-edit"></i>
                    Edit
                </button>
                <button onclick="deleteProject('${project.id}')" class="action-button danger">
                    <i class="fas fa-trash"></i>
                    Delete
                </button>
        </div>
    `;
        container.appendChild(card);
    });

    // Show the grid and hide other states
    document.getElementById('projectsGrid').style.display = 'grid';
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('errorState').style.display = 'none';
    document.getElementById('emptyState').style.display = 'none';
}

async function deleteProject(fileId) {
    if (!confirm('Are you sure you want to delete this project?')) {
        return;
    }

    try {
        const siteId = await window.sharePointService.getSiteId('P5TSQuoteRepository');
        await window.sharePointService.deleteFile(siteId, 'Project Price Calculator', fileId);
        await loadProjectsFromSharePoint(); // Refresh the list
    } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project: ' + error.message);
    }
}

async function editProject(fileId) {
    try {
        // Store the file ID in session storage for the calculator page
        sessionStorage.setItem('editProjectId', fileId);
        window.location.href = 'Project-Price-Calculator.html';
    } catch (error) {
        console.error('Error preparing project edit:', error);
        alert('Failed to prepare project for editing: ' + error.message);
    }
}

// Save project to SharePoint
async function saveProjectToSharePoint(project) {
    try {
        // Ensure project has required fields
        project = {
            ...project,
            id: project.id || Date.now().toString(),
            type: project.type || 'project-price',
            status: project.status || 'draft'
        };

        // Create a consistent file name
        const fileName = `${project.name.replace(/\s+/g, '_')}_${project.id}.json`;
        const fileContent = JSON.stringify(project, null, 2);
        const file = new Blob([fileContent], { type: 'application/json' });
        
        await window.sharePointService.uploadFile(
            window.currentSiteId, 
            window.libraryName, 
            fileName, 
            file, 
            project.type
        );
        
        console.log('Project saved successfully:', fileName);
    } catch (error) {
        console.error('Error saving project to SharePoint:', error);
        throw error;
    }
}

// Helper function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

// Project actions
function viewProject(id) {
    console.log('Viewing project:', id);
    showQuoteDetails(id, false);
}

function editQuote(project) {
    console.log('Editing quote:', project);
    showQuoteDetails(project, true);  // Show in edit mode
}

async function deleteQuote(project) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
        console.log('Deleting project:', project);
        
        // Get current repository file
        const files = await window.sharePointService.listFiles(window.currentSiteId, window.libraryName);
        const repositoryFile = files.value.find(f => f.name === 'project_repository.json');
        
        if (repositoryFile) {
            const response = await fetch(repositoryFile['@microsoft.graph.downloadUrl']);
            let existingProjects = await response.json();
            
            // Remove the project
            existingProjects = existingProjects.filter(p => p.id !== project.id);
            
            // Save updated repository back to SharePoint
            const fileContent = JSON.stringify(existingProjects, null, 2);
            const file = new Blob([fileContent], { type: 'application/json' });
            
            await window.sharePointService.uploadFile(window.currentSiteId, window.libraryName, 'project_repository.json', file);
            
            // Update local array and re-render
            window.projects = existingProjects;
    renderProjects(window.projects);
}
    } catch (error) {
        console.error('Error deleting project:', error);
        alert('Error deleting project. Please try again.');
    }
}

// Update showQuoteDetails function to handle both viewing and editing
function showQuoteDetails(project, isEditMode = false) {
    console.log('Showing quote details:', project, 'Edit mode:', isEditMode);

    const overlay = document.getElementById('quoteDetailsOverlay');
    const content = document.getElementById('quoteDetailsContent');
    
    // Set the current project data
    content.dataset.projectId = project.id;
    
    // Update form fields
    document.getElementById('editProjectName').value = project.name;
    document.getElementById('editCustomer').value = project.customer;
    document.getElementById('editStatus').value = project.status || 'draft';
    document.getElementById('editDuration').value = project.duration || 1;
    document.getElementById('editProfitAdjustment').value = project.profitAdjustment || 0;

    // Update financial summary
    document.getElementById('monthlyRevenue').textContent = formatCurrency(project.monthlyRevenue || 0);
    document.getElementById('monthlyTeamPayout').textContent = formatCurrency(project.monthlyTeamPayout || 0);
    document.getElementById('monthlyCustomerPayment').textContent = formatCurrency(project.monthlyCustomerPayment || 0);
    document.getElementById('monthlyProfit').textContent = formatCurrency(project.monthlyProfit || 0);
    document.getElementById('totalProjectCost').textContent = formatCurrency(project.totalProjectCost || 0);

    // Handle roles
        const rolesGrid = document.getElementById('editRolesGrid');
        rolesGrid.innerHTML = '';
        
    if (project.roles && project.roles.length > 0) {
        project.roles.forEach(role => {
                const roleCard = document.createElement('div');
                roleCard.className = 'edit-role-card';
                roleCard.innerHTML = `
                    <div class="edit-role-header">
                        <h4>${role.title}</h4>
                        <div class="edit-my-job">
                            <input type="checkbox" ${role.isMyJob ? 'checked' : ''} ${!isEditMode ? 'disabled' : ''}>
                            <label>My Job</label>
                        </div>
                    </div>
                    <div class="edit-role-inputs">
                        <div>
                            <label>Hours</label>
                        <input type="number" value="${role.hours}" ${!isEditMode ? 'disabled' : ''}>
                        </div>
                        <div>
                        <label>Client Rate</label>
                        <input type="number" value="${role.clientRate}" ${!isEditMode ? 'disabled' : ''}>
                    </div>
                    <div>
                        <label>Dev Rate</label>
                        <input type="number" value="${role.devRate}" ${!isEditMode ? 'disabled' : ''}>
                        </div>
                    </div>
                `;
                rolesGrid.appendChild(roleCard);
            });
        }

    // Set form fields disabled/enabled based on mode
    const inputs = content.querySelectorAll('input, select');
    inputs.forEach(input => input.disabled = !isEditMode);

    // Show/hide action buttons based on mode
    const saveButton = document.getElementById('saveQuoteChanges');
    const editButton = document.getElementById('editQuote');
    const deleteButton = document.getElementById('deleteQuote');
    
    if (isEditMode) {
        saveButton.style.display = 'block';
        editButton.style.display = 'none';
        deleteButton.style.display = 'block';
        
        // Add save handler
        saveButton.onclick = () => saveQuoteChanges(project);
    } else {
        saveButton.style.display = 'none';
        editButton.style.display = 'block';
        deleteButton.style.display = 'none';
        
        // Add edit handler
        editButton.onclick = () => showQuoteDetails(project, true);
    }

    // Show the overlay
    overlay.style.display = 'flex';
}

// Add save changes functionality
async function saveQuoteChanges(project) {
    try {
        // Get updated values
        const updatedProject = {
            ...project,
            name: document.getElementById('editProjectName').value,
            customer: document.getElementById('editCustomer').value,
            status: document.getElementById('editStatus').value,
            duration: parseInt(document.getElementById('editDuration').value) || 1,
            profitAdjustment: parseFloat(document.getElementById('editProfitAdjustment').value) || 0,
            roles: []
        };

        // Get updated roles
        document.querySelectorAll('.edit-role-card').forEach(card => {
            const inputs = card.querySelectorAll('input');
            const isMyJob = card.querySelector('input[type="checkbox"]').checked;
            const hours = parseInt(inputs[1].value) || 0;
            const clientRate = parseFloat(inputs[2].value) || 0;
            const devRate = parseFloat(inputs[3].value) || 0;

            if (hours > 0) {
                updatedProject.roles.push({
                    title: card.querySelector('h4').textContent,
                    hours,
                    clientRate,
                    devRate,
                    isMyJob
                });
            }
        });

        // Recalculate totals
        let totalRevenue = 0;
        let totalTeamPayout = 0;
        
        updatedProject.roles.forEach(role => {
            const roleTotal = role.hours * role.clientRate;
            if (role.isMyJob) {
                totalRevenue += roleTotal;
            } else {
                totalTeamPayout += (role.hours * role.devRate);
            }
        });

        // Update financial calculations
        updatedProject.monthlyRevenue = totalRevenue / updatedProject.duration;
        updatedProject.monthlyTeamPayout = totalTeamPayout / updatedProject.duration;
        updatedProject.monthlyCustomerPayment = (totalRevenue + totalTeamPayout + updatedProject.profitAdjustment) / updatedProject.duration;
        updatedProject.monthlyProfit = (totalRevenue - totalTeamPayout + updatedProject.profitAdjustment) / updatedProject.duration;
        updatedProject.totalProjectCost = updatedProject.monthlyCustomerPayment * updatedProject.duration;

        // Get current repository file
        const files = await window.sharePointService.listFiles(window.currentSiteId, window.libraryName);
        const repositoryFile = files.value.find(f => f.name === 'project_repository.json');
        
        if (repositoryFile) {
            const response = await fetch(repositoryFile['@microsoft.graph.downloadUrl']);
            let existingProjects = await response.json();
            
            // Update the project
            const index = existingProjects.findIndex(p => p.id === project.id);
            if (index !== -1) {
                existingProjects[index] = updatedProject;
                
                // Save updated repository back to SharePoint
                const fileContent = JSON.stringify(existingProjects, null, 2);
                const file = new Blob([fileContent], { type: 'application/json' });
                
                await window.sharePointService.uploadFile(window.currentSiteId, window.libraryName, 'project_repository.json', file);
                
                // Update local array and re-render
                window.projects = existingProjects;
                renderProjects(window.projects);
                
                // Close the overlay
                document.getElementById('quoteDetailsOverlay').style.display = 'none';
                
                alert('Project updated successfully!');
            }
        }
    } catch (error) {
        console.error('Error saving changes:', error);
        alert('Error saving changes. Please try again.');
    }
}

// Update addProject function to include SharePoint integration
async function addProject(projectData) {
    try {
        const newProject = {
            id: `${Date.now()}`, // Use timestamp as ID
            ...projectData,
            source: projectData.type === 'project-price' ? 'Project Pricer' : 'Release Planner',
            status: 'draft',
            createdDate: new Date().toISOString().split('T')[0]
        };
        
        // Save to SharePoint
        await saveProjectToSharePoint(newProject);
        
        // Update local array
        window.projects.push(newProject);
    renderProjects(window.projects);
    } catch (error) {
        console.error('Error adding project:', error);
        throw error;
    }
}

// Customer management functions
window.showNewCustomerOverlay = function() {
    document.getElementById('new-customer-overlay').style.display = 'flex';
};

window.hideNewCustomerOverlay = function() {
    document.getElementById('new-customer-overlay').style.display = 'none';
    // Reset the customer filter to 'all'
    document.getElementById('customer-filter').value = 'all';
};

window.addNewCustomer = async function(event) {
    event.preventDefault();
    
    const customerName = document.getElementById('customerName').value.trim();
    const clientRate = parseFloat(document.getElementById('clientRate').value);
    const devRate = parseFloat(document.getElementById('devRate').value);
    
    if (!customerName || isNaN(clientRate) || isNaN(devRate)) {
        alert('Please fill in all fields with valid values.');
        return;
    }
    
    // Create customer ID from name (lowercase, replace spaces with hyphens)
    const customerId = customerName.toLowerCase().replace(/\s+/g, '-');
    
    // Check if customer already exists
    if (window.customers[customerId]) {
        alert('A customer with this name already exists.');
        return;
    }
    
    // Add new customer
    window.customers[customerId] = {
        clientRate: clientRate,
        devRate: devRate
    };
    
    // Add new option to customer filter
    const customerFilter = document.getElementById('customer-filter');
    const option = document.createElement('option');
    option.value = customerId;
    option.textContent = customerName;
    // Insert before the "Add New" option
    customerFilter.insertBefore(option, customerFilter.lastElementChild);
    
    // Hide overlay and reset form
    document.getElementById('new-customer-form').reset();
    hideNewCustomerOverlay();
    
    // Save customers to SharePoint
    try {
        await saveCustomersToSharePoint();
        alert('Customer added successfully!');
    } catch (error) {
        console.error('Error saving customers:', error);
        alert('Customer added but failed to save to SharePoint. Changes may be lost on refresh.');
    }
};

// Save customers to SharePoint
async function saveCustomersToSharePoint() {
    try {
        const customersFile = new Blob([JSON.stringify(window.customers, null, 2)], {
            type: 'application/json'
        });
        await window.sharePointService.uploadFile(
            window.currentSiteId,
            window.libraryName,
            'customers.json',
            customersFile
        );
    } catch (error) {
        console.error('Error saving customers to SharePoint:', error);
        throw error;
    }
}

// Load customers from SharePoint
async function loadCustomersFromSharePoint() {
    try {
        const files = await window.sharePointService.listFiles(window.currentSiteId, window.libraryName);
        const customersFile = files.value.find(f => f.name === 'customers.json');
        
        if (customersFile) {
            const response = await fetch(customersFile['@microsoft.graph.downloadUrl']);
            const customers = await response.json();
            window.customers = customers;
            
            // Update customer filter options
            const customerFilter = document.getElementById('customer-filter');
            const addNewOption = customerFilter.lastElementChild;
            
            // Clear existing options except "All" and "Add New"
            while (customerFilter.childNodes.length > 2) {
                customerFilter.removeChild(customerFilter.childNodes[1]);
            }
            
            // Add customer options
            Object.keys(customers).forEach(customerId => {
                const option = document.createElement('option');
                option.value = customerId;
                option.textContent = customerId.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ');
                customerFilter.insertBefore(option, addNewOption);
            });
        }
    } catch (error) {
        console.error('Error loading customers from SharePoint:', error);
        // Continue with default customers if loading fails
    }
} 