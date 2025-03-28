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
    }
};

// State management
const state = {
    roles: [
        { id: 'pm', name: 'Project Management', clientRate: 60, devRate: 50, hours: 40, isSelected: true },
        { id: 'frontend', name: 'Frontend Development', clientRate: 60, devRate: 50, hours: 120, isSelected: true },
        { id: 'backend', name: 'Backend Development', clientRate: 60, devRate: 50, hours: 160, isSelected: false },
        { id: 'uiux', name: 'UI/UX Design', clientRate: 60, devRate: 50, hours: 80, isSelected: false },
        { id: 'devops', name: 'Architecture/DevOps', clientRate: 60, devRate: 50, hours: 40, isSelected: true },
        { id: 'qa', name: 'QA/Testing', clientRate: 60, devRate: 50, hours: 60, isSelected: false },
        { id: 'support', name: 'Customer Support/Training', clientRate: 60, devRate: 50, hours: 40, isSelected: true }
    ],
    settings: {
        selectedCustomer: 'clinovators',
        profitMargin: 20,
        timelinePreference: 'normal',
        overtimePremium: 50,
        teamCapacity: 100
    }
};

// DOM Elements - Customer Selection
const customerSelect = document.getElementById('customer-select');

// DOM Elements - Rates and Hours
const roles = {
    backend: {
        clientRate: document.getElementById('backend-client-rate'),
        devRate: document.getElementById('backend-dev-rate'),
        hours: document.getElementById('backend-hours'),
        myRole: document.getElementById('backend-my-role'),
        total: document.getElementById('backend-total')
    },
    frontend: {
        clientRate: document.getElementById('frontend-client-rate'),
        devRate: document.getElementById('frontend-dev-rate'),
        hours: document.getElementById('frontend-hours'),
        myRole: document.getElementById('frontend-my-role'),
        total: document.getElementById('frontend-total')
    },
    ui: {
        clientRate: document.getElementById('ui-client-rate'),
        devRate: document.getElementById('ui-dev-rate'),
        hours: document.getElementById('ui-hours'),
        myRole: document.getElementById('ui-my-role'),
        total: document.getElementById('ui-total')
    },
    pm: {
        rate: document.getElementById('pm-rate'),
        hours: document.getElementById('pm-hours'),
        myRole: document.getElementById('pm-my-role'),
        total: document.getElementById('pm-total')
    },
    devops: {
        rate: document.getElementById('devops-rate'),
        hours: document.getElementById('devops-hours'),
        myRole: document.getElementById('devops-my-role'),
        total: document.getElementById('devops-total')
    },
    qa: {
        clientRate: document.getElementById('qa-client-rate'),
        devRate: document.getElementById('qa-dev-rate'),
        hours: document.getElementById('qa-hours'),
        myRole: document.getElementById('qa-my-role'),
        total: document.getElementById('qa-total')
    },
    support: {
        rate: document.getElementById('support-rate'),
        hours: document.getElementById('support-hours'),
        myRole: document.getElementById('support-my-role'),
        total: document.getElementById('support-total')
    }
};

// Project Settings
const profitMarginInput = document.getElementById('profit-margin');
const monthlyProfitInput = document.getElementById('monthly-profit');
const durationInput = document.getElementById('duration');
const timelinePreference = document.getElementById('timeline-preference');
const teamCapacityInput = document.getElementById('team-capacity');
const overtimePremiumInput = document.getElementById('overtime-premium-group');
const overtimePremium = document.getElementById('overtime-premium');

// Summary Elements
const monthlyPaymentElement = document.getElementById('monthly-payment');
const monthlyTeamPayoutElement = document.getElementById('monthly-team-payout');
const myMonthlyRevenueElement = document.getElementById('my-monthly-revenue');
const myMonthlyProfitElement = document.getElementById('my-monthly-profit');

