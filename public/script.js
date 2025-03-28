// DOM Elements - Rates and Hours
const roles = {
    backend: {
        rate: document.getElementById('backend-rate'),
        hours: document.getElementById('backend-hours'),
        myRole: document.getElementById('backend-my-role')
    },
    frontend: {
        rate: document.getElementById('frontend-rate'),
        hours: document.getElementById('frontend-hours'),
        myRole: document.getElementById('frontend-my-role')
    },
    ui: {
        rate: document.getElementById('ui-rate'),
        hours: document.getElementById('ui-hours'),
        myRole: document.getElementById('ui-my-role')
    },
    pm: {
        rate: document.getElementById('pm-rate'),
        hours: document.getElementById('pm-hours'),
        myRole: document.getElementById('pm-my-role')
    },
    ba: {
        rate: document.getElementById('ba-rate'),
        hours: document.getElementById('ba-hours'),
        myRole: document.getElementById('ba-my-role')
    },
    devops: {
        rate: document.getElementById('devops-rate'),
        hours: document.getElementById('devops-hours'),
        myRole: document.getElementById('devops-my-role')
    },
    qa: {
        rate: document.getElementById('qa-rate'),
        hours: document.getElementById('qa-hours'),
        myRole: document.getElementById('qa-my-role')
    },
    cr: {
        rate: document.getElementById('cr-rate'),
        hours: document.getElementById('cr-hours'),
        myRole: document.getElementById('cr-my-role')
    },
    support: {
        rate: document.getElementById('support-rate'),
        hours: document.getElementById('support-hours'),
        myRole: document.getElementById('support-my-role')
    },
    content: {
        rate: document.getElementById('content-rate'),
        hours: document.getElementById('content-hours'),
        myRole: document.getElementById('content-my-role')
    },
    consulting: {
        rate: document.getElementById('consulting-rate'),
        hours: document.getElementById('consulting-hours'),
        myRole: document.getElementById('consulting-my-role')
    }
};

// Project Settings
const profitMarginInput = document.getElementById('profit-margin');
const monthlyProfitInput = document.getElementById('monthly-profit');
const durationInput = document.getElementById('duration');
const timelinePreference = document.getElementById('timeline-preference');

// Summary Elements
const monthlyPaymentElement = document.getElementById('monthly-payment');
const monthlyTeamPayoutElement = document.getElementById('monthly-team-payout');
const myMonthlyRevenueElement = document.getElementById('my-monthly-revenue');
const myMonthlyProfitElement = document.getElementById('my-monthly-profit');

// Add event listeners for all inputs
Object.values(roles).forEach(role => {
    [role.rate, role.hours, role.myRole].forEach(input => {
        if (input) input.addEventListener('input', calculateTotals);
    });
});

[monthlyProfitInput, durationInput, timelinePreference].forEach(input => {
    input.addEventListener('input', calculateTotals);
});

function calculateTotals() {
    // Calculate costs for my roles and team roles
    let myRolesCost = 0;
    let teamRolesCost = 0;

    Object.values(roles).forEach(role => {
        const cost = Number(role.rate.value) * Number(role.hours.value);
        if (role.myRole && role.myRole.checked) {
            myRolesCost += cost;
        } else {
            teamRolesCost += cost;
        }
    });

    const totalCost = myRolesCost + teamRolesCost;
    
    // Get project duration
    const duration = Number(durationInput.value) || 1;
    
    // Calculate desired total profit from monthly profit
    const desiredMonthlyProfit = Number(monthlyProfitInput.value);
    const desiredTotalProfit = desiredMonthlyProfit * duration;
    
    // Calculate profit margin percentage
    const profitMarginPercentage = (desiredTotalProfit / totalCost * 100) || 0;
    profitMarginInput.value = Math.round(profitMarginPercentage);
    
    // Get rush multiplier
    let multiplier = 1;
    switch (timelinePreference.value) {
        case 'rush':
            multiplier = 1.5;
            break;
        case 'relaxed':
            multiplier = 0.9;
            break;
    }
    
    // Calculate final price and monthly breakdowns
    const finalPrice = (totalCost + desiredTotalProfit) * multiplier;
    const monthlyPayment = finalPrice / duration;
    const monthlyTeamPayout = teamRolesCost / duration;
    const myMonthlyRevenue = myRolesCost / duration;
    const myMonthlyProfit = myMonthlyRevenue + desiredMonthlyProfit;
    
    // Update display
    monthlyPaymentElement.textContent = formatCurrency(monthlyPayment);
    monthlyTeamPayoutElement.textContent = formatCurrency(monthlyTeamPayout);
    myMonthlyRevenueElement.textContent = formatCurrency(myMonthlyRevenue);
    myMonthlyProfitElement.textContent = formatCurrency(myMonthlyProfit);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Initialize calculations
calculateTotals(); 