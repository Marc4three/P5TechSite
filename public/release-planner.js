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

// State Management
const state = {
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
        currency: 'USD'
    }).format(amount);
};

// DOM Elements
let elements;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    // Cache DOM elements
    elements = {
        overlay: document.getElementById('new-enhancement-overlay'),
        addEnhancementBtn: document.getElementById('add-enhancement-btn'),
        closeBtn: document.querySelector('.close-button'),
        cancelBtn: document.getElementById('cancel-enhancement'),
        enhancementForm: document.getElementById('new-enhancement-form'),
        taskList: document.getElementById('task-list'),
        teamMemberSelect: document.getElementById('team-member-select'),
        isMyJobCheckbox: document.getElementById('is-my-job'),
        customerSelect: document.getElementById('customer-select'),
        hourCap: document.getElementById('hour-cap'),
        releaseMonth: document.getElementById('release-month'),
        releaseName: document.getElementById('release-name'),
        projectName: document.getElementById('project-name'),
        releaseScope: document.getElementById('release-scope'),
        startDate: document.getElementById('start-date'),
        endDate: document.getElementById('end-date')
    };

    // Debug log elements
    console.log('Elements found:', {
        overlay: !!elements.overlay,
        addEnhancementBtn: !!elements.addEnhancementBtn,
        closeBtn: !!elements.closeBtn,
        cancelBtn: !!elements.cancelBtn,
        enhancementForm: !!elements.enhancementForm,
        taskList: !!elements.taskList,
        teamMemberSelect: !!elements.teamMemberSelect,
        isMyJobCheckbox: !!elements.isMyJobCheckbox,
        customerSelect: !!elements.customerSelect,
        hourCap: !!elements.hourCap,
        releaseMonth: !!elements.releaseMonth
    });

    initializeEventListeners();
    initializeDefaultValues();
});

function initializeDefaultValues() {
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('due-date').value = today;
    
    // Set default values for other fields
    document.getElementById('priority-number').value = '1';
    document.getElementById('priority-level').value = 'Medium';
    document.getElementById('enhancement-status').value = 'Not Started';
    
    // Set default month to current month
    const currentDate = new Date();
    const currentMonth = currentDate.toISOString().slice(0, 7);
    elements.releaseMonth.value = currentMonth;
    
    // Initialize calculations
    updateCalculations();
}

// Event Listeners
function initializeEventListeners() {
    // Add Enhancement button
    elements.addEnhancementBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Add Enhancement button clicked');
        showEnhancementOverlay();
    });

    // Close button
    elements.closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Close button clicked');
        hideEnhancementOverlay();
    });

    // Cancel button
    elements.cancelBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Cancel button clicked');
        hideEnhancementOverlay();
    });

    // Click outside overlay
    elements.overlay.addEventListener('click', (e) => {
        if (e.target === elements.overlay) {
            console.log('Clicked outside overlay content');
            hideEnhancementOverlay();
        }
    });

    // Team member selection
    elements.teamMemberSelect.addEventListener('change', (e) => {
        console.log('Team member changed:', e.target.value);
        elements.isMyJobCheckbox.checked = e.target.value === 'Marcus';
    });

    // Enhancement form submission
    elements.enhancementForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Form submitted');
        createEnhancementItem();
        hideEnhancementOverlay();
    });

    // Customer selection
    elements.customerSelect.addEventListener('change', (e) => {
        console.log('Customer changed:', e.target.value);
        state.customer.selected = e.target.value;
        state.customer.rates = customerRates[e.target.value];
        updateCalculations();
    });

    // Hour cap change
    elements.hourCap.addEventListener('change', (e) => {
        console.log('Hour cap changed:', e.target.value);
        state.release.hourCap = parseInt(e.target.value) || 40;
        updateCalculations();
    });

    // Release setup listeners
    elements.releaseName.addEventListener('input', (e) => {
        state.release.name = e.target.value;
    });
    
    elements.projectName.addEventListener('input', (e) => {
        state.release.project = e.target.value;
    });
    
    elements.releaseMonth.addEventListener('input', (e) => {
        state.release.month = e.target.value;
    });
    
    elements.releaseScope.addEventListener('input', (e) => {
        state.release.scope = e.target.value;
    });
    
    elements.startDate.addEventListener('input', (e) => {
        state.release.startDate = e.target.value;
    });
    
    elements.endDate.addEventListener('input', (e) => {
        state.release.endDate = e.target.value;
    });

    // Export PDF button
    document.getElementById('export-pdf').addEventListener('click', generateReleasePlan);
}

