// Initialize MSAL and SharePoint service
async function initializeServices() {
    try {
        // Initialize MSAL
        if (!window.msalInstance) {
            throw new Error('MSAL instance not initialized');
        }

        // Handle the redirect promise
        await window.msalInstance.handleRedirectPromise();
        
        // Get active account
        const account = window.msalInstance.getActiveAccount();
        if (!account) {
            // No account found, redirect to login
            await window.msalInstance.loginRedirect({
                scopes: [
                    "https://graph.microsoft.com/Sites.Read.All",
                    "https://graph.microsoft.com/Sites.ReadWrite.All",
                    "https://graph.microsoft.com/Files.Read.All",
                    "https://graph.microsoft.com/Files.ReadWrite.All"
                ]
            });
            return;
        }

        // Initialize SharePoint service
        try {
            if (!window.SharePointService) {
                console.warn('SharePoint service not available');
            } else {
                await window.SharePointService.initialize();
                console.log('SharePoint service initialized successfully');
            }
        } catch (error) {
            console.error('SharePoint initialization error:', error);
            showBanner('SharePoint service is not available. Files will be saved locally.', 'warning');
        }

        // Setup event listeners after services are initialized
        setupEventListeners();
        
        // Load initial data
        loadCustomerData();
        
        console.log('All services initialized successfully');
    } catch (error) {
        console.error('Failed to initialize services:', error);
        showBanner('Failed to initialize services. Some features may be limited.', 'error');
    }
}

// Show banner notification
function showBanner(message, type = 'info') {
    // Remove any existing banner
    const existingBanner = document.querySelector('.notification-banner');
    if (existingBanner) {
        existingBanner.remove();
    }

    // Create banner
    const banner = document.createElement('div');
    banner.className = `notification-banner ${type}`;
    banner.innerHTML = `
        <div class="banner-content">
            <span class="banner-message">${message}</span>
            <button class="banner-close">×</button>
        </div>
    `;

    // Add to page
    document.body.insertBefore(banner, document.body.firstChild);

    // Setup close button
    const closeButton = banner.querySelector('.banner-close');
    closeButton.onclick = () => banner.remove();

    // Auto-hide after 5 seconds for non-error messages
    if (type !== 'error') {
        setTimeout(() => {
            if (banner.parentElement) {
                banner.remove();
            }
        }, 5000);
    }
}

// Load customer data
async function loadCustomerData() {
    try {
        // Set initial customer rates
        const customerSelect = document.getElementById('customer');
        if (customerSelect) {
            updateRatesForCustomer(customerSelect.value);
        }

        // Initialize calculations
        calculateProjectSummary();
        updateProfitPercentage();
    } catch (error) {
        console.error('Error loading customer data:', error);
    }
}

// Update profit percentage
function updateProfitPercentage() {
    const profitAdjustment = parseFloat(document.getElementById('profitAdjustment').value) || 0;
    const totalBeforeAdjustment = totalRevenue + totalTeamClientBillable;
    
    if (totalBeforeAdjustment > 0) {
        const percentage = (profitAdjustment / totalBeforeAdjustment) * 100;
        document.getElementById('profitPercentage').textContent = `${percentage.toFixed(1)}%`;
    } else {
        document.getElementById('profitPercentage').textContent = '0%';
    }
}

// Setup all event listeners
function setupEventListeners() {
    // Customer dropdown change handler
    const customerSelect = document.getElementById('customer');
    if (customerSelect) {
        customerSelect.addEventListener('change', (e) => {
            if (e.target.value === 'add-new') {
                showNewCustomerOverlay();
            } else {
                updateRatesForCustomer(e.target.value);
            }
        });
    }

    // New customer form handlers
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

    // Duration and profit adjustment handlers
    const durationInput = document.getElementById('duration');
    if (durationInput) {
        durationInput.addEventListener('input', calculateProjectSummary);
    }

    const profitInput = document.getElementById('profitAdjustment');
    if (profitInput) {
        profitInput.addEventListener('input', () => {
            calculateProjectSummary();
            updateProfitPercentage();
        });
    }

    // Save estimate button handler
    const saveButton = document.querySelector('.save-estimate-button');
    if (saveButton) {
        saveButton.addEventListener('click', saveEstimate);
    }

    // Setup role card listeners
    document.querySelectorAll('.role-card').forEach(setupRoleCardListeners);
}

// Role configuration with default rates
const defaultRoles = {
    backend: { clientRate: 100, devRate: 85 },
    frontend: { clientRate: 90, devRate: 75 },
    ui: { clientRate: 85, devRate: 70 },
    pm: { clientRate: 80, devRate: 80 },
    devops: { clientRate: 110, devRate: 110 },
    qa: { clientRate: 75, devRate: 60 },
    support: { clientRate: 70, devRate: 70 }
};

