// Initialize projects from localStorage
let projects = JSON.parse(localStorage.getItem('projects')) || [];

// Initialize the repository page
document.addEventListener('DOMContentLoaded', () => {
    // Load projects from localStorage
    projects = JSON.parse(localStorage.getItem('projects') || '[]');
    
    const customerFilter = document.getElementById('customerFilter');
    const typeFilter = document.getElementById('typeFilter');
    const statusFilter = document.getElementById('statusFilter');
    const searchInput = document.getElementById('searchInput');
    
    // Add event listeners for filters
    customerFilter.addEventListener('change', filterProjects);
    typeFilter.addEventListener('change', filterProjects);
    statusFilter.addEventListener('change', filterProjects);
    searchInput.addEventListener('input', filterProjects);
    
    // Initial render
    renderProjects(projects);

    // Add event listeners for quote details overlay
    document.getElementById('closeOverlayBtn')?.addEventListener('click', closeQuoteDetails);
    
    document.getElementById('deleteQuoteBtn')?.addEventListener('click', () => {
        const quoteId = document.getElementById('quoteDetailsContent').dataset.quoteId;
        deleteQuote(quoteId);
    });

    // Add event listener for project actions using event delegation
    document.getElementById('projectsGrid').addEventListener('click', (e) => {
        const actionButton = e.target.closest('.action-button');
        if (!actionButton) return;

        const projectCard = actionButton.closest('.project-card');
        if (!projectCard) return;

        const projectId = parseInt(projectCard.dataset.id);
        
        if (actionButton.textContent.trim() === 'View Details') {
            viewProject(projectId);
        } else if (actionButton.textContent.trim() === 'Edit') {
            editProject(projectId);
        } else if (actionButton.textContent.trim() === 'Delete') {
            deleteProject(projectId);
        }
    });

    // Add event listener for save changes
    document.getElementById('saveQuoteChanges')?.addEventListener('click', () => {
        const quoteId = parseInt(document.getElementById('quoteDetailsContent').dataset.quoteId);
        saveQuoteChanges(quoteId);
    });
});

// Filter projects based on selected criteria
function filterProjects() {
    const customerValue = document.getElementById('customerFilter').value;
    const typeValue = document.getElementById('typeFilter').value;
    const statusValue = document.getElementById('statusFilter').value;
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    
    const filteredProjects = projects.filter(project => {
        const matchesCustomer = customerValue === 'all' || project.customer.toLowerCase() === customerValue;
        const matchesType = typeValue === 'all' || project.type === typeValue;
        const matchesStatus = statusValue === 'all' || project.status === statusValue;
        const matchesSearch = project.name.toLowerCase().includes(searchValue) ||
                            project.customer.toLowerCase().includes(searchValue);
        
        return matchesCustomer && matchesType && matchesStatus && matchesSearch;
    });
    
    renderProjects(filteredProjects);
}

// Render projects to the grid
function renderProjects(projectsToRender) {
    const projectsGrid = document.getElementById('projectsGrid');
    projectsGrid.innerHTML = '';
    
    projectsToRender.forEach(project => {
        const projectCard = createProjectCard(project);
        projectsGrid.appendChild(projectCard);
    });
}