// Initialize role cards
function initializeRoleCards() {
    const roleContainer = document.querySelector('.role-grid');
    if (!roleContainer) return;

    const roleCards = [
        {
            id: 'backend',
            name: 'Backend Development',
            clientRate: 60,
            devRate: 50,
            hours: 160
        },
        {
            id: 'frontend',
            name: 'Frontend Development',
            clientRate: 60,
            devRate: 50,
            hours: 120
        },
        {
            id: 'ui',
            name: 'UI/UX Design',
            clientRate: 60,
            devRate: 50,
            hours: 80
        },
        {
            id: 'pm',
            name: 'Project Management',
            rate: 60,
            hours: 40
        },
        {
            id: 'devops',
            name: 'Architecture/DevOps',
            rate: 60,
            hours: 40
        },
        {
            id: 'qa',
            name: 'QA/Testing',
            clientRate: 60,
            devRate: 50,
            hours: 60
        },
        {
            id: 'support',
            name: 'Customer Support/Training',
            rate: 60,
            hours: 40
        }
    ];

    roleContainer.innerHTML = roleCards.map(role => {
        if (role.clientRate !== undefined) {
            return `
                <div class="role-card" id="${role.id}-card">
                    <h3>${role.name}</h3>
                    <div class="rate-group">
                        <div class="input-group">
                            <label for="${role.id}-client-rate">Client Rate ($)</label>
                            <input type="number" id="${role.id}-client-rate" value="${role.clientRate}" min="0">
                        </div>
                        <div class="input-group">
                            <label for="${role.id}-dev-rate">Developer Rate ($)</label>
                            <input type="number" id="${role.id}-dev-rate" value="${role.devRate}" min="0">
                        </div>
                        <div class="input-group">
                            <label for="${role.id}-hours">Projected Hours</label>
                            <input type="number" id="${role.id}-hours" value="${role.hours}" min="0">
                        </div>
                    </div>
                    <div class="role-toggle">
                        <label class="toggle">
                            <input type="checkbox" id="${role.id}-my-role">
                            <span class="toggle-slider"></span>
                            My Role
                        </label>
                        <span class="role-total" id="${role.id}-total">$0</span>
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="role-card" id="${role.id}-card">
                    <h3>${role.name}</h3>
                    <div class="rate-group">
                        <div class="input-group">
                            <label for="${role.id}-rate">Hourly Rate ($)</label>
                            <input type="number" id="${role.id}-rate" value="${role.rate}" min="0">
                        </div>
                        <div class="input-group">
                            <label for="${role.id}-hours">Hours</label>
                            <input type="number" id="${role.id}-hours" value="${role.hours}" min="0">
                        </div>
                    </div>
                    <div class="role-toggle">
                        <label class="toggle">
                            <input type="checkbox" id="${role.id}-my-role">
                            <span class="toggle-slider"></span>
                            My Role
                        </label>
                        <span class="role-total" id="${role.id}-total">$0</span>
                    </div>
                </div>
            `;
        }
    }).join('');

    // Initialize role references after creating cards
    Object.keys(roles).forEach(roleId => {
        roles[roleId] = {
            clientRate: document.getElementById(`${roleId}-client-rate`),
            devRate: document.getElementById(`${roleId}-dev-rate`),
            rate: document.getElementById(`${roleId}-rate`),
            hours: document.getElementById(`${roleId}-hours`),
            myRole: document.getElementById(`${roleId}-my-role`),
            total: document.getElementById(`${roleId}-total`)
        };
    });

    // Set default roles
    setDefaultRoles();
    
    // Add interactive features
    addInteractiveFeatures();
}

// Set default roles
function setDefaultRoles() {
    if (roles.pm && roles.pm.myRole) roles.pm.myRole.checked = true;
    if (roles.frontend && roles.frontend.myRole) roles.frontend.myRole.checked = true;
    if (roles.devops && roles.devops.myRole) roles.devops.myRole.checked = true;
    if (roles.support && roles.support.myRole) roles.support.myRole.checked = true;

    // Add visual feedback for selected roles
    Object.values(roles).forEach(role => {
        if (role.myRole && role.myRole.checked) {
            const card = role.myRole.closest('.role-card');
            if (card) card.classList.add('selected');
        }
    });
}

// Add interactive features
function addInteractiveFeatures() {
    // Add hover effects to role cards
    document.querySelectorAll('.role-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-2px)';
            card.style.boxShadow = '0 6px 12px rgba(0,0,0,0.1)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'none';
            card.style.boxShadow = 'none';
        });
    });

    // Add event listeners for all inputs
    Object.values(roles).forEach(role => {
        if (role.clientRate && role.devRate) {
            [role.clientRate, role.devRate, role.hours, role.myRole].forEach(input => {
                if (input) {
                    input.addEventListener('input', calculateTotals);
                    if (input.type === 'checkbox') {
                        input.addEventListener('change', () => {
                            const card = input.closest('.role-card');
                            if (card) {
                                card.classList.toggle('selected', input.checked);
                                const inputs = card.querySelectorAll('input[type="number"]');
                                inputs.forEach(numInput => {
                                    numInput.disabled = !input.checked;
                                });
                            }
                            calculateTotals();
                        });
                    }
                }
            });
        } else if (role.rate) {
            [role.rate, role.hours, role.myRole].forEach(input => {
                if (input) {
                    input.addEventListener('input', calculateTotals);
                    if (input.type === 'checkbox') {
                        input.addEventListener('change', () => {
                            const card = input.closest('.role-card');
                            if (card) {
                                card.classList.toggle('selected', input.checked);
                                const inputs = card.querySelectorAll('input[type="number"]');
                                inputs.forEach(numInput => {
                                    numInput.disabled = !input.checked;
                                });
                            }
                            calculateTotals();
                        });
                    }
                }
            });
        }
    });

    // Other input event listeners
    [monthlyProfitInput, durationInput, timelinePreference, teamCapacityInput, overtimePremium].forEach(input => {
        if (input) {
            input.addEventListener('input', calculateTotals);
            input.addEventListener('change', calculateTotals);
        }
    });

    // Customer selection event listener
    if (customerSelect) {
        customerSelect.addEventListener('change', () => {
            updateRatesForCustomer();
            calculateTotals();
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeRoleCards();
    updateRatesForCustomer();
    calculateTotals();
});

// Update DOM elements with calculated values with animations
function updateSummary(monthlyPayment, monthlyTeamPayout, myMonthlyRevenue, myMonthlyProfit, totalProjectCost) {
    const elements = {
        'monthly-payment': monthlyPayment,
        'monthly-team-payout': monthlyTeamPayout,
        'my-monthly-revenue': myMonthlyRevenue,
        'my-monthly-profit': myMonthlyProfit,
        'total-project-cost': totalProjectCost
    };

    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.style.transition = 'opacity 0.3s';
            element.style.opacity = '0';
            setTimeout(() => {
                element.textContent = `$${Math.round(value).toLocaleString()}`;
                element.style.opacity = '1';
            }, 150);
        }
    });
}