// Initialize all calculation variables
const selectedRoles = new Set();
let totalRevenue = 0;
let totalTeamPayout = 0;
let totalClientBillable = 0;
let totalTeamClientBillable = 0;
let totalProjectCost = 0;
let profitAdjustment = 0;
let monthlyRevenue = 0;
let monthlyTeamPayout = 0;
let monthlyCustomerPayment = 0;
let monthlyProfit = 0;

// Customer rates configuration
const defaultCustomerRates = {
    'clinovators': {
        'backend': { clientRate: 60, devRate: 50 },
        'frontend': { clientRate: 60, devRate: 50 },
        'ui': { clientRate: 60, devRate: 50 },
        'pm': { clientRate: 60, devRate: 50 },
        'devops': { clientRate: 60, devRate: 50 },
        'qa': { clientRate: 60, devRate: 50 },
        'support': { clientRate: 60, devRate: 50 }
    },
    'custom': { ...defaultRoles }
};

// Customer management
const customers = {
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

// Format currency
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
};

// Show new customer overlay
function showNewCustomerOverlay() {
    document.getElementById('new-customer-overlay').style.display = 'flex';
}

// Hide new customer overlay
function hideNewCustomerOverlay() {
    document.getElementById('new-customer-overlay').style.display = 'none';
}

// Add new customer
function addNewCustomer(event) {
    event.preventDefault();
    
    const customerName = document.getElementById('customerName').value;
    const clientRate = parseFloat(document.getElementById('defaultClientRate').value);
    const devRate = parseFloat(document.getElementById('defaultDevRate').value);
    
    // Create customer ID (lowercase, hyphenated version of name)
    const customerId = customerName.toLowerCase().replace(/\s+/g, '-');
    
    // Add to customers object
    customers[customerId] = {
        clientRate: clientRate,
        devRate: devRate
    };
    
    // Add to customer dropdown
    const customerSelect = document.getElementById('customer');
    const option = document.createElement('option');
    option.value = customerId;
    option.textContent = customerName;
    
    // Insert before the "Add New Customer" option
    const addNewOption = customerSelect.querySelector('option[value="add-new"]');
    customerSelect.insertBefore(option, addNewOption);
    
    // Select the new customer
    customerSelect.value = customerId;
    
    // Update rates for all roles
    updateRatesForCustomer(customerId);
    
    // Hide overlay and reset form
    hideNewCustomerOverlay();
    document.getElementById('new-customer-form').reset();
}

// Update rates when customer changes
function updateRatesForCustomer(customerId) {
    const customer = customers[customerId];
    if (!customer) return;
    
    document.querySelectorAll('.role-card').forEach(card => {
        const clientRateInput = card.querySelector('.client-rate');
        const devRateInput = card.querySelector('.dev-rate');
        
        clientRateInput.value = customer.clientRate;
        devRateInput.value = customer.devRate;
    });
    
    calculateProjectSummary();
}

// Calculate project summary
function calculateProjectSummary() {
    const duration = parseInt(document.getElementById('duration').value) || 1;
    profitAdjustment = parseFloat(document.getElementById('profitAdjustment').value) || 0;
    
    // Reset calculations
    totalRevenue = 0;
    totalTeamPayout = 0;
    totalTeamClientBillable = 0;

    // Calculate costs for each role
    document.querySelectorAll('.role-card').forEach(card => {
        const hoursInput = card.querySelector('.role-hours input');
        const hours = parseInt(hoursInput.value) || 0;
        const isMyRole = card.querySelector('.my-job-button').classList.contains('active');
        const clientRate = parseFloat(card.querySelector('.client-rate').value) || 0;
        const devRate = parseFloat(card.querySelector('.dev-rate').value) || 0;

        if (hours > 0) {
            // Calculate role total (not affected by duration)
            const roleTotal = hours * clientRate;
            
            if (isMyRole) {
                totalRevenue += roleTotal;
            } else {
                totalTeamClientBillable += roleTotal;
                totalTeamPayout += (hours * devRate);
            }

            // Update role card total
            card.querySelector('.total-amount').textContent = formatCurrency(roleTotal);
        }
    });

    // Calculate total project cost (not affected by duration)
    const totalBeforeAdjustment = totalRevenue + totalTeamClientBillable;
    totalProjectCost = totalBeforeAdjustment + profitAdjustment;

    // Calculate monthly values by dividing the totals by duration
    monthlyRevenue = totalRevenue / duration;
    monthlyTeamPayout = totalTeamPayout / duration;
    monthlyCustomerPayment = totalProjectCost / duration;
    monthlyProfit = (totalRevenue + (totalTeamClientBillable - totalTeamPayout) + profitAdjustment) / duration;

    // Update displays
    document.getElementById('monthlyRevenue').textContent = formatCurrency(monthlyRevenue);
    document.getElementById('monthlyTeamPayout').textContent = formatCurrency(monthlyTeamPayout);
    document.getElementById('monthlyCustomerPayment').textContent = formatCurrency(monthlyCustomerPayment);
    document.getElementById('monthlyProfit').textContent = formatCurrency(monthlyProfit);
    document.getElementById('totalProjectCost').textContent = formatCurrency(totalProjectCost);

    // Update profit percentage
    updateProfitPercentage();
}