// Create a project card element
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.dataset.id = project.id;
    card.dataset.type = project.type; // Add type to dataset for easy access
    
    // Set icon and source based on type
    const typeIcon = project.type === 'project-price' ? 
        '<i class="fas fa-calculator"></i>' : 
        '<i class="fas fa-calendar-alt"></i>';
    
    const sourceText = project.type === 'project-price' ? 'Project Pricer' : 'Release Planner';
    
    const details = project.type === 'project-price' ? 
        `<div class="cost-details">
            <span class="total-cost">Total: ${formatCurrency(project.totalCost)}</span>
            <span class="monthly">Monthly: ${formatCurrency(project.monthlyCost)}</span>
        </div>
        <div class="duration">Duration: ${project.duration} months</div>` :
        `<div class="release-details">
            <span class="total-hours">Total Hours: ${project.details?.totalHours || 0}</span>
            <span class="monthly-cost">Monthly Cost: ${formatCurrency(project.details?.monthlyCost || 0)}</span>
        </div>
        <div class="release-month">Release: ${formatDate(project.details?.releaseMonth || new Date())}</div>`;
    
    card.innerHTML = `
        <div class="project-header">
            <div class="header-content">
                <h3>${project.name}</h3>
                <div class="quote-metadata">
                    ${typeIcon}
                    <span class="quote-source ${project.type}">${sourceText}</span>
                </div>
            </div>
            <span class="status-badge ${project.status}">${project.status.charAt(0).toUpperCase() + project.status.slice(1)}</span>
        </div>
        <div class="project-details">
            <p class="customer-name">${project.customer}</p>
            <p class="date">Created: ${formatDate(project.createdDate)}</p>
            ${details}
        </div>
        <div class="project-actions">
            <button class="action-button primary" title="View quote details">View Details</button>
            <button class="action-button secondary" title="Edit quote">Edit</button>
            <button class="action-button danger" title="Delete quote">Delete</button>
        </div>
    `;
    return card;
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Project actions
function viewProject(id) {
    console.log('Viewing project:', id);
    showQuoteDetails(id, false);
}

function editProject(id) {
    console.log('Editing project:', id);
    showQuoteDetails(id, true);
}

function deleteProject(id) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    projects = projects.filter(p => p.id !== id);
    localStorage.setItem('projects', JSON.stringify(projects));
    renderProjects(projects);
}

// Function to add a new project (will be called from the project pricer page)
function addProject(projectData) {
    // This will be replaced with an API call when the backend is ready
    const newProject = {
        id: projects.length + 1,
        ...projectData,
        source: projectData.type === 'project-price' ? 'Project Pricer' : 'Release Planner',
        status: 'draft',
        createdDate: new Date().toISOString().split('T')[0]
    };
    
    projects.push(newProject);
    localStorage.setItem('projects', JSON.stringify(projects));
    renderProjects(projects);
}