// Show overlay
function showEnhancementOverlay() {
    console.log('Showing overlay');
    elements.overlay.style.display = 'flex';
    requestAnimationFrame(() => {
        elements.overlay.classList.add('show');
    });
    elements.enhancementForm.reset();
    initializeDefaultValues();
}

// Hide overlay
function hideEnhancementOverlay() {
    console.log('Hiding overlay');
    elements.overlay.classList.remove('show');
    setTimeout(() => {
        elements.overlay.style.display = 'none';
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

    const enhancementHtml = `
        <div class="enhancement-item" data-hours="${formData.hours}" data-role="${formData.role}" data-is-my-job="${formData.isMyJob}">
            <div class="enhancement-header">
                <div class="enhancement-title">
                    <h3>${formData.name}</h3>
                    <span class="priority-badge ${formData.priorityLevel.toLowerCase()}">${formData.priorityLevel}</span>
                </div>
                <div class="enhancement-actions">
                    <button class="icon-button remove-enhancement">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="enhancement-content">
                <p class="enhancement-description">${formData.description}</p>
                <div class="enhancement-meta">
                    <span class="meta-item">
                        <i class="fas fa-briefcase"></i>
                        ${formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
                    </span>
                    <span class="meta-item">
                        <i class="fas fa-clock"></i>
                        ${formData.hours} hours
                    </span>
                    <span class="meta-item">
                        <i class="fas fa-user"></i>
                        ${formData.assignedTo}
                    </span>
                    <span class="meta-item">
                        <i class="fas fa-calendar"></i>
                        ${new Date(formData.dueDate).toLocaleDateString()}
                    </span>
                    <span class="meta-item status-badge ${formData.status.toLowerCase().replace(' ', '-')}">
                        ${formData.status}
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

// Update calculations
function updateCalculations() {
    const enhancementItems = document.querySelectorAll('.enhancement-item');
    let totalHours = 0;
    let totalCost = 0;
    let totalClientCharge = 0;
    let myRevenue = 0;

    enhancementItems.forEach(item => {
        const hours = parseFloat(item.dataset.hours) || 0;
        const isMyJob = item.dataset.isMyJob === 'true';
        const role = item.dataset.role;
        const rates = state.customer.rates;
        
        totalHours += hours;
        
        if (isMyJob) {
            totalCost += hours * rates[role].clientRate;
            totalClientCharge += hours * rates[role].clientRate;
            myRevenue += hours * rates[role].clientRate;
        } else {
            totalCost += hours * rates[role].devRate;
            totalClientCharge += hours * rates[role].clientRate;
        }
    });

    const profit = totalClientCharge - totalCost;
    const hourCap = parseInt(elements.hourCap.value) || 40;
    const availableHours = Math.max(0, hourCap - totalHours);

    // Update summary values
    document.getElementById('total-enhancements').textContent = enhancementItems.length;
    document.getElementById('total-hours').textContent = totalHours.toFixed(1);
    document.getElementById('total-cost').textContent = formatCurrency(totalCost);
    document.getElementById('hours-allocated').textContent = totalHours.toFixed(1);
    document.getElementById('available-hours').textContent = availableHours.toFixed(1);
    document.getElementById('total-client-charge').textContent = formatCurrency(totalClientCharge);
    document.getElementById('total-profit').textContent = formatCurrency(profit);
    document.getElementById('monthly-cost').textContent = formatCurrency(totalCost);
    document.getElementById('my-revenue').textContent = formatCurrency(myRevenue);

    // Update state
    state.release.totalHours = totalHours;
}

// Generate Release Plan
function generateReleasePlan() {
    const exportButton = document.getElementById('export-pdf');
    exportButton.innerHTML = '<span class="loading-spinner"></span>Generating PDF...';
    exportButton.disabled = true;

    // Collect all the data
    const planData = {
        project: {
            name: state.release.project,
            releaseMonth: state.release.month,
            hourCap: state.release.hourCap
        },
        customer: state.customer.selected,
        rates: {
            client: state.customer.rates.backend.clientRate,
            team: state.customer.rates.backend.devRate
        },
        enhancements: [],
        totals: {
            hours: state.release.totalHours,
            clientCharge: document.getElementById('total-client-charge').textContent,
            teamCost: document.getElementById('total-cost').textContent,
            profit: document.getElementById('total-profit').textContent
        }
    };

    // Collect enhancement data
    document.querySelectorAll('.enhancement-item').forEach(item => {
        planData.enhancements.push({
            title: item.querySelector('h3').textContent,
            priority: item.querySelector('.meta-item:first-child').textContent.replace('Priority ', ''),
            assignedTo: item.querySelector('.meta-item:nth-child(3)').textContent,
            hours: item.dataset.hours,
            status: item.querySelector('.status-badge').textContent,
            description: item.querySelector('.enhancement-description').textContent
        });
    });

    // Generate PDF content
    const pdfContent = generatePDFContent(planData);
    
    // Create PDF using html2pdf
    const element = document.createElement('div');
    element.innerHTML = pdfContent;
    
    const opt = {
        margin: 1,
        filename: `${planData.project.name}_Release_Plan.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Generate PDF
    html2pdf().set(opt).from(element).save().then(() => {
        exportButton.innerHTML = '<i class="fas fa-file-pdf"></i> Export as PDF';
        exportButton.disabled = false;
        
        // Show success message
        showNotification('PDF generated successfully!', 'success');
    });
}

// Generate PDF Content
function generatePDFContent(data) {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #0ea5e9; text-align: center; margin-bottom: 30px;">
                ${data.project.name} - Release Plan
            </h1>
            
            <div style="margin-bottom: 30px;">
                <h2 style="color: #0f172a;">Project Details</h2>
                <p><strong>Release Month:</strong> ${data.project.releaseMonth}</p>
                <p><strong>Hour Cap:</strong> ${data.project.hourCap} hours</p>
                <p><strong>Customer:</strong> ${data.customer}</p>
            </div>
            
            <div style="margin-bottom: 30px;">
                <h2 style="color: #0f172a;">Enhancements</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: #f1f5f9;">
                            <th style="padding: 10px; border: 1px solid #e2e8f0;">Priority</th>
                            <th style="padding: 10px; border: 1px solid #e2e8f0;">Title</th>
                            <th style="padding: 10px; border: 1px solid #e2e8f0;">Assigned To</th>
                            <th style="padding: 10px; border: 1px solid #e2e8f0;">Hours</th>
                            <th style="padding: 10px; border: 1px solid #e2e8f0;">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.enhancements.map(enhancement => `
                            <tr>
                                <td style="padding: 10px; border: 1px solid #e2e8f0;">${enhancement.priority}</td>
                                <td style="padding: 10px; border: 1px solid #e2e8f0;">${enhancement.title}</td>
                                <td style="padding: 10px; border: 1px solid #e2e8f0;">${enhancement.assignedTo}</td>
                                <td style="padding: 10px; border: 1px solid #e2e8f0;">${enhancement.hours}</td>
                                <td style="padding: 10px; border: 1px solid #e2e8f0;">${enhancement.status}</td>
                            </tr>
                            ${enhancement.description ? `
                                <tr>
                                    <td colspan="5" style="padding: 10px; border: 1px solid #e2e8f0; background-color: #f8fafc;">
                                        <strong>Description:</strong><br>${enhancement.description}
                                    </td>
                                </tr>
                            ` : ''}
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <div style="margin-bottom: 30px;">
                <h2 style="color: #0f172a;">Summary</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 10px; border: 1px solid #e2e8f0;"><strong>Total Hours:</strong></td>
                        <td style="padding: 10px; border: 1px solid #e2e8f0;">${data.totals.hours}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #e2e8f0;"><strong>Client Charges:</strong></td>
                        <td style="padding: 10px; border: 1px solid #e2e8f0;">${data.totals.clientCharge}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #e2e8f0;"><strong>Team Costs:</strong></td>
                        <td style="padding: 10px; border: 1px solid #e2e8f0;">${data.totals.teamCost}</td>
                    </tr>
                    <tr style="background-color: #f0fdf4;">
                        <td style="padding: 10px; border: 1px solid #e2e8f0;"><strong>Total Profit:</strong></td>
                        <td style="padding: 10px; border: 1px solid #e2e8f0;">${data.totals.profit}</td>
                    </tr>
                </table>
            </div>
            
            <div style="margin-top: 50px; border-top: 2px solid #e2e8f0; padding-top: 20px;">
                <div style="display: flex; justify-content: space-between;">
                    <div style="flex: 1;">
                        <p><strong>Client Approval:</strong> _____________________</p>
                        <p><strong>Date:</strong> _____________________</p>
                    </div>
                    <div style="flex: 1;">
                        <p><strong>Project Manager:</strong> _____________________</p>
                        <p><strong>Date:</strong> _____________________</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Show Notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Fade in
    requestAnimationFrame(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    });
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
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

// Create enhancement section header
const enhancementSection = document.querySelector('.section');
const header = document.createElement('div');
header.className = 'enhancement-header';

const title = document.createElement('h2');
title.className = 'enhancement-title';
title.textContent = 'Enhancement Items';

const actions = document.createElement('div');
actions.className = 'enhancement-actions';

// Create enhanced add button
const addButton = document.createElement('button');
addButton.id = 'add-enhancement';
addButton.className = 'add-enhancement-button';
addButton.innerHTML = '<i class="fas fa-plus-circle icon"></i>Add Enhancement';

// Add click animation
addButton.addEventListener('click', (e) => {
    e.preventDefault();
    addButton.classList.add('clicked');
    setTimeout(() => addButton.classList.remove('clicked'), 300);
    createEnhancementItem();
});

// Add hover effect for icon
addButton.addEventListener('mouseover', () => {
    const icon = addButton.querySelector('.icon');
    icon.style.transform = 'rotate(90deg)';
});

addButton.addEventListener('mouseout', () => {
    const icon = addButton.querySelector('.icon');
    icon.style.transform = 'rotate(0deg)';
});

// Create export button
const exportButton = document.createElement('button');
exportButton.id = 'export-pdf';
exportButton.className = 'action-button export-button';
exportButton.innerHTML = '<i class="fas fa-file-pdf icon"></i>Export as PDF';
exportButton.onclick = generateReleasePlan;

// Assemble the header
actions.appendChild(addButton);
actions.appendChild(exportButton);
header.appendChild(title);
header.appendChild(actions);

// Insert the new header at the top of the enhancement section
enhancementSection.insertBefore(header, enhancementSection.firstChild);

// Load Font Awesome
const fontAwesome = document.createElement('link');
fontAwesome.rel = 'stylesheet';
fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
document.head.appendChild(fontAwesome);

// Load html2pdf
const html2pdfScript = document.createElement('script');
html2pdfScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
document.body.appendChild(html2pdfScript); 