// Customer rates configuration
const customerRates = {
    'clinovators': {
        'backend': { clientRate: 60, devRate: 50 },
        'frontend': { clientRate: 60, devRate: 50 },
        'ui': { clientRate: 60, devRate: 50 },
        'pm': { rate: 60 },
        'devops': { rate: 60 },
        'qa': { clientRate: 60, devRate: 50 },
        'support': { rate: 60 }
    },
    'custom': {
        'backend': { clientRate: 150, devRate: 125 },
        'frontend': { clientRate: 150, devRate: 125 },
        'ui': { clientRate: 150, devRate: 125 },
        'pm': { rate: 150 },
        'devops': { rate: 150 },
        'qa': { clientRate: 150, devRate: 125 },
        'support': { rate: 150 }
    },
    'mlt': {
        'backend': { clientRate: 150, devRate: 125 },
        'frontend': { clientRate: 150, devRate: 125 },
        'ui': { clientRate: 150, devRate: 125 },
        'pm': { rate: 150 },
        'devops': { rate: 150 },
        'qa': { clientRate: 150, devRate: 125 },
        'support': { rate: 150 }
    },
    'points-of-light': {
        'backend': { clientRate: 150, devRate: 125 },
        'frontend': { clientRate: 150, devRate: 125 },
        'ui': { clientRate: 150, devRate: 125 },
        'pm': { rate: 150 },
        'devops': { rate: 150 },
        'qa': { clientRate: 150, devRate: 125 },
        'support': { rate: 150 }
    }
};

// Initialize state with default customer rates if not already initialized
window.state = window.state || {
    customer: {
        selected: 'clinovators',
        rates: customerRates.clinovators
    },
    release: {
        hourCap: 40,
        totalHours: 0,
        name: '',
        project: '',
        month: '',
        scope: '',
        startDate: '',
        endDate: ''
    }
};

// Format currency
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
};

// DOM Elements
let elements = {};

// Initialize SharePoint service
let sharePointService = null;