function showQuoteDetails(quoteId, isEditMode = false) {
    const quote = projects.find(p => p.id === quoteId);
    if (!quote) {
        console.error('Quote not found:', quoteId);
        return;
    }

    const overlay = document.getElementById('quoteDetailsOverlay');
    const content = document.getElementById('quoteDetailsContent');
    content.dataset.quoteId = quoteId;
    content.dataset.quoteType = quote.type; // Add type to dataset

    // Update overlay title with icon and source
    const overlayTitle = document.querySelector('.overlay-header h2');
    const typeIcon = quote.type === 'project-price' ? 
        '<i class="fas fa-calculator"></i>' : 
        '<i class="fas fa-calendar-alt"></i>';
    const sourceText = quote.type === 'project-price' ? 'Project Pricer' : 'Release Planner';
    overlayTitle.innerHTML = `${typeIcon} Quote Details - ${sourceText}`;

    // Populate header inputs
    const projectNameInput = document.getElementById('editProjectName');
    const customerInput = document.getElementById('editCustomer');
    const statusInput = document.getElementById('editStatus');
    
    projectNameInput.value = quote.name;
    customerInput.value = quote.customer;
    statusInput.value = quote.status;

    // Set input fields to disabled/enabled based on mode
    [projectNameInput, customerInput, statusInput].forEach(input => {
        input.disabled = !isEditMode;
    });

    // Show/hide appropriate details section based on quote type
    const projectPriceDetails = document.getElementById('projectPriceDetails');
    const releasePlannerDetails = document.getElementById('releasePlannerDetails');
    
    if (quote.type === 'project-price') {
        projectPriceDetails.style.display = 'block';
        releasePlannerDetails.style.display = 'none';
        
        // Populate Project Price specific fields
        const durationInput = document.getElementById('editDuration');
        const profitAdjustmentInput = document.getElementById('editProfitAdjustment');
        
        durationInput.value = quote.duration || 0;
        profitAdjustmentInput.value = quote.profitAdjustment || 0;
        
        durationInput.disabled = !isEditMode;
        profitAdjustmentInput.disabled = !isEditMode;
        
        // Populate roles
        const rolesGrid = document.getElementById('editRolesGrid');
        rolesGrid.innerHTML = '';
        
        if (quote.roles && quote.roles.length > 0) {
            quote.roles.forEach(role => {
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
                            <input type="number" class="edit-input" value="${role.hours}" ${!isEditMode ? 'disabled' : ''}>
                        </div>
                        <div>
                            <label>Rate</label>
                            <input type="number" class="edit-input" value="${role.rate}" ${!isEditMode ? 'disabled' : ''}>
                        </div>
                    </div>
                `;
                rolesGrid.appendChild(roleCard);
            });
        }

        // Populate financial summary
        document.getElementById('monthlyRevenue').textContent = formatCurrency(quote.monthlyRevenue || 0);
        document.getElementById('monthlyTeamPayout').textContent = formatCurrency(quote.monthlyTeamPayout || 0);
        document.getElementById('monthlyCustomerPayment').textContent = formatCurrency(quote.monthlyCustomerPayment || 0);
        document.getElementById('monthlyProfit').textContent = formatCurrency(quote.monthlyProfit || 0);
        document.getElementById('totalProjectCost').textContent = formatCurrency(quote.totalCost || 0);
    } else {
        projectPriceDetails.style.display = 'none';
        releasePlannerDetails.style.display = 'block';
        
        // Populate Release Planner specific fields
        const releaseMonthInput = document.getElementById('editReleaseMonth');
        const hourCapInput = document.getElementById('editHourCap');
        
        releaseMonthInput.value = quote.releaseMonth || '';
        hourCapInput.value = quote.hourCap || 0;
        
        releaseMonthInput.disabled = !isEditMode;
        hourCapInput.disabled = !isEditMode;
        
        // Populate enhancements
        const enhancementsGrid = document.getElementById('editEnhancementsGrid');
        enhancementsGrid.innerHTML = '';
        
        if (quote.enhancements && quote.enhancements.length > 0) {
            quote.enhancements.forEach(enhancement => {
                const enhancementCard = document.createElement('div');
                enhancementCard.className = 'edit-enhancement-card';
                enhancementCard.innerHTML = `
                    <div class="edit-role-header">
                        <h4>${enhancement.title}</h4>
                    </div>
                    <div class="edit-role-inputs">
                        <div>
                            <label>Description</label>
                            <input type="text" class="edit-input" value="${enhancement.description || ''}" ${!isEditMode ? 'disabled' : ''}>
                        </div>
                        <div>
                            <label>Priority</label>
                            <select class="edit-input" ${!isEditMode ? 'disabled' : ''}>
                                <option value="high" ${enhancement.priority === 'high' ? 'selected' : ''}>High</option>
                                <option value="medium" ${enhancement.priority === 'medium' ? 'selected' : ''}>Medium</option>
                                <option value="low" ${enhancement.priority === 'low' ? 'selected' : ''}>Low</option>
                            </select>
                        </div>
                        <div>
                            <label>Hours</label>
                            <input type="number" class="edit-input" value="${enhancement.hours || 0}" ${!isEditMode ? 'disabled' : ''}>
                        </div>
                        <div>
                            <label>Cost</label>
                            <input type="number" class="edit-input" value="${enhancement.cost || 0}" ${!isEditMode ? 'disabled' : ''}>
                        </div>
                    </div>
                `;
                enhancementsGrid.appendChild(enhancementCard);
            });
        }

        // Populate release summary
        const totalHours = quote.enhancements?.reduce((sum, e) => sum + (e.hours || 0), 0) || 0;
        const totalCost = quote.enhancements?.reduce((sum, e) => sum + (e.cost || 0), 0) || 0;
        const monthlyCost = quote.hourCap ? (totalCost / Math.ceil(totalHours / quote.hourCap)) : 0;
        const estimatedMonths = quote.hourCap ? Math.ceil(totalHours / quote.hourCap) : 0;

        document.getElementById('totalHours').textContent = `${totalHours} hours`;
        document.getElementById('totalCost').textContent = formatCurrency(totalCost);
        document.getElementById('monthlyCost').textContent = formatCurrency(monthlyCost);
        document.getElementById('estimatedCompletion').textContent = `${estimatedMonths} months`;
    }

    // Update action buttons based on mode
    const saveButton = document.getElementById('saveQuoteChanges');
    const deleteButton = document.getElementById('deleteQuote');
    const cancelButton = document.getElementById('cancelEdit');

    saveButton.style.display = isEditMode ? 'block' : 'none';
    deleteButton.style.display = isEditMode ? 'block' : 'none';
    cancelButton.textContent = isEditMode ? 'Cancel' : 'Close';

    // Show the overlay
    overlay.classList.add('active');
    overlay.style.display = 'flex';
}

function closeQuoteDetails() {
    const overlay = document.getElementById('quoteDetailsOverlay');
    overlay.classList.remove('active');
    overlay.style.display = 'none';
}

function deleteQuote(quoteId) {
    if (!confirm('Are you sure you want to delete this quote?')) return;
    
    const storedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
    const updatedProjects = storedProjects.filter(p => p.id !== quoteId);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    
    projects = updatedProjects;
    renderProjects(projects);
    closeQuoteDetails();
}

function saveQuoteChanges(quoteId) {
    const quote = projects.find(p => p.id === quoteId);
    if (!quote) return;

    // Update common fields
    quote.name = document.getElementById('editProjectName').value;
    quote.customer = document.getElementById('editCustomer').value;
    quote.status = document.getElementById('editStatus').value;

    if (quote.type === 'project-price') {
        // Update Project Price specific fields
        quote.duration = parseInt(document.getElementById('editDuration').value) || 0;
        quote.profitAdjustment = parseFloat(document.getElementById('editProfitAdjustment').value) || 0;
        
        // Update roles
        const roleCards = document.querySelectorAll('.edit-role-card');
        quote.roles = Array.from(roleCards).map(card => ({
            title: card.querySelector('h4').textContent,
            hours: parseInt(card.querySelector('input[type="number"]:first-of-type').value) || 0,
            rate: parseFloat(card.querySelector('input[type="number"]:last-of-type').value) || 0,
            isMyJob: card.querySelector('input[type="checkbox"]').checked
        }));

        // Recalculate totals
        let monthlyTeamPayout = 0;
        let monthlyRevenue = 0;
        
        quote.roles.forEach(role => {
            const roleTotal = role.hours * role.rate;
            if (role.isMyJob) {
                monthlyRevenue += roleTotal;
            } else {
                monthlyTeamPayout += roleTotal;
            }
        });

        quote.monthlyTeamPayout = monthlyTeamPayout;
        quote.monthlyRevenue = monthlyRevenue;
        quote.monthlyCustomerPayment = monthlyRevenue + monthlyTeamPayout + quote.profitAdjustment;
        quote.monthlyProfit = quote.monthlyCustomerPayment - monthlyTeamPayout;
        quote.totalCost = quote.monthlyCustomerPayment * quote.duration;
        quote.monthlyCost = quote.monthlyCustomerPayment;
    } else {
        // Update Release Planner specific fields
        quote.releaseMonth = document.getElementById('editReleaseMonth').value;
        quote.hourCap = parseInt(document.getElementById('editHourCap').value) || 0;
        
        // Update enhancements
        const enhancementCards = document.querySelectorAll('.edit-enhancement-card');
        quote.enhancements = Array.from(enhancementCards).map(card => ({
            title: card.querySelector('h4').textContent,
            description: card.querySelector('input[type="text"]').value,
            priority: card.querySelector('select').value,
            hours: parseInt(card.querySelector('input[type="number"]:first-of-type').value) || 0,
            cost: parseFloat(card.querySelector('input[type="number"]:last-of-type').value) || 0
        }));

        // Recalculate totals
        const totalHours = quote.enhancements.reduce((sum, e) => sum + e.hours, 0);
        const totalCost = quote.enhancements.reduce((sum, e) => sum + e.cost, 0);
        
        quote.details = {
            totalHours,
            totalCost,
            monthlyCost: quote.hourCap ? (totalCost / Math.ceil(totalHours / quote.hourCap)) : 0,
            estimatedMonths: quote.hourCap ? Math.ceil(totalHours / quote.hourCap) : 0
        };
    }

    // Save to localStorage
    localStorage.setItem('projects', JSON.stringify(projects));
    
    // Update display and close overlay
    renderProjects(projects);
    closeQuoteDetails();
} 