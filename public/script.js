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

// Format currency
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
};

// Initialize variables to store calculations
let selectedRoles = new Set();
let calculatedProjectCost = 0;
let totalProjectCost = 0;
let monthlyCustomerPayment = 0;
let monthlyTeamPayout = 0;
let monthlyProfit = 0;
let monthlyRevenue = 0;

// Initialize the calculator
document.addEventListener('DOMContentLoaded', () => {
    const roleCards = document.querySelectorAll('.role-card');
    const customerSelect = document.getElementById('customer');
    const durationInput = document.getElementById('duration');
    const projectPriceInput = document.getElementById('projectPrice');

    // Get rates for a role
    const getRoleRates = (roleCard) => {
        const clientRateInput = roleCard.querySelector('.client-rate');
        const devRateInput = roleCard.querySelector('.dev-rate');
        return {
            clientRate: parseFloat(clientRateInput.value) || 0,
            devRate: parseFloat(devRateInput.value) || 0
        };
    };

    // Update role card total
    const updateRoleTotal = (roleCard) => {
        const hoursInput = roleCard.querySelector('.role-hours input');
        const totalElement = roleCard.querySelector('.total-amount');
        const rates = getRoleRates(roleCard);
        
        const hours = parseInt(hoursInput.value) || 0;
        const total = hours * rates.clientRate;
        
        totalElement.textContent = formatCurrency(total);
        updateProjectSummary();
    };

    // Calculate project summary
    const updateProjectSummary = () => {
        const duration = parseInt(durationInput.value) || 1;
        const projectPrice = parseFloat(projectPriceInput.value) || 0;

        calculatedProjectCost = 0;
        monthlyTeamPayout = 0;
        monthlyRevenue = 0;

        roleCards.forEach(card => {
            const hoursInput = card.querySelector('.role-hours input');
            const hours = parseInt(hoursInput.value) || 0;
            const isMyRole = card.querySelector('.role-toggle').checked;
            const rates = getRoleRates(card);

            if (hours > 0) {
                const roleTotal = hours * rates.clientRate;
                calculatedProjectCost += roleTotal;

                if (isMyRole) {
                    monthlyRevenue += ((rates.clientRate - rates.devRate) * hours) / duration;
                } else {
                    monthlyTeamPayout += (rates.devRate * hours) / duration;
                }
            }
        });

        // Use project price if set, otherwise use calculated cost
        totalProjectCost = projectPrice > 0 ? projectPrice : calculatedProjectCost;
        
        monthlyCustomerPayment = totalProjectCost / duration;
        monthlyProfit = monthlyCustomerPayment - monthlyTeamPayout - monthlyRevenue;
        monthlyRevenue += monthlyProfit;

        // Update summary display with animations
        const elements = {
            'totalProjectCost': totalProjectCost,
            'monthlyCustomerPayment': monthlyCustomerPayment,
            'monthlyTeamPayout': monthlyTeamPayout,
            'monthlyProfit': monthlyProfit,
            'monthlyRevenue': monthlyRevenue
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.style.transition = 'opacity 0.3s';
                element.style.opacity = '0';
                setTimeout(() => {
                    element.textContent = formatCurrency(value);
                    element.style.opacity = '1';
                }, 150);
            }
        });
    };

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
    roleCards.forEach(card => {
        const hoursInput = card.querySelector('.role-hours input');
        const roleToggle = card.querySelector('.role-toggle');
        const clientRateInput = card.querySelector('.client-rate');
        const devRateInput = card.querySelector('.dev-rate');

        if (hoursInput) {
            hoursInput.addEventListener('input', () => updateRoleTotal(card));
        }
        
        if (roleToggle) {
            roleToggle.addEventListener('change', () => {
                card.classList.toggle('selected', roleToggle.checked);
                updateProjectSummary();
            });
        }

        if (clientRateInput) {
            clientRateInput.addEventListener('input', () => updateRoleTotal(card));
        }

        if (devRateInput) {
            devRateInput.addEventListener('input', () => updateRoleTotal(card));
        }
    });

    // Event listeners for settings
    if (customerSelect) {
        customerSelect.addEventListener('change', updateCustomerRates);
    }

    if (durationInput) {
        durationInput.addEventListener('input', updateProjectSummary);
    }

    if (projectPriceInput) {
        projectPriceInput.addEventListener('input', updateProjectSummary);
    }

    // Initialize calculations
    updateCustomerRates();
});