// Event listeners for role cards
function setupRoleCardListeners(card) {
    const hoursInput = card.querySelector('.role-hours input');
    const myJobButton = card.querySelector('.my-job-button');
    const clientRateInput = card.querySelector('.client-rate');
    const devRateInput = card.querySelector('.dev-rate');

    if (hoursInput) {
        hoursInput.addEventListener('input', calculateProjectSummary);
    }
    
    if (myJobButton) {
        myJobButton.addEventListener('click', () => {
            console.log('My Job button clicked');
            myJobButton.classList.toggle('active');
            calculateProjectSummary();
        });
    }

    if (clientRateInput) {
        clientRateInput.addEventListener('input', calculateProjectSummary);
    }

    if (devRateInput) {
        devRateInput.addEventListener('input', calculateProjectSummary);
    }
}

// Initialize SharePoint variables at the top of the file
const siteName = 'P5TS Quote Repository';
const libraryName = 'Project Price Calculator';
let currentSiteId = null;

// Update the saveEstimate function
async function saveEstimate() {
    try {
        console.log('Starting save estimate process...');
        
        // Validate required fields
        const projectName = document.getElementById('projectName').value.trim();
        const customerSelect = document.getElementById('customer');
        
        if (!projectName) {
            showBanner('Please enter a project name', 'error');
            return;
        }

        // Check if customer select exists and has a valid selection
        if (!customerSelect) {
            console.error('Customer select element not found');
            showBanner('Error: Could not find customer selection', 'error');
            return;
        }

        const selectedCustomer = customerSelect.value;
        console.log('Selected customer:', selectedCustomer);

        if (selectedCustomer === 'Select Customer' || selectedCustomer === 'add-new') {
            showBanner('Please select a customer', 'error');
            return;
        }

        // Get customer name from select element
        const customer = customerSelect.options[customerSelect.selectedIndex].text;
        console.log('Customer name:', customer);

        // Create project data object
        const projectData = {
            customer: customer,
            projectName: projectName,
            type: 'project-price',
            status: 'draft',
            duration: parseInt(document.getElementById('duration')?.value) || 1,
            profitAdjustment: parseFloat(document.getElementById('profitAdjustment')?.value) || 0,
            totalProjectCost: parseCurrencyValue(document.getElementById('totalProjectCost')?.textContent),
            monthlyRevenue: parseCurrencyValue(document.getElementById('monthlyRevenue')?.textContent),
            monthlyTeamPayout: parseCurrencyValue(document.getElementById('monthlyTeamPayout')?.textContent),
            monthlyCustomerPayment: parseCurrencyValue(document.getElementById('monthlyCustomerPayment')?.textContent),
            monthlyProfit: parseCurrencyValue(document.getElementById('monthlyProfit')?.textContent),
            createdDate: new Date().toISOString(),
            roles: []
        };

        // Get all role cards
        document.querySelectorAll('.role-card').forEach(card => {
            const hoursInput = card.querySelector('.role-hours input');
            const hours = parseInt(hoursInput?.value) || 0;
            
            if (hours > 0) {
                const isMyRole = card.querySelector('.my-job-button')?.classList.contains('active');
                const clientRate = parseFloat(card.querySelector('.client-rate')?.value) || 0;
                const devRate = parseFloat(card.querySelector('.dev-rate')?.value) || 0;
                const roleTitle = card.querySelector('h3')?.textContent || 'Unknown Role';

                projectData.roles.push({
                    title: roleTitle,
                    hours: hours,
                    clientRate: clientRate,
                    devRate: devRate,
                    isMyJob: isMyRole
                });
            }
        });

        console.log('Project data prepared:', projectData);

        // Create filename using CustomerName_ProjectName format
        const safeCustomerName = customer.replace(/[^a-zA-Z0-9]/g, '');
        const safeProjectName = projectName.replace(/[^a-zA-Z0-9]/g, '');
        const fileName = `${safeCustomerName}_${safeProjectName}.json`;

        // Convert to JSON and create blob
        const fileContent = JSON.stringify(projectData, null, 2);
        const file = new Blob([fileContent], { type: 'application/json' });

        try {
            // Try to save to SharePoint first
            const sharePointService = window.SharePointService.getInstance();
            if (sharePointService) {
                // Check if we're editing an existing file
                const editCustomerName = sessionStorage.getItem('editCustomerName');
                const editProjectName = sessionStorage.getItem('editProjectName');
                
                if (editCustomerName && editProjectName) {
                    // If the name has changed, delete the old file
                    const oldFileName = `${editCustomerName}_${editProjectName}.json`;
                    if (oldFileName !== fileName) {
                        try {
                            const files = await sharePointService.listFiles();
                            const oldFile = files.value.find(f => f.name === oldFileName);
                            if (oldFile) {
                                await sharePointService.deleteFile(oldFile.id);
                                console.log('Deleted old file:', oldFileName);
                            }
                        } catch (error) {
                            console.warn('Error deleting old file:', error);
                        }
                    }
                }

                console.log('Saving to SharePoint as:', fileName);
                await sharePointService.uploadFile('Project Price Calculator', fileName, file);
                console.log('Save successful!');

                showBanner('Project saved successfully!', 'success');
                sessionStorage.removeItem('editCustomerName');
                sessionStorage.removeItem('editProjectName');
                
                // Redirect after a short delay
                setTimeout(() => {
                    window.location.href = 'repository.html';
                }, 1500);
            } else {
                throw new Error('SharePoint service not available');
            }
        } catch (sharePointError) {
            console.error('SharePoint save failed:', sharePointError);
            
            showBanner(`
                <div class="banner-content">
                    <p>Could not save to SharePoint. Click below to download the file locally:</p>
                    <button class="action-button primary" id="downloadButton">
                        <i class="fas fa-download"></i> Download Project File
                    </button>
                </div>
            `, 'warning');
            
            // Setup download button
            document.getElementById('downloadButton').onclick = () => {
                const downloadLink = document.createElement('a');
                downloadLink.href = URL.createObjectURL(file);
                downloadLink.download = fileName;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
                
                showBanner('File downloaded successfully!', 'success');
            };
        }
    } catch (error) {
        console.error('Error saving estimate:', error);
        showBanner('Error saving project: ' + error.message, 'error');
    }
}