// Function to initialize SharePoint service
async function initializeSharePoint() {
    try {
        if (typeof SharePointService !== 'undefined') {
            sharePointService = await SharePointService.initialize();
            console.log('SharePoint service initialized successfully');
            return true;
        } else {
            console.error('SharePoint service not found');
            return false;
        }
    } catch (error) {
        console.error('Error initializing SharePoint service:', error);
        return false;
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM Content Loaded');
    
    try {
        // Initialize auth handler
        await window.AuthHandler.initialize();
        
        // Initialize SharePoint service
        sharePointService = await SharePointService.initialize();
        console.log('SharePoint service initialized');
    } catch (error) {
        console.error('Error initializing services:', error);
        showNotification('Error initializing services. Please refresh the page and try again.', 'error');
    }
    
    // Cache DOM elements
    elements = {
        // Enhancement elements
        enhancementOverlay: document.getElementById('new-enhancement-overlay'),
        addEnhancementBtn: document.getElementById('add-enhancement-btn'),
        closeEnhancementBtn: document.querySelector('#new-enhancement-overlay .close-button'),
        cancelEnhancementBtn: document.getElementById('cancel-enhancement'),
        enhancementForm: document.getElementById('new-enhancement-form'),
        taskList: document.getElementById('task-list'),
        
        // Form elements
        dueDate: document.getElementById('due-date'),
        priorityLevel: document.getElementById('priority-level'),
        enhancementStatus: document.getElementById('enhancement-status'),
        enhancementName: document.getElementById('enhancement-name'),
        enhancementDescription: document.getElementById('enhancement-description'),
        roleSelect: document.getElementById('role-select'),
        estimatedHours: document.getElementById('estimated-hours'),
        teamMemberSelect: document.getElementById('team-member-select'),
        isMyJobCheckbox: document.getElementById('is-my-job'),
        
        // Customer elements
        customerSelect: document.getElementById('customer-select'),
        customerOverlay: document.getElementById('new-customer-overlay'),
        customerForm: document.getElementById('new-customer-form'),
        closeCustomerBtn: document.querySelector('#new-customer-overlay .close-button'),
        cancelCustomerBtn: document.getElementById('cancelCustomer'),
        
        // Release setup elements
        hourCap: document.getElementById('hour-cap'),
        releaseMonth: document.getElementById('release-month'),
        releaseName: document.getElementById('release-name'),
        projectName: document.getElementById('project-name'),
        releaseScope: document.getElementById('release-scope'),
        startDate: document.getElementById('start-date'),
        endDate: document.getElementById('end-date'),
        
        // Summary elements
        totalEnhancements: document.getElementById('total-enhancements'),
        totalHours: document.getElementById('total-hours'),
        totalCost: document.getElementById('total-cost'),
        hoursAllocated: document.getElementById('hours-allocated'),
        availableHours: document.getElementById('available-hours'),
        totalClientCharge: document.getElementById('total-client-charge'),
        totalProfit: document.getElementById('total-profit'),
        monthlyCost: document.getElementById('monthly-cost'),
        myRevenue: document.getElementById('my-revenue')
    };

    // Debug log elements
    console.log('Elements found:', {
        enhancementOverlay: !!elements.enhancementOverlay,
        addEnhancementBtn: !!elements.addEnhancementBtn,
        closeEnhancementBtn: !!elements.closeEnhancementBtn,
        cancelEnhancementBtn: !!elements.cancelEnhancementBtn,
        enhancementForm: !!elements.enhancementForm,
        taskList: !!elements.taskList,
        customerSelect: !!elements.customerSelect,
        customerOverlay: !!elements.customerOverlay,
        customerForm: !!elements.customerForm,
        dueDate: !!elements.dueDate,
        priorityLevel: !!elements.priorityLevel,
        enhancementStatus: !!elements.enhancementStatus
    });

    // Initialize event listeners
    initializeEventListeners();
    
    // Initialize default values
    initializeDefaultValues();
});

function initializeDefaultValues() {
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    if (elements.dueDate) {
        elements.dueDate.value = today;
    }
    
    // Set default values for other fields
    if (elements.priorityLevel) {
        elements.priorityLevel.value = 'Medium';
    }
    
    if (elements.enhancementStatus) {
        elements.enhancementStatus.value = 'Not Started';
    }
    
    // Set default month to current month
    const currentDate = new Date();
    const currentMonth = currentDate.toISOString().slice(0, 7);
    if (elements.releaseMonth) {
        elements.releaseMonth.value = currentMonth;
    }
    
    // Initialize calculations
    updateCalculations();
}