// Add click handlers for My Job buttons
document.querySelectorAll('.my-job-button').forEach(button => {
    button.addEventListener('click', function() {
        const roleCard = this.closest('.role-card');
        this.classList.toggle('active');
        
        if (this.classList.contains('active')) {
            selectedRoles.add(roleCard.dataset.role);
        } else {
            selectedRoles.delete(roleCard.dataset.role);
        }
        
        calculateTotals();
    });
});

// Add input handlers for all number inputs
document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('input', calculateTotals);
});

function calculateTotals() {
    const duration = parseInt(document.getElementById('duration').value) || 1;
    const profitAdjustment = parseFloat(document.getElementById('profitAdjustment').value) || 0;
    
    calculatedProjectCost = 0;
    monthlyTeamPayout = 0;
    monthlyRevenue = 0;
    
    // Calculate totals for each role
    document.querySelectorAll('.role-card').forEach(roleCard => {
        const hours = parseInt(roleCard.querySelector('.role-hours input').value) || 0;
        const clientRate = parseFloat(roleCard.querySelector('.client-rate').value) || 0;
        const devRate = parseFloat(roleCard.querySelector('.dev-rate').value) || 0;
        const isMyRole = roleCard.querySelector('.my-job-button').classList.contains('active');
        
        // Calculate role total based on hours and client rate
        const roleTotal = hours * clientRate;
        roleCard.querySelector('.total-amount').textContent = formatCurrency(roleTotal);
        
        // Calculate monthly values
        if (hours > 0) {
            if (isMyRole) {
                // For "My Job" roles, add to monthly revenue at client rate
                monthlyRevenue += (clientRate * hours) / duration;
            } else {
                // For other roles, add to team payout at dev rate
                monthlyTeamPayout += (devRate * hours) / duration;
            }
        }
    });

    // Base cost is what we need to cover revenue and team payout
    const baseMonthlyAmount = monthlyRevenue + monthlyTeamPayout;
    
    // Add the profit adjustment to get total monthly amount
    monthlyCustomerPayment = baseMonthlyAmount + profitAdjustment;
    
    // Calculate total project cost
    totalProjectCost = monthlyCustomerPayment * duration;
    
    // Calculate remaining customer payment after my revenue
    const remainingCustomerPayment = monthlyCustomerPayment - monthlyRevenue;
    
    // Calculate profit from remaining amount after team payout
    const profitFromRemaining = Math.max(0, remainingCustomerPayment - monthlyTeamPayout);
    
    // Monthly profit = My Revenue + leftover after team payout
    monthlyProfit = monthlyRevenue + profitFromRemaining;
    
    // Calculate and update profit percentage
    const profitPercentage = (monthlyProfit / monthlyCustomerPayment * 100).toFixed(1);
    document.getElementById('profitPercentage').textContent = `${profitPercentage}%`;
    
    // Update summary display
    updateSummaryDisplay();
}

function updateSummaryDisplay() {
    document.querySelector('.summary-item:nth-child(1) span').textContent = formatCurrency(monthlyCustomerPayment);
    document.querySelector('.summary-item:nth-child(2) span').textContent = formatCurrency(monthlyTeamPayout);
    document.querySelector('.summary-item:nth-child(3) span').textContent = formatCurrency(monthlyProfit);
    document.querySelector('.summary-item:nth-child(4) span').textContent = formatCurrency(monthlyRevenue);
    document.querySelector('.total-project-cost span').textContent = formatCurrency(totalProjectCost);
}

// Add event listener for profit adjustment
document.getElementById('profitAdjustment').addEventListener('input', calculateTotals); 