function updateRoleTotal(card) {
    const total = card.querySelector('.role-total');
    if (total) {
        const roleId = card.id.split('-')[0];
        const role = roles[roleId];
        let monthlyHours = 0;
        let monthlyCost = 0;

        if (role.clientRate && role.devRate) {
            const hours = Number(role.hours.value) || 0;
            const rate = role.myRole.checked ? Number(role.devRate.value) || 0 : Number(role.clientRate.value) || 0;
            monthlyHours = hours / Number(durationInput.value || 1);
            monthlyCost = (rate * hours) / Number(durationInput.value || 1);
        } else if (role.rate) {
            const hours = Number(role.hours.value) || 0;
            const rate = Number(role.rate.value) || 0;
            monthlyHours = hours / Number(durationInput.value || 1);
            monthlyCost = (rate * hours) / Number(durationInput.value || 1);
        }

        total.style.transition = 'opacity 0.3s';
        total.style.opacity = '0';
        setTimeout(() => {
            total.textContent = `$${Math.round(monthlyCost).toLocaleString()}/mo (${Math.round(monthlyHours)} hrs/mo)`;
            total.style.opacity = '1';
        }, 150);
    }
}

function calculateTotals() {
    const selectedRoles = state.roles.filter(role => role.isSelected);
    const totalHours = selectedRoles.reduce((sum, role) => sum + role.hours, 0);
    
    // Calculate base costs and revenue
    const totalCost = selectedRoles.reduce((sum, role) => sum + (role.devRate * role.hours), 0);
    const totalRevenue = selectedRoles.reduce((sum, role) => sum + (role.clientRate * role.hours), 0);
    
    // Adjust for timeline preference
    let timelineMultiplier = 1;
    let costMultiplier = 1;
    
    switch (state.settings.timelinePreference) {
        case 'compressed':
            timelineMultiplier = 0.7;
            costMultiplier = 1.3;
            break;
        case 'overtime':
            timelineMultiplier = 0.8;
            costMultiplier = 1 + (state.settings.overtimePremium / 100);
            break;
    }
    
    // Calculate project duration and metrics
    const hoursPerMonth = 160; // 40 hours/week * 4 weeks
    const projectDuration = (totalHours / hoursPerMonth) * timelineMultiplier;
    const teamUtilization = Math.min(100, (totalHours / (hoursPerMonth * projectDuration)) * 100);
    
    const adjustedCost = totalCost * costMultiplier;
    const monthlyRevenue = totalRevenue / projectDuration;
    const totalProfit = totalRevenue - adjustedCost;

    // Update summary display
    updateSummary(monthlyRevenue, totalProfit, totalCost, projectDuration, teamUtilization);

    // Add smooth transitions for updates
    document.querySelectorAll('.role-total').forEach(total => {
        updateRoleTotal(total.closest('.role-card'));
    });
    
    // Update summary with animations
    updateSummary(monthlyRevenue, totalProfit, totalCost, projectDuration, teamUtilization);
}

// Utility Functions
function updateClinovatorsRates() {
    state.roles.forEach(role => {
        role.clientRate = 60;
        role.devRate = 50;
        const clientRateInput = document.querySelector(`#${role.id}-client-rate`);
        const devRateInput = document.querySelector(`#${role.id}-dev-rate`);
        if (clientRateInput) clientRateInput.value = role.clientRate;
        if (devRateInput) devRateInput.value = role.devRate;
        updateRoleCard(role);
    });
}

function toggleOvertimePremium() {
    const overtimeGroup = document.querySelector('#overtime-premium-group');
    if (overtimeGroup) {
        overtimeGroup.style.display = 
            state.settings.timelinePreference === 'overtime' ? 'block' : 'none';
    }
}

function updateSummaryDisplay(summary) {
    document.getElementById('total-project-cost').textContent = formatCurrency(summary.totalProjectCost);
    document.getElementById('monthly-payment').textContent = formatCurrency(summary.monthlyCustomerPayment);
    document.getElementById('monthly-team-payout').textContent = formatCurrency(summary.monthlyTeamPayout);
    document.getElementById('my-monthly-profit').textContent = formatCurrency(summary.myMonthlyProfit);
    document.getElementById('my-monthly-revenue').textContent = formatCurrency(summary.myMonthlyRevenue);
}

// Format currency
function formatCurrency(value) {
    return `$${Math.round(value).toLocaleString()}`;
} 