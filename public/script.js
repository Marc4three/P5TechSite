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
    const profitAdjustment = parseFloat(document.getElementById('profitAdjustment').value) || 0;
    
    // Reset calculations
    let totalRevenue = 0;
    let totalTeamPayout = 0;
    let totalTeamClientBillable = 0;

    // Calculate costs for each role
    document.querySelectorAll('.role-card').forEach(card => {
        const hoursInput = card.querySelector('.role-hours input');
        const hours = parseInt(hoursInput.value) || 0;
        const isMyRole = card.querySelector('.my-job-button').classList.contains('active');
        const clientRate = parseFloat(card.querySelector('.client-rate').value) || 0;
        const devRate = parseFloat(card.querySelector('.dev-rate').value) || 0;

        if (hours > 0) {
            // Calculate monthly role total
            const monthlyRoleTotal = hours * clientRate;
            // Calculate total for the entire project duration
            const roleTotal = monthlyRoleTotal * duration;
            
            if (isMyRole) {
                totalRevenue += roleTotal;
            } else {
                totalTeamClientBillable += roleTotal;
                totalTeamPayout += (hours * devRate * duration);
            }

            // Update role card total to show the total for the entire project duration
            card.querySelector('.total-amount').textContent = formatCurrency(roleTotal);
        }
    });

    // Calculate total project cost
    const totalBeforeAdjustment = totalRevenue + totalTeamClientBillable;
    const totalProjectCost = totalBeforeAdjustment + profitAdjustment;

    // Calculate monthly values by dividing by duration
    const monthlyRevenue = totalRevenue / duration;
    const monthlyTeamPayout = totalTeamPayout / duration;
    const monthlyCustomerPayment = totalProjectCost / duration;
    const monthlyProfit = (totalRevenue + (totalTeamClientBillable - totalTeamPayout) + profitAdjustment) / duration;

    // Update displays
    document.getElementById('monthlyRevenue').textContent = formatCurrency(monthlyRevenue);
    document.getElementById('monthlyTeamPayout').textContent = formatCurrency(monthlyTeamPayout);
    document.getElementById('monthlyCustomerPayment').textContent = formatCurrency(monthlyCustomerPayment);
    document.getElementById('monthlyProfit').textContent = formatCurrency(monthlyProfit);
    document.getElementById('totalProjectCost').textContent = formatCurrency(totalProjectCost);

    // Update profit percentage
    const profitPercentage = (monthlyProfit / monthlyCustomerPayment * 100).toFixed(1);
    document.getElementById('profitPercentage').textContent = `${profitPercentage}%`;
}

// Update rates based on customer selection
const updateCustomerRates = () => {
    const selectedCustomer = customerSelect.value;
    const rates = defaultCustomerRates[selectedCustomer];

    roleCards.forEach(card => {
        const roleId = card.dataset.role;
        const roleRates = rates[roleId];
        const clientRateInput = card.querySelector('.client-rate');
        const devRateInput = card.querySelector('.dev-rate');

        if (clientRateInput && devRateInput && roleRates) {
            clientRateInput.value = roleRates.clientRate;
            devRateInput.value = roleRates.devRate;
        }

        updateRoleTotal(card);
    });
};

