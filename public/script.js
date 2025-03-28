// DOM Elements - Rates and Hours
const backendRate = document.getElementById('backend-rate');
const backendHours = document.getElementById('backend-hours');
const uiRate = document.getElementById('ui-rate');
const uiHours = document.getElementById('ui-hours');
const pmRate = document.getElementById('pm-rate');
const pmHours = document.getElementById('pm-hours');

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
[backendRate, backendHours, uiRate, uiHours, pmRate, pmHours].forEach(input => {
    input.addEventListener('input', calculateTotals);
});

[profitMargin, duration, timelinePreference].forEach(input => {
    input.addEventListener('input', calculateTotals);
});

function calculateTotals() {
    // Calculate role costs
    const backendCost = Number(backendRate.value) * Number(backendHours.value);
    const uiCost = Number(uiRate.value) * Number(uiHours.value);
    const pmCost = Number(pmRate.value) * Number(pmHours.value);
    
    // Calculate total cost
    const totalCost = backendCost + uiCost + pmCost;
    
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