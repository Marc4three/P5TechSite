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
    release: {
        projectName: '',
        releaseMonth: '',
        hourCap: 40,
        totalHours: 0
    },
    customer: {
        selected: 'clinovators',
        rates: {
            clinovators: {
                clientRate: 60,
                teamRate: 50
            },
            custom: {
                clientRate: 0,
                teamRate: 0
            }
        }
    },
    enhancements: [],
    hoursTracking: {
        allocated: 0,
        available: 40,
        cost: 0
    },
    clientApproval: {
        notes: '',
        approved: false,
        approvalDate: null
    }
};

// Update rates based on customer selection
function updateCustomerRates() {
    const customerSelect = document.getElementById('customer-select');
    state.customer.selected = customerSelect.value;
    
    if (state.customer.selected === 'custom') {
        document.getElementById('custom-rates').style.display = 'block';
    } else {
        document.getElementById('custom-rates').style.display = 'none';
    }
    
    updateCalculations();
}

// Role Management
function createRoleCard(role = null) {
    const roleCard = document.createElement('div');
    roleCard.className = 'role-card';
    
    const roleData = role || {
        selectedRoles: [],
        teamMember: '',
        hours: 0,
        isMyRole: false
    };

    roleCard.innerHTML = `
        <div class="role-inputs">
            <div class="input-group">
                <label>Team Member</label>
                <select class="team-member-select">
                    <option value="">Select Team Member</option>
                    <option value="AJ" ${roleData.teamMember === 'AJ' ? 'selected' : ''}>AJ</option>
                    <option value="Jonas" ${roleData.teamMember === 'Jonas' ? 'selected' : ''}>Jonas</option>
                    <option value="Luis" ${roleData.teamMember === 'Luis' ? 'selected' : ''}>Luis</option>
                    <option value="Marcus" ${roleData.teamMember === 'Marcus' ? 'selected' : ''}>Marcus</option>
                </select>
            </div>
            <div class="input-group">
                <label>Team Member Role</label>
                <select class="role-select" multiple>
                    <option value="backend">Backend Development</option>
                    <option value="frontend">Frontend Development</option>
                    <option value="ui">UI/UX Design</option>
                    <option value="pm">Project Management</option>
                    <option value="devops">Architecture/DevOps</option>
                    <option value="qa">QA/Testing</option>
                    <option value="support">Customer Support/Training</option>
                </select>
                <small class="helper-text">Hold Ctrl/Cmd to select multiple roles</small>
            </div>
            <div class="rate-details"></div>
            <div class="input-group">
                <label>Hours</label>
                <input type="number" class="role-hours" value="${roleData.hours}" min="0">
            </div>
        </div>
        <div class="role-toggle">
            <label class="toggle">
                <input type="checkbox" class="my-role" ${roleData.isMyRole ? 'checked' : ''}>
                <span class="toggle-slider"></span>
                My Role
            </label>
            <span class="role-total">$0</span>
        </div>
    `;

    // Event Listeners
    roleCard.querySelector('.team-member-select').addEventListener('change', (e) => {
        const teamMember = e.target.value;
        roleData.teamMember = teamMember;
        updateCalculations();
    });

    roleCard.querySelector('.role-select').addEventListener('change', (e) => {
        updateRateDetails(roleCard);
        updateCalculations();
    });

    roleCard.querySelector('.role-hours').addEventListener('input', updateCalculations);
    roleCard.querySelector('.my-role').addEventListener('change', updateCalculations);

    roleCard.querySelector('.remove-role')?.addEventListener('click', () => {
        roleCard.remove();
        updateCalculations();
    });

    return roleCard;
}

