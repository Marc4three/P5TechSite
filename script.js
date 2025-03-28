// DOM Elements - Rates and Hours
const roles = {
    backend: {
        rate: document.getElementById('backend-rate'),
        hours: document.getElementById('backend-hours')
    },
    frontend: {
        rate: document.getElementById('frontend-rate'),
        hours: document.getElementById('frontend-hours')
    },
    ui: {
        rate: document.getElementById('ui-rate'),
        hours: document.getElementById('ui-hours')
    },
    pm: {
        rate: document.getElementById('pm-rate'),
        hours: document.getElementById('pm-hours')
    },
    ba: {
        rate: document.getElementById('ba-rate'),
        hours: document.getElementById('ba-hours')
    },
    devops: {
        rate: document.getElementById('devops-rate'),
        hours: document.getElementById('devops-hours')
    },
    qa: {
        rate: document.getElementById('qa-rate'),
        hours: document.getElementById('qa-hours')
    },
    cr: {
        rate: document.getElementById('cr-rate'),
        hours: document.getElementById('cr-hours')
    },
    support: {
        rate: document.getElementById('support-rate'),
        hours: document.getElementById('support-hours')
    },
    content: {
        rate: document.getElementById('content-rate'),
        hours: document.getElementById('content-hours')
    },
    consulting: {
        rate: document.getElementById('consulting-rate'),
        hours: document.getElementById('consulting-hours')
    }
};

// Project Settings
const profitMargin = document.getElementById('profit-margin');
const duration = document.getElementById('duration');
const timelinePreference = document.getElementById('timeline-preference');

// Summary Elements
const totalCostElement = document.getElementById('total-cost');
const profitAmountElement = document.getElementById('profit-amount');
const rushMultiplierElement = document.getElementById('rush-multiplier');
const finalPriceElement = document.getElementById('final-price');

// Add event listeners for all inputs
Object.values(roles).forEach(role => {
    [role.rate, role.hours].forEach(input => {
        input.addEventListener('input', calculateTotals);
    });
});

[profitMargin, duration, timelinePreference].forEach(input => {
    input.addEventListener('input', calculateTotals);
});

function calculateTotals() {
    // Calculate total cost from all roles
    const totalCost = Object.values(roles).reduce((sum, role) => {
        return sum + (Number(role.rate.value) * Number(role.hours.value));
    }, 0);
    
    // Calculate profit
    const profitPercentage = Number(profitMargin.value) / 100;
    const profitValue = totalCost * profitPercentage;
    
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
    
    // Calculate final price
    const finalPrice = (totalCost + profitValue) * multiplier;
    
    // Update display
    totalCostElement.textContent = formatCurrency(totalCost);
    profitAmountElement.textContent = formatCurrency(profitValue);
    rushMultiplierElement.textContent = multiplier + '×';
    finalPriceElement.textContent = formatCurrency(finalPrice);
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