// Event listeners for role cards
document.querySelectorAll('.role-card').forEach(card => {
    const hoursInput = card.querySelector('.role-hours input');
    const myJobButton = card.querySelector('.my-job-button');
    const clientRateInput = card.querySelector('.client-rate');
    const devRateInput = card.querySelector('.dev-rate');

    if (hoursInput) {
        hoursInput.addEventListener('input', calculateProjectSummary);
    }
    
    if (myJobButton) {
        myJobButton.addEventListener('click', () => {
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
});

// Event listeners for settings
if (customerSelect) {
    customerSelect.addEventListener('change', (event) => {
        if (event.target.value === 'add-new') {
            event.target.value = event.target.dataset.lastValue || 'clinovators';
            showNewCustomerOverlay();
        } else {
            event.target.dataset.lastValue = event.target.value;
            updateRatesForCustomer(event.target.value);
        }
    });
}

if (durationInput) {
    ['input', 'change'].forEach(eventType => {
        durationInput.addEventListener(eventType, calculateProjectSummary);
    });
}

if (projectPriceInput) {
    projectPriceInput.addEventListener('input', calculateProjectSummary);
}

// Add new customer form handlers
const newCustomerForm = document.getElementById('new-customer-form');
const closeButton = document.querySelector('#new-customer-overlay .close-button');
const cancelButton = document.getElementById('cancelCustomer');

newCustomerForm.addEventListener('submit', addNewCustomer);
closeButton.addEventListener('click', hideNewCustomerOverlay);
cancelButton.addEventListener('click', hideNewCustomerOverlay);

// Calculate all totals
function calculateTotals() {
    const duration = parseInt(document.getElementById('duration').value) || 1;
    profitAdjustment = parseFloat(document.getElementById('profitAdjustment').value) || 0;
    
    // Reset calculations
    totalRevenue = 0;
    totalTeamPayout = 0;
    totalClientBillable = 0;

    // Calculate totals for each role
    document.querySelectorAll('.role-card').forEach(roleCard => {
        const hours = parseInt(roleCard.querySelector('.role-hours input').value) || 0;
        const clientRate = parseFloat(roleCard.querySelector('.client-rate').value) || 0;
        const devRate = parseFloat(roleCard.querySelector('.dev-rate').value) || 0;
        const isMyRole = roleCard.querySelector('.my-job-button').classList.contains('active');
        
        if (hours > 0) {
            const roleTotal = hours * clientRate;
            
            // Update role card total
            roleCard.querySelector('.total-amount').textContent = formatCurrency(roleTotal);
            
            if (isMyRole) {
                totalRevenue += roleTotal;
            } else {
                totalClientBillable += roleTotal;
                totalTeamPayout += (hours * devRate);
            }
        }
    });

    // Calculate total project cost (not affected by duration)
    totalProjectCost = totalRevenue + totalClientBillable + profitAdjustment;

    // Calculate monthly values
    updateMonthlyValues();
}

// Update monthly values based on current totals and duration
function updateMonthlyValues() {
    const duration = parseInt(document.getElementById('duration').value) || 1;
    
    // Calculate monthly values
    monthlyRevenue = totalRevenue / duration;
    monthlyTeamPayout = totalTeamPayout / duration;
    monthlyCustomerPayment = totalProjectCost / duration;
    monthlyProfit = (totalRevenue + (totalClientBillable - totalTeamPayout) + profitAdjustment) / duration;

    // Update display for monthly values
    const monthlyElements = {
        'monthlyRevenue': monthlyRevenue,
        'monthlyTeamPayout': monthlyTeamPayout,
        'monthlyCustomerPayment': monthlyCustomerPayment,
        'monthlyProfit': monthlyProfit
    };

    Object.entries(monthlyElements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = formatCurrency(value);
        }
    });

    // Update total project cost display (this doesn't change with duration)
    const totalProjectElement = document.getElementById('totalProjectCost');
    if (totalProjectElement) {
        totalProjectElement.textContent = formatCurrency(totalProjectCost);
    }

    // Update profit percentage
    const profitPercentage = (monthlyProfit / monthlyCustomerPayment * 100).toFixed(1);
    const profitPercentageElement = document.getElementById('profitPercentage');
    if (profitPercentageElement) {
        profitPercentageElement.textContent = `${profitPercentage}%`;
    }
}

// Initialize the calculator
document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners for role cards
    document.querySelectorAll('.role-card').forEach(card => {
        const hoursInput = card.querySelector('.role-hours input');
        const myJobButton = card.querySelector('.my-job-button');
        const clientRateInput = card.querySelector('.client-rate');
        const devRateInput = card.querySelector('.dev-rate');

        if (hoursInput) {
            hoursInput.addEventListener('input', calculateProjectSummary);
        }
        
        if (myJobButton) {
            myJobButton.addEventListener('click', () => {
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
    });

    // Add event listeners for settings
    const customerSelect = document.getElementById('customer');
    const durationInput = document.getElementById('duration');
    const profitAdjustmentInput = document.getElementById('profitAdjustment');

    if (customerSelect) {
        customerSelect.addEventListener('change', (event) => {
            if (event.target.value === 'add-new') {
                event.target.value = event.target.dataset.lastValue || 'clinovators';
                showNewCustomerOverlay();
            } else {
                event.target.dataset.lastValue = event.target.value;
                updateRatesForCustomer(event.target.value);
            }
        });
    }

    // Set up duration input handler
    if (durationInput) {
        durationInput.addEventListener('input', () => {
            console.log('Duration changed:', durationInput.value); // Debug log
            calculateProjectSummary();
        });
    }

    if (profitAdjustmentInput) {
        profitAdjustmentInput.addEventListener('input', calculateProjectSummary);
    }

    // Initial calculation
    calculateProjectSummary();
});

// Add save estimate functionality
function saveEstimate() {
    const projectName = document.getElementById('projectName').value;
    const customerSelect = document.getElementById('customer');
    const customerName = customerSelect ? customerSelect.value : '';
    
    // Get all role data
    const roles = [];
    document.querySelectorAll('.role-card').forEach(card => {
        const hours = parseInt(card.querySelector('.role-hours input').value) || 0;
        if (hours > 0) {
            const title = card.dataset.role;
            const clientRate = parseFloat(card.querySelector('.client-rate').value) || 0;
            const devRate = parseFloat(card.querySelector('.dev-rate').value) || 0;
            const isMyJob = card.querySelector('.my-job-button').classList.contains('active');
            
            roles.push({
                title,
                hours,
                clientRate,
                devRate,
                isMyJob
            });
        }
    });

    // Get duration and profit adjustment
    const duration = parseInt(document.getElementById('duration').value) || 1;
    const profitAdjustment = parseFloat(document.getElementById('profitAdjustment').value) || 0;
    
    // Create the project data object
    const projectData = {
        id: Date.now(),
        name: projectName || 'Untitled Project',
        customer: customerName,
        type: 'project-price',
        source: 'Project Pricer',
        status: 'draft',
        createdDate: new Date().toISOString().split('T')[0],
        roles: roles,
        duration: duration,
        profitAdjustment: profitAdjustment,
        monthlyRevenue: monthlyRevenue,
        monthlyTeamPayout: monthlyTeamPayout,
        monthlyCustomerPayment: monthlyCustomerPayment,
        monthlyProfit: monthlyProfit,
        totalCost: totalProjectCost,
        monthlyCost: monthlyCustomerPayment
    };

    // Save to localStorage
    let projects = JSON.parse(localStorage.getItem('projects') || '[]');
    projects.push(projectData);
    localStorage.setItem('projects', JSON.stringify(projects));
    
    // Show success notification with repository link
    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.innerHTML = `
        Project estimate saved successfully! 
        <a href="repository.html" style="color: inherit; text-decoration: underline; margin-left: 5px;">
            View in Repository
        </a>
    `;
    document.body.appendChild(notification);
    
    // Fade in
    requestAnimationFrame(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    });
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Add event listener for save estimate button
document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.querySelector('.save-estimate-button');
    if (saveButton) {
        saveButton.addEventListener('click', saveEstimate);
    }
    
    // Add project name input if it doesn't exist
    if (!document.getElementById('projectName')) {
        const settingsSection = document.querySelector('.settings-section');
        const projectNameInput = document.createElement('div');
        projectNameInput.className = 'setting-item';
        projectNameInput.innerHTML = `
            <label for="projectName">Project Name</label>
            <input type="text" id="projectName" placeholder="Enter project name">
        `;
        settingsSection.insertBefore(projectNameInput, settingsSection.firstChild);
    }
}); 