// Event Listeners
function initializeEventListeners() {
    // Customer selection
    if (elements.customerSelect) {
        elements.customerSelect.addEventListener('change', handleCustomerChange);
    }

    // Customer overlay handlers
    if (elements.customerOverlay) {
        if (elements.closeCustomerBtn) {
            elements.closeCustomerBtn.addEventListener('click', hideNewCustomerOverlay);
        }
        if (elements.cancelCustomerBtn) {
            elements.cancelCustomerBtn.addEventListener('click', hideNewCustomerOverlay);
        }
        elements.customerOverlay.addEventListener('click', (e) => {
            if (e.target === elements.customerOverlay) {
                hideNewCustomerOverlay();
            }
        });
    }

    // Customer form submission
    if (elements.customerForm) {
        elements.customerForm.addEventListener('submit', handleNewCustomer);
    }

    // Enhancement handlers
    if (elements.addEnhancementBtn) {
        elements.addEnhancementBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showEnhancementOverlay();
        });
    }

    if (elements.closeEnhancementBtn) {
        elements.closeEnhancementBtn.addEventListener('click', (e) => {
            e.preventDefault();
            hideEnhancementOverlay();
        });
    }

    if (elements.cancelEnhancementBtn) {
        elements.cancelEnhancementBtn.addEventListener('click', (e) => {
            e.preventDefault();
            hideEnhancementOverlay();
        });
    }

    if (elements.enhancementOverlay) {
        elements.enhancementOverlay.addEventListener('click', (e) => {
            if (e.target === elements.enhancementOverlay) {
                hideEnhancementOverlay();
            }
        });
    }

    // Team member selection
    if (elements.teamMemberSelect && elements.isMyJobCheckbox) {
        elements.teamMemberSelect.addEventListener('change', (e) => {
            elements.isMyJobCheckbox.checked = e.target.value === 'Marcus';
        });
    }

    // Enhancement form submission
    if (elements.enhancementForm) {
        elements.enhancementForm.addEventListener('submit', (e) => {
            e.preventDefault();
            createEnhancementItem();
            hideEnhancementOverlay();
        });
    }

    // Hour cap change
    if (elements.hourCap) {
        elements.hourCap.addEventListener('change', (e) => {
            state.release.hourCap = parseInt(e.target.value) || 40;
            updateCalculations();
        });
    }

    // Release setup listeners
    if (elements.releaseName) {
        elements.releaseName.addEventListener('input', (e) => {
            state.release.name = e.target.value.trim();
        });
    }
    
    if (elements.projectName) {
        elements.projectName.addEventListener('input', (e) => {
            state.release.project = e.target.value.trim();
        });
    }
    
    if (elements.releaseMonth) {
        elements.releaseMonth.addEventListener('input', (e) => {
            state.release.month = e.target.value.trim();
        });
    }
    
    if (elements.releaseScope) {
        elements.releaseScope?.addEventListener('input', (e) => {
            state.release.scope = e.target.value.trim();
        });
    }
    
    if (elements.startDate) {
        elements.startDate.addEventListener('input', (e) => {
            state.release.startDate = e.target.value.trim();
        });
    }
    
    if (elements.endDate) {
        elements.endDate.addEventListener('input', (e) => {
            state.release.endDate = e.target.value.trim();
        });
    }

    // Save button handler
    const saveButton = document.getElementById('save-release');
    if (saveButton) {
        saveButton.addEventListener('click', saveReleasePlan);
    }

    // Export PDF button
    const exportButton = document.getElementById('export-pdf');
    if (exportButton) {
        exportButton.addEventListener('click', generateReleasePlan);
    }
}

function handleCustomerChange(e) {
    if (e.target.value === 'add-new') {
        showNewCustomerOverlay();
    } else {
        state.customer.selected = e.target.value;
        state.customer.rates = customerRates[e.target.value];
        updateCalculations();
    }
}

// Show overlay
function showEnhancementOverlay() {
    console.log('Showing overlay');
    elements.enhancementOverlay.style.display = 'flex';
    requestAnimationFrame(() => {
        elements.enhancementOverlay.classList.add('show');
    });
    elements.enhancementForm.reset();
    initializeDefaultValues();
}

// Hide overlay
function hideEnhancementOverlay() {
    console.log('Hiding overlay');
    elements.enhancementOverlay.classList.remove('show');
    setTimeout(() => {
        elements.enhancementOverlay.style.display = 'none';
    }, 300); // Match the CSS transition duration
}