// Helper function to parse currency values from string
function parseCurrencyValue(currencyString) {
    if (!currencyString) return 0;
    return parseFloat(currencyString.replace(/[^0-9.-]+/g, '')) || 0;
}

// Update the initialization code
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM Content Loaded - Initializing calculator');
    
    try {
        // Initialize services first
        await initializeServices();
        
        // Check if we're editing an existing project
        const editCustomerName = sessionStorage.getItem('editCustomerName');
        const editProjectName = sessionStorage.getItem('editProjectName');
        
        if (editCustomerName && editProjectName) {
            console.log('Loading existing project for editing:', editCustomerName, editProjectName);
            
            // List all files in the library
            const files = await window.SharePointService.listFiles();
            console.log('Files found:', files);
            
            // Find the file that matches our project
            const fileName = `${editCustomerName}_${editProjectName}.json`;
            const projectFile = files.value.find(f => f.name === fileName);
            
            if (projectFile) {
                // Download and load the file content
                const response = await fetch(projectFile.webUrl);
                const projectData = await response.json();
                
                // Populate form fields
                document.getElementById('projectName').value = projectData.projectName || '';
                document.getElementById('customer').value = projectData.customer || 'Select Customer';
                document.getElementById('duration').value = projectData.duration || 1;
                document.getElementById('profitAdjustment').value = projectData.profitAdjustment || 0;
                
                // Load roles
                if (projectData.roles) {
                    projectData.roles.forEach(role => {
                        const roleCard = document.querySelector(`.role-card[data-role="${role.title.toLowerCase()}"]`);
                        if (roleCard) {
                            roleCard.querySelector('.role-hours input').value = role.hours;
                            roleCard.querySelector('.client-rate').value = role.clientRate;
                            roleCard.querySelector('.dev-rate').value = role.devRate;
                            if (role.isMyJob) {
                                roleCard.querySelector('.my-job-button').classList.add('active');
                            }
                        }
                    });
                }
                
                // Recalculate totals
                calculateProjectSummary();
            } else {
                console.error('Project file not found:', fileName);
                alert('Could not find the project file. Starting with a new project.');
            }
        }
    } catch (error) {
        console.error('Error initializing calculator:', error);
        alert('Error loading project: ' + error.message);
    }
}); 