function updateRateDetails(roleCard) {
    const selectedRoles = Array.from(roleCard.querySelector('.role-select').selectedOptions)
        .map(option => option.value);
    const customer = document.getElementById('customer-select').value;
    const rates = customerRates[customer];
    const rateDetailsDiv = roleCard.querySelector('.rate-details');

    rateDetailsDiv.innerHTML = selectedRoles.map(role => {
        const roleRates = rates[role];
        if (roleRates.clientRate !== undefined) {
            return `
                <div class="rate-group">
                    <h4>${role.charAt(0).toUpperCase() + role.slice(1)} Rates</h4>
                    <div class="input-group">
                        <label>Client Rate ($)</label>
                        <input type="number" class="client-rate" value="${roleRates.clientRate}" min="0" data-role="${role}">
                    </div>
                    <div class="input-group">
                        <label>Developer Rate ($)</label>
                        <input type="number" class="dev-rate" value="${roleRates.devRate}" min="0" data-role="${role}">
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="rate-group">
                    <h4>${role.charAt(0).toUpperCase() + role.slice(1)} Rate</h4>
                    <div class="input-group">
                        <label>Hourly Rate ($)</label>
                        <input type="number" class="rate" value="${roleRates.rate}" min="0" data-role="${role}">
                    </div>
                </div>
            `;
        }
    }).join('');

    // Add event listeners to new rate inputs
    rateDetailsDiv.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', updateCalculations);
    });
}

// Enhanced Enhancement Creation
function createEnhancementItem() {
    const enhancementList = document.getElementById('enhancement-list');
    const enhancementItem = document.createElement('div');
    enhancementItem.className = 'task-item';
    enhancementItem.style.opacity = '0';
    enhancementItem.style.transform = 'translateY(20px)';
    
    // Add a ripple effect to the add button
    const addButton = document.getElementById('add-enhancement');
    addButton.classList.add('clicked');
    setTimeout(() => addButton.classList.remove('clicked'), 300);
    
    enhancementItem.innerHTML = `
        <div class="task-header">
            <input type="text" class="task-title" placeholder="Enhancement Title">
            <input type="number" class="task-priority-number" value="${state.enhancements.length + 1}" readonly>
            <select class="team-member-select">
                <option value="">Select Team Member</option>
                <option value="Marcus">Marcus</option>
                <option value="Team Member 1">Team Member 1</option>
                <option value="Team Member 2">Team Member 2</option>
            </select>
            <input type="number" class="task-hours" placeholder="Hours" min="0">
            <select class="task-status">
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
            </select>
        </div>
        <div class="task-details">
            <textarea class="task-description" placeholder="Enhancement description..."></textarea>
        </div>
        <button class="button danger-button remove-enhancement" onclick="removeEnhancement(this)">
            <i class="fas fa-trash"></i> Remove Enhancement
        </button>
    `;
    
    enhancementList.appendChild(enhancementItem);
    
    // Enhanced fade in animation with bounce
    requestAnimationFrame(() => {
        enhancementItem.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        enhancementItem.style.opacity = '1';
        enhancementItem.style.transform = 'translateY(0)';
    });
    
    // Add event listeners
    const inputs = enhancementItem.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('change', updateCalculations);
        input.addEventListener('input', updateCalculations);
    });
    
    updateCalculations();
}

function removeEnhancement(button) {
    const enhancementItem = button.closest('.task-item');
    enhancementItem.style.opacity = '0';
    enhancementItem.style.transform = 'translateY(10px)';
    enhancementItem.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
    
    setTimeout(() => {
        enhancementItem.remove();
        updateCalculations();
    }, 300);
}

// Calculations
function updateCalculations() {
    let totalHours = 0;
    let totalClientCharge = 0;
    let totalTeamCost = 0;
    let marcusProfit = 0;
    const clientRate = state.customer.rates[state.customer.selected].clientRate;
    const teamRate = state.customer.rates[state.customer.selected].teamRate;
    const profitPerTeamHour = clientRate - teamRate;

    document.querySelectorAll('.task-item').forEach(item => {
        const hours = Number(item.querySelector('.task-hours').value) || 0;
        const assignedTo = item.querySelector('.team-member-select').value;
        
        totalHours += hours;
        totalClientCharge += hours * clientRate;
        
        if (assignedTo === 'Marcus') {
            totalTeamCost += hours * teamRate;
            marcusProfit += hours * clientRate;
        } else {
            totalTeamCost += hours * teamRate;
            marcusProfit += hours * profitPerTeamHour;
        }
    });

    // Update state
    state.release.totalHours = totalHours;
    state.hoursTracking.allocated = totalHours;
    state.hoursTracking.cost = totalClientCharge;
    state.hoursTracking.available = state.release.hourCap - totalHours;

    // Update display with animations
    animateValue('total-hours', totalHours);
    animateValue('hours-allocated', totalHours);
    animateValue('monthly-cost', totalClientCharge, true);
    animateValue('available-hours', state.hoursTracking.available);
    
    // Update cost tracking display
    animateValue('total-client-charge', totalClientCharge, true);
    animateValue('total-team-cost', totalTeamCost, true);
    animateValue('total-profit', marcusProfit, true);

    // Update hours bar with smooth animation
    const hoursPercentage = (totalHours / state.release.hourCap) * 100;
    const hoursBar = document.getElementById('hours-bar');
    hoursBar.style.width = `${Math.min(100, hoursPercentage)}%`;
    
    if (totalHours > state.release.hourCap) {
        hoursBar.classList.add('warning');
        document.getElementById('available-hours').classList.add('warning');
    } else {
        hoursBar.classList.remove('warning');
        document.getElementById('available-hours').classList.remove('warning');
    }
}