// Create enhancement item
function createEnhancementItem() {
    const formData = {
        name: document.getElementById('enhancement-name').value,
        description: document.getElementById('enhancement-description').value,
        role: document.getElementById('role-select').value,
        priorityLevel: document.getElementById('priority-level').value,
        hours: document.getElementById('estimated-hours').value,
        status: document.getElementById('enhancement-status').value,
        assignedTo: document.getElementById('team-member-select').value,
        dueDate: document.getElementById('due-date').value,
        isMyJob: document.getElementById('is-my-job').checked
    };

    // Calculate enhancement total cost
    const rates = state.customer.rates[formData.role] || state.customer.rates.backend;
    const rate = formData.isMyJob ? (rates.clientRate || rates.rate) : (rates.devRate || rates.rate);
    const totalCost = rate * formData.hours;

    const enhancementHtml = `
        <div class="enhancement-item" data-hours="${formData.hours}" data-role="${formData.role}" data-is-my-job="${formData.isMyJob}">
            <div class="enhancement-header">
                <div class="enhancement-title">
                    <h3>${formData.name}</h3>
                    <span class="priority-badge ${formData.priorityLevel.toLowerCase()}" role="status">${formData.priorityLevel}</span>
                </div>
                <div class="enhancement-actions">
                    <button class="icon-button remove-enhancement" title="Remove enhancement">
                        <i class="fas fa-trash" aria-hidden="true"></i>
                        <span class="sr-only">Remove enhancement</span>
                    </button>
                </div>
            </div>
            <div class="enhancement-content">
                <p class="enhancement-description">${formData.description}</p>
                <div class="enhancement-meta">
                    <span class="meta-item" role="status">
                        <i class="fas fa-briefcase" aria-hidden="true"></i>
                        ${formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
                    </span>
                    <span class="meta-item" role="status">
                        <i class="fas fa-clock" aria-hidden="true"></i>
                        ${formData.hours} hours
                    </span>
                    <span class="meta-item" role="status">
                        <i class="fas fa-user" aria-hidden="true"></i>
                        ${formData.assignedTo}
                    </span>
                    <span class="meta-item" role="status">
                        <i class="fas fa-calendar" aria-hidden="true"></i>
                        ${new Date(formData.dueDate).toLocaleDateString()}
                    </span>
                    <span class="meta-item status-badge ${formData.status.toLowerCase().replace(' ', '-')}" role="status">
                        ${formData.status}
                    </span>
                    <span class="meta-item cost-badge" role="status">
                        <i class="fas fa-dollar-sign" aria-hidden="true"></i>
                        ${formatCurrency(totalCost)}
                    </span>
                </div>
            </div>
        </div>
    `;

    elements.taskList.insertAdjacentHTML('beforeend', enhancementHtml);
    
    // Add event listener to the new remove button
    const newEnhancement = elements.taskList.lastElementChild;
    const removeButton = newEnhancement.querySelector('.remove-enhancement');
    removeButton.addEventListener('click', () => {
        newEnhancement.remove();
        updateCalculations();
    });

    updateCalculations();
}

// Create SVG icon using createElementNS
function createSVGIcon(iconName) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'icon');
    svg.setAttribute('aria-hidden', 'true');
    
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#icon-${iconName}`);
    svg.appendChild(use);
    
    return svg;
}

// Update calculations
function updateCalculations() {
    const enhancementItems = document.querySelectorAll('.enhancement-item');
    let totalHours = 0;
    let totalDevCost = 0;
    let totalClientCharge = 0;
    let myRevenue = 0;
    let myHours = 0;

    enhancementItems.forEach(item => {
        const hours = parseFloat(item.dataset.hours) || 0;
        const isMyJob = item.dataset.isMyJob === 'true';
        const role = item.dataset.role;
        const rates = state.customer.rates[role] || state.customer.rates.backend; // fallback to backend rates

        totalHours += hours;
        
        if (isMyJob) {
            // If it's my job, I get the client rate
            const clientRate = rates.clientRate || rates.rate;
            myRevenue += hours * clientRate;
            myHours += hours;
            totalClientCharge += hours * clientRate;
        } else {
            // If it's not my job, we pay developer rate and charge client rate
            const devRate = rates.devRate || rates.rate;
            const clientRate = rates.clientRate || rates.rate;
            totalDevCost += hours * devRate;
            totalClientCharge += hours * clientRate;
        }
    });

    // Calculate monthly team payout (sum of all developer costs)
    const monthlyTeamPayout = totalDevCost;

    // Calculate total project profit (client charges - developer costs)
    const totalProjectProfit = totalClientCharge - totalDevCost;

    // Calculate total project cost (monthly team payout + total project profit)
    const totalProjectCost = monthlyTeamPayout + totalProjectProfit;

    // Update summary values
    elements.totalEnhancements.textContent = enhancementItems.length;
    elements.totalHours.textContent = totalHours.toFixed(1);
    elements.totalCost.textContent = formatCurrency(totalProjectCost);
    elements.monthlyCost.textContent = formatCurrency(monthlyTeamPayout);
    elements.myRevenue.textContent = formatCurrency(myRevenue);
    elements.totalProfit.textContent = formatCurrency(totalProjectProfit);

    // Update state
    state.release.totalHours = totalHours;
}