// Smooth number animations
function animateValue(elementId, value, isCurrency = false) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const start = Number(element.textContent.replace(/[^0-9.-]+/g, '')) || 0;
    const duration = 500;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuad = 1 - (1 - progress) * (1 - progress);
        const current = start + (value - start) * easeOutQuad;
        
        element.textContent = isCurrency ? formatCurrency(current) : Math.round(current);
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Utility Functions
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
};

const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long'
    }).format(new Date(date));
};

// Event Listeners
function initializeEventListeners() {
    // Customer selection
    document.getElementById('customer-select').addEventListener('change', updateCustomerRates);

    // Release setup listeners
    document.getElementById('release-name').addEventListener('input', () => state.release.name = this.value);
    document.getElementById('project-name').addEventListener('input', () => state.release.project = this.value);
    document.getElementById('release-month').addEventListener('input', () => state.release.month = this.value);
    document.getElementById('release-scope').addEventListener('input', () => state.release.scope = this.value);
    document.getElementById('start-date').addEventListener('input', () => state.release.startDate = this.value);
    document.getElementById('end-date').addEventListener('input', () => state.release.endDate = this.value);
    document.getElementById('hour-cap').addEventListener('input', (e) => {
        state.release.hourCap = Number(e.target.value);
        updateCalculations();
    });

    // Add enhancement button
    document.getElementById('add-enhancement').addEventListener('click', createEnhancementItem);

    // Client approval
    document.getElementById('client-approval').addEventListener('change', (e) => {
        state.clientApproval.approved = e.target.checked;
        if (e.target.checked) {
            state.clientApproval.approvalDate = new Date();
            document.getElementById('approval-date').textContent = formatDate(state.clientApproval.approvalDate);
        } else {
            state.clientApproval.approvalDate = null;
            document.getElementById('approval-date').textContent = '';
        }
    });

    // Generate plan
    document.getElementById('generate-plan').addEventListener('click', generateReleasePlan);

    // Rate inputs
    document.getElementById('client-rate').addEventListener('input', updateCalculations);
    document.getElementById('team-rate').addEventListener('input', updateCalculations);
}

// Generate Release Plan
function generateReleasePlan() {
    const exportButton = document.getElementById('export-pdf');
    exportButton.innerHTML = '<span class="loading-spinner"></span>Generating PDF...';
    exportButton.disabled = true;

    // Collect all the data
    const planData = {
        project: {
            name: document.getElementById('project-name').value,
            releaseMonth: document.getElementById('release-month').value,
            hourCap: state.release.hourCap
        },
        customer: state.customer.selected,
        rates: {
            client: state.customer.rates[state.customer.selected].clientRate,
            team: state.customer.rates[state.customer.selected].teamRate
        },
        enhancements: [],
        totals: {
            hours: state.release.totalHours,
            clientCharge: state.hoursTracking.cost,
            teamCost: document.getElementById('total-team-cost').textContent,
            profit: document.getElementById('total-profit').textContent
        }
    };

    // Collect enhancement data
    document.querySelectorAll('.task-item').forEach(item => {
        planData.enhancements.push({
            title: item.querySelector('.task-title').value,
            priority: item.querySelector('.task-priority-number').value,
            assignedTo: item.querySelector('.team-member-select').value,
            hours: item.querySelector('.task-hours').value,
            status: item.querySelector('.task-status').value,
            description: item.querySelector('.task-description').value
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

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    updateCustomerRates(); // Set initial rates
    updateCalculations(); // Initial calculations
    
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
}); 