// Generate Release Plan
async function generateReleasePlan() {
    const exportButton = document.getElementById('export-pdf');
    
    try {
        // Show loading state
        exportButton.innerHTML = '<span class="loading-spinner"></span>Generating PDF...';
        exportButton.disabled = true;

        // Create filename
        const safeCustomerName = state.customer.selected.replace(/[^a-zA-Z0-9]/g, '');
        const safeProjectName = state.release.project.replace(/[^a-zA-Z0-9]/g, '');
        const fileName = `${safeCustomerName}_${safeProjectName}_Release.pdf`;

        // Generate PDF content
        const pdfContent = generatePDFContent();
        
        // Create temporary container
        const element = document.createElement('div');
        element.innerHTML = pdfContent;
        document.body.appendChild(element);

        // Configure PDF options
        const opt = {
            margin: [0.5, 0.5],
            filename: fileName,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2,
                useCORS: true,
                logging: true
            },
            jsPDF: { 
                unit: 'in', 
                format: 'letter', 
                orientation: 'portrait'
            }
        };

        // Generate PDF
        try {
            await html2pdf().set(opt).from(element).save();
            showNotification('PDF generated successfully!', 'success');
        } catch (pdfError) {
            console.error('PDF Generation Error:', pdfError);
            showNotification('Error generating PDF. Please try again.', 'error');
        }

        // Cleanup
        document.body.removeChild(element);
        
    } catch (error) {
        console.error('Error in generateReleasePlan:', error);
        showNotification('Error generating PDF. Please try again.', 'error');
    } finally {
        // Reset button state
        exportButton.innerHTML = '<i class="fas fa-file-pdf"></i> Export as PDF';
        exportButton.disabled = false;
    }
}

// Helper function to format customer name
function formatCustomerName(customerName) {
    // Special case for acronyms
    if (customerName.toLowerCase() === 'mlt') {
        return 'MLT';
    }
    
    // Handle multi-word names (e.g., "points of light")
    return customerName.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
}

// Generate PDF Content
function generatePDFContent(data) {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px 0; border-bottom: 2px solid #0066cc;">
                <h1 style="color: #0066cc; margin: 0; font-size: 32px;">
                    Release Plan
                </h1>
                <img src="P5TS Logo.png" alt="P5TS Logo" style="height: 80px;">
            </div>
            
            <div style="margin-bottom: 20px; margin-top: 20px;">
                <h2 style="color: #1d1d1f; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">Project Details</h2>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 20px;">
                    <div>
                        <p><strong>Release Name:</strong> ${state.release.name}</p>
                        <p><strong>Project Name:</strong> ${state.release.project}</p>
                        <p><strong>Release Month:</strong> ${state.release.month}</p>
                    </div>
                    <div>
                        <p><strong>Customer:</strong> ${formatCustomerName(state.customer.selected)}</p>
                        <p><strong>Hour Cap:</strong> ${state.release.hourCap} hours</p>
                        <p><strong>Date Range:</strong> ${state.release.startDate} to ${state.release.endDate}</p>
                    </div>
                </div>
            </div>

            <div style="margin-bottom: 20px;">
                <h2 style="color: #1d1d1f; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">Summary</h2>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 20px;">
                    <div style="background: #f5f5f7; padding: 15px; border-radius: 8px; text-align: center;">
                        <p style="color: #6e6e73; font-size: 14px; margin-bottom: 5px;">Total Enhancements</p>
                        <p style="color: #1d1d1f; font-size: 24px; font-weight: 600; margin: 0;">${elements.totalEnhancements.textContent}</p>
                    </div>
                    <div style="background: #f5f5f7; padding: 15px; border-radius: 8px; text-align: center;">
                        <p style="color: #6e6e73; font-size: 14px; margin-bottom: 5px;">Total Hours</p>
                        <p style="color: #1d1d1f; font-size: 24px; font-weight: 600; margin: 0;">${elements.totalHours.textContent}</p>
                    </div>
                    <div style="background: #0066cc; padding: 15px; border-radius: 8px; text-align: center;">
                        <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin-bottom: 5px;">Total Project Cost</p>
                        <p style="color: white; font-size: 24px; font-weight: 600; margin: 0;">${elements.totalCost.textContent}</p>
                    </div>
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h2 style="color: #1d1d1f; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">Enhancements</h2>
                <div style="margin-top: 20px;">
                    ${Array.from(document.querySelectorAll('.enhancement-item')).map(item => `
                        <div style="background: white; border: 1px solid #e5e5e7; border-radius: 8px; padding: 20px; margin-bottom: 20px; page-break-inside: avoid;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                <h3 style="color: #1d1d1f; font-size: 18px; margin: 0;">${item.querySelector('h3').textContent}</h3>
                                <span style="background: ${getPriorityColor(item.querySelector('.priority-badge').textContent)}; 
                                       color: ${getPriorityTextColor(item.querySelector('.priority-badge').textContent)}; 
                                       padding: 4px 12px; 
                                       border-radius: 999px; 
                                       font-size: 14px;">
                                    ${item.querySelector('.priority-badge').textContent}
                                </span>
                            </div>
                            <p style="color: #6e6e73; margin: 10px 0;">${item.querySelector('.enhancement-description').textContent}</p>
                            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 15px;">
                                <div>
                                    <p style="color: #6e6e73; font-size: 12px; margin-bottom: 4px;">Role/Type</p>
                                    <p style="color: #1d1d1f; font-size: 14px; margin: 0;">${item.querySelector('.meta-item:nth-child(1)').textContent.trim()}</p>
                                </div>
                                <div>
                                    <p style="color: #6e6e73; font-size: 12px; margin-bottom: 4px;">Hours</p>
                                    <p style="color: #1d1d1f; font-size: 14px; margin: 0;">${item.querySelector('.meta-item:nth-child(2)').textContent.trim()}</p>
                                </div>
                                <div>
                                    <p style="color: #6e6e73; font-size: 12px; margin-bottom: 4px;">Due Date</p>
                                    <p style="color: #1d1d1f; font-size: 14px; margin: 0;">${item.querySelector('.meta-item:nth-child(4)').textContent.trim()}</p>
                                </div>
                                <div>
                                    <p style="color: #6e6e73; font-size: 12px; margin-bottom: 4px;">Status</p>
                                    <p style="color: #1d1d1f; font-size: 14px; margin: 0;">${item.querySelector('.status-badge').textContent.trim()}</p>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div style="margin-top: 30px; border-top: 2px solid #e5e5e7; padding-top: 20px; page-break-inside: avoid;">
                <div style="display: flex; justify-content: space-between;">
                    <div style="flex: 1;">
                        <p><strong>Client Approval:</strong> _____________________</p>
                        <p><strong>Date:</strong> _____________________</p>
                    </div>
                    <div style="flex: 1; text-align: right;">
                        <p><strong>Project Manager:</strong> _____________________</p>
                        <p><strong>Date:</strong> _____________________</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Helper function for priority colors
function getPriorityColor(priority) {
    switch (priority.toLowerCase()) {
        case 'high':
            return '#fee2e2';
        case 'medium':
            return '#fef3c7';
        case 'low':
            return '#dcfce7';
        default:
            return '#f1f5f9';
    }
}

// Helper function for priority text colors
function getPriorityTextColor(priority) {
    switch (priority.toLowerCase()) {
        case 'high':
            return '#dc2626';
        case 'medium':
            return '#d97706';
        case 'low':
            return '#16a34a';
        default:
            return '#64748b';
    }
}

// Show Notification
function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    requestAnimationFrame(() => {
        notification.classList.add('show');
    });
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Load Font Awesome
const fontAwesome = document.createElement('link');
fontAwesome.rel = 'stylesheet';
fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
document.head.appendChild(fontAwesome);

// Load html2pdf
const html2pdfScript = document.createElement('script');
html2pdfScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
document.body.appendChild(html2pdfScript);

// Save release plan
async function saveReleasePlan() {
    try {
        // Get values directly from form elements
        const releaseName = document.getElementById('release-name')?.value;
        const projectName = document.getElementById('project-name')?.value;
        const releaseMonth = document.getElementById('release-month')?.value;

        // Validate required fields using form values
        if (!releaseName || !projectName || !releaseMonth) {
            showNotification('Please fill in all required fields: Release Name, Project Name, and Release Month', 'error');
            return;
        }

        // Show loading state
        const saveButton = document.getElementById('save-release');
        saveButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        saveButton.disabled = true;

        // Create release plan data
        const releasePlan = {
            type: 'monthly-release',
            metadata: {
                createdDate: new Date().toISOString(),
                lastModified: new Date().toISOString(),
                version: '1.0'
            },
            customer: {
                name: formatCustomerName(state.customer.selected),
                rates: state.customer.rates
            },
            release: {
                name: releaseName,
                project: projectName,
                month: releaseMonth,
                scope: state.release.scope || '',
                startDate: state.release.startDate || '',
                endDate: state.release.endDate || '',
                hourCap: state.release.hourCap || 40,
                totalHours: state.release.totalHours || 0
            },
            enhancements: Array.from(document.querySelectorAll('.enhancement-item')).map(item => ({
                name: item.querySelector('h3').textContent,
                description: item.querySelector('.enhancement-description').textContent,
                role: item.dataset.role,
                hours: parseFloat(item.dataset.hours),
                isMyJob: item.dataset.isMyJob === 'true',
                status: item.querySelector('.status-badge').textContent,
                priorityLevel: item.querySelector('.priority-badge').textContent,
                assignedTo: item.querySelector('.meta-item:nth-child(3)').textContent.trim(),
                dueDate: item.querySelector('.meta-item:nth-child(4)').textContent.trim()
            })),
            summary: {
                totalEnhancements: elements.totalEnhancements?.textContent ? parseInt(elements.totalEnhancements.textContent) : 0,
                totalHours: elements.totalHours?.textContent ? parseFloat(elements.totalHours.textContent) : 0,
                totalCost: elements.totalCost?.textContent || '$0.00',
                totalProfit: elements.totalProfit?.textContent || '$0.00',
                monthlyCost: elements.monthlyCost?.textContent || '$0.00',
                myRevenue: elements.myRevenue?.textContent || '$0.00'
            }
        };

        // Create filename
        const safeCustomerName = (state.customer.selected || 'unknown').replace(/[^a-zA-Z0-9]/g, '');
        const safeProjectName = (projectName || 'project').replace(/[^a-zA-Z0-9]/g, '');
        const fileName = `${safeCustomerName}_${safeProjectName}_Release.json`;

        try {
            // Initialize SharePoint if not already initialized
            if (!sharePointService) {
                const initialized = await initializeSharePoint();
                if (!initialized) {
                    throw new Error('SharePoint service could not be initialized');
                }
            }

            // Convert to JSON and create blob
            const fileContent = JSON.stringify(releasePlan, null, 2);
            const file = new Blob([fileContent], { type: 'application/json' });

            // Upload to SharePoint
            await sharePointService.uploadFile(null, fileName, file);

            // Show success and redirect
            showNotification('Release plan saved successfully to SharePoint!', 'success');
            setTimeout(() => {
                window.location.href = 'repository.html';
            }, 1000);

        } catch (error) {
            console.error('Error saving to SharePoint:', error);
            showNotification('Could not save to SharePoint. Would you like to download locally?', 'error');

            // Create download button
            const downloadButton = document.createElement('button');
            downloadButton.className = 'action-button primary';
            downloadButton.innerHTML = '<i class="fas fa-download"></i> Download JSON';
            downloadButton.onclick = () => {
                const downloadLink = document.createElement('a');
                downloadLink.href = URL.createObjectURL(new Blob([JSON.stringify(releasePlan, null, 2)]));
                downloadLink.download = fileName;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
                showNotification('File downloaded successfully', 'success');
            };

            // Add download button to notification
            const notification = document.querySelector('.notification');
            if (notification) {
                notification.appendChild(document.createElement('br'));
                notification.appendChild(downloadButton);
            }
        }

    } catch (error) {
        console.error('Error preparing release plan:', error);
        showNotification('Error preparing release plan: ' + error.message, 'error');
    } finally {
        // Reset button state
        const saveButton = document.getElementById('save-release');
        saveButton.innerHTML = '<i class="fas fa-save"></i> Save Release';
        saveButton.disabled = false;
    }
}

function showNewCustomerOverlay() {
    if (elements.customerOverlay && elements.customerForm) {
        elements.customerForm.reset();
        elements.customerOverlay.style.display = 'flex';
        requestAnimationFrame(() => {
            elements.customerOverlay.classList.add('show');
        });
    }
}

function hideNewCustomerOverlay() {
    if (elements.customerOverlay && elements.customerSelect) {
        elements.customerOverlay.classList.remove('show');
        setTimeout(() => {
            elements.customerOverlay.style.display = 'none';
            elements.customerSelect.value = state.customer.selected || 'clinovators';
        }, 300);
    }
}

function handleNewCustomer(event) {
    event.preventDefault();
    
    const customerName = document.getElementById('customerName')?.value.trim();
    const clientRate = parseFloat(document.getElementById('clientRate')?.value);
    const devRate = parseFloat(document.getElementById('devRate')?.value);
    
    if (!customerName || isNaN(clientRate) || isNaN(devRate)) {
        alert('Please fill in all fields with valid values.');
        return;
    }
    
    const customerId = customerName.toLowerCase().replace(/\s+/g, '-');
    
    if (customerRates[customerId]) {
        alert('A customer with this name already exists.');
        return;
    }
    
    // Create new customer rates
    customerRates[customerId] = {
        'backend': { clientRate, devRate },
        'frontend': { clientRate, devRate },
        'ui': { clientRate, devRate },
        'pm': { rate: clientRate },
        'devops': { rate: clientRate },
        'qa': { clientRate, devRate },
        'support': { rate: clientRate }
    };
    
    // Add new option to select
    if (elements.customerSelect) {
        const option = document.createElement('option');
        option.value = customerId;
        option.textContent = customerName;
        
        const addNewOption = Array.from(elements.customerSelect.options)
            .find(opt => opt.value === 'add-new');
            
        if (addNewOption) {
            elements.customerSelect.insertBefore(option, addNewOption);
        } else {
            elements.customerSelect.add(option);
        }
        
        // Select the new customer
        elements.customerSelect.value = customerId;
        state.customer.selected = customerId;
        state.customer.rates = customerRates[customerId];
    }
    
    // Reset and hide form
    elements.customerForm?.reset();
    hideNewCustomerOverlay();
    
    // Update calculations
    updateCalculations();
    
    // Show success message
    showNotification('Customer added successfully!', 'success');
} 