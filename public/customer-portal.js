// Project Data
const projectsData = {
    'patient-portal': {
        id: 'patient-portal',
        title: 'Patient Portal CRM',
        status: 'in-progress',
        phase: 'Build Phase',
        progress: 65,
        dueDate: 'May 12, 2025',
        team: 'Development',
        completedTasks: [
            { name: 'Initial Design Mockups', date: 'Mar 1, 2025' },
            { name: 'Database Schema', date: 'Mar 5, 2025' },
            { name: 'API Documentation', date: 'Mar 10, 2025' }
        ],
        inProgressTasks: [
            { name: 'Frontend Development', progress: 75 },
            { name: 'API Integration', progress: 40 }
        ],
        upcomingTasks: [
            { name: 'User Testing', date: 'Apr 1, 2025' },
            { name: 'Security Audit', date: 'Apr 10, 2025' },
            { name: 'Deployment', date: 'Apr 15, 2025' }
        ],
        updates: [
            {
                author: 'Marcus Norman',
                time: '2 hours ago',
                content: 'Frontend development is progressing well. We\'ve completed the main dashboard components and are now working on the patient management interface. The team has implemented all requested UI changes and is now focusing on responsive design improvements.'
            },
            {
                author: 'Jonas Pascua',
                time: '1 day ago',
                content: 'API integration has started. Currently implementing the authentication endpoints and data validation. We\'ve completed the core API structure and are now working on optimizing database queries for better performance.'
            },
            {
                author: 'Dez Grayson',
                time: '2 days ago',
                content: 'UAT testing complete. All core functionality meets requirements and workflow aligns with our needs. Signed off on current phase - Dez'
            }
        ]
    },
    'scheduling-tool': {
        id: 'scheduling-tool',
        title: 'Scheduling Tool',
        status: 'complete',
        phase: 'Done',
        progress: 100,
        dueDate: 'Completed Mar 15',
        team: 'Development',
        completedTasks: [
            { name: 'Requirements Gathering', date: 'Jan 15, 2025' },
            { name: 'UI/UX Design', date: 'Jan 30, 2025' },
            { name: 'Development', date: 'Feb 28, 2025' },
            { name: 'Testing', date: 'Mar 10, 2025' },
            { name: 'Deployment', date: 'Mar 15, 2025' }
        ],
        inProgressTasks: [],
        upcomingTasks: [],
        updates: [
            {
                author: 'Project Manager',
                time: '5 days ago',
                content: 'Project successfully completed and deployed. All features are working as expected. Client has signed off on the deliverables.'
            },
            {
                author: 'QA Team',
                time: '7 days ago',
                content: 'Final testing completed. All test cases passed. No critical issues found.'
            }
        ]
    },
    'internal-dashboard': {
        id: 'internal-dashboard',
        title: 'Internal Dashboard',
        status: 'review',
        phase: 'UAT Phase',
        progress: 85,
        dueDate: 'Apr 4, 2025',
        team: 'Development',
        completedTasks: [
            { name: 'Design Phase', date: 'Feb 15, 2025' },
            { name: 'Core Development', date: 'Mar 1, 2025' },
            { name: 'Initial Testing', date: 'Mar 15, 2025' }
        ],
        inProgressTasks: [
            { name: 'User Acceptance Testing', progress: 60 },
            { name: 'Documentation', progress: 80 }
        ],
        upcomingTasks: [
            { name: 'Final Review', date: 'Mar 30, 2025' },
            { name: 'Deployment', date: 'Apr 4, 2025' }
        ],
        updates: [
            {
                author: 'Test Lead',
                time: '1 day ago',
                content: 'UAT is progressing well. Users have reported minor UI improvements needed.'
            },
            {
                author: 'Tech Writer',
                time: '2 days ago',
                content: 'Documentation is nearly complete. Adding final screenshots and user guides.'
            }
        ]
    },
    'crm-dashboards': {
        id: 'crm-dashboards',
        title: 'Clinovators CRM Dashboards',
        status: 'in-progress',
        phase: 'Development Phase',
        progress: 45,
        dueDate: 'Jun 30, 2025',
        team: 'Development',
        completedTasks: [
            { name: 'Requirements Analysis', date: 'Mar 1, 2025' },
            { name: 'Data Model Design', date: 'Mar 15, 2025' },
            { name: 'UI/UX Mockups', date: 'Mar 30, 2025' }
        ],
        inProgressTasks: [
            { name: 'Dashboard Development', progress: 60 },
            { name: 'Data Integration', progress: 35 },
            { name: 'Release Planning', progress: 40 }
        ],
        upcomingTasks: [
            { name: 'User Testing', date: 'May 15, 2025' },
            { name: 'Performance Optimization', date: 'Jun 1, 2025' },
            { name: 'Final Deployment', date: 'Jun 30, 2025' }
        ],
        updates: [
            {
                author: 'Marcus Norman',
                time: '1 day ago',
                content: 'Dashboard development is progressing well. Core visualizations are implemented and we\'re now working on interactive filters and drill-down capabilities.'
            },
            {
                author: 'Jonas Pascua',
                time: '3 days ago',
                content: 'Data integration framework is set up. Currently working on real-time data synchronization and implementing caching mechanisms for better performance.'
            },
            {
                author: 'AJ Moore Jr.',
                time: '5 days ago',
                content: 'Release plan draft completed. Timeline and milestones have been defined, awaiting stakeholder review.'
            }
        ]
    },
    'rfp-pricing-tool': {
        id: 'rfp-pricing-tool',
        title: 'RFP Pricing Tool',
        status: 'review',
        phase: 'Testing Phase',
        progress: 75,
        dueDate: 'May 15, 2025',
        team: 'Development',
        completedTasks: [
            { name: 'Requirements Gathering', date: 'Feb 1, 2025' },
            { name: 'Architecture Design', date: 'Feb 15, 2025' },
            { name: 'Core Development', date: 'Mar 20, 2025' }
        ],
        inProgressTasks: [
            { name: 'Integration Testing', progress: 80 },
            { name: 'User Documentation', progress: 65 }
        ],
        upcomingTasks: [
            { name: 'UAT Testing', date: 'Apr 30, 2025' },
            { name: 'Performance Testing', date: 'May 5, 2025' },
            { name: 'Production Release', date: 'May 15, 2025' }
        ],
        updates: [
            {
                author: 'Jonas Pascua',
                time: '6 hours ago',
                content: 'Integration testing is nearly complete. All core pricing calculations are working correctly and API endpoints are properly handling all test cases.'
            },
            {
                author: 'AJ Moore Jr.',
                time: '2 days ago',
                content: 'User documentation is progressing well. Added detailed guides for pricing configuration and RFP response generation.'
            },
            {
                author: 'Marcus Norman',
                time: '4 days ago',
                content: 'Core development completed. All planned features have been implemented and initial testing shows positive results.'
            }
        ]
    }
};

// Task Details Data
const taskDetails = {
    // Patient Portal CRM Tasks
    'Initial Design Mockups': {
        description: 'Create comprehensive design mockups for the patient portal interface, including mobile and desktop versions.',
        assignee: 'Sarah Johnson',
        requirements: [
            'User dashboard layout',
            'Patient information forms',
            'Appointment scheduling interface',
            'Responsive design for all screen sizes',
            'Color scheme and typography guidelines'
        ]
    },
    'Database Schema': {
        description: 'Design and implement the database schema for the patient portal system.',
        assignee: 'Lisa Park',
        requirements: [
            'Patient records structure',
            'Appointment management tables',
            'User authentication system',
            'Audit logging framework',
            'Data relationships and indexes'
        ]
    },
    'API Documentation': {
        description: 'Create comprehensive API documentation for all endpoints and data models.',
        assignee: 'Mike Chen',
        requirements: [
            'Authentication endpoints',
            'Patient data endpoints',
            'Appointment management APIs',
            'Error handling documentation',
            'API versioning strategy'
        ]
    },
    'Frontend Development': {
        description: 'Implement the frontend components and user interface based on approved design mockups.',
        assignee: 'Marcus Norman',
        requirements: [
            'Implement responsive layouts',
            'Create reusable UI components',
            'Integrate with backend APIs',
            'Implement form validation',
            'Optimize performance'
        ]
    },
    'API Integration': {
        description: 'Connect frontend components with backend services and ensure proper data flow.',
        assignee: 'Mike Chen',
        requirements: [
            'Authentication integration',
            'Real-time data updates',
            'Error handling',
            'API documentation',
            'Performance optimization'
        ]
    },
    'User Testing': {
        description: 'Conduct comprehensive user testing to ensure functionality and usability.',
        assignee: 'Lisa Park',
        requirements: [
            'Create test scenarios',
            'Conduct user interviews',
            'Document feedback',
            'Identify usability issues',
            'Propose improvements'
        ]
    },
    'Security Audit': {
        description: 'Perform a thorough security audit of the entire system.',
        assignee: 'AJ Moore Jr.',
        requirements: [
            'Vulnerability assessment',
            'Authentication security',
            'Data encryption review',
            'API security testing',
            'Compliance verification'
        ]
    },
    'Deployment': {
        description: 'Plan and execute the deployment of the patient portal system.',
        assignee: 'Marcus Norman',
        requirements: [
            'Server configuration',
            'Database migration',
            'SSL certificate setup',
            'Monitoring configuration',
            'Backup system setup'
        ]
    },
    // Add more task details as needed
};

// DOM Elements
const loginSection = document.getElementById('login-section');
const customerPortalSection = document.getElementById('customer-portal-section');
const projectDetailsSection = document.getElementById('project-details');
const authForm = document.querySelector('.auth-form');
const viewButtons = document.querySelectorAll('.view-button');
const backButton = document.querySelector('.back-button');
const messageBox = document.querySelector('.message-box textarea');
const newProjectButton = document.querySelector('.action-button.primary');
const newProjectOverlay = document.getElementById('new-project-overlay');

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Auth form submit
    if (authForm) {
        authForm.addEventListener('submit', handleLogin);
    }

    // View buttons click
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const projectCard = this.closest('.project-card');
            if (projectCard) {
                const projectId = projectCard.dataset.projectId;
                showProjectDetails(projectId);
            }
        });
    });

    // New Project button click
    const newProjectBtn = document.querySelector('.section-actions .action-button.primary');
    if (newProjectBtn) {
        newProjectBtn.addEventListener('click', function() {
            showNewProjectOverlay();
        });
    }

    // Task click handlers
    attachTaskClickHandlers();

    // Form submit handler
    const newProjectForm = document.getElementById('new-project-form');
    if (newProjectForm) {
        newProjectForm.addEventListener('submit', handleNewProjectSubmit);
    }
});

// Handle Login
function handleLogin(e) {
    e.preventDefault();
    loginSection.style.display = 'none';
    customerPortalSection.style.display = 'block';
}

// Show Project Details
function showProjectDetails(projectId) {
    const project = projectsData[projectId];
    if (!project) return;

    // Update project details content
    updateProjectHeader(project);
    updateTaskLists(project);
    updateUpdates(project);

    // Show details section
    customerPortalSection.style.display = 'none';
    projectDetailsSection.style.display = 'block';

    // Add a small delay to ensure the section is visible before scrolling
    setTimeout(() => {
        const projectHeader = document.querySelector('.details-header');
        if (projectHeader) {
            projectHeader.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }, 100);
}

// Update Project Header
function updateProjectHeader(project) {
    const header = projectDetailsSection.querySelector('.details-header');
    header.querySelector('.project-title h1').textContent = project.title;
    header.querySelector('.status-badge').className = `status-badge ${project.status}`;
    header.querySelector('.status-badge').textContent = project.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    const metaItems = header.querySelectorAll('.meta-item');
    metaItems[0].querySelector('i + span, i').textContent = project.dueDate;
    metaItems[1].querySelector('i + span, i').textContent = `Team: ${project.team}`;
    metaItems[2].querySelector('i + span, i').textContent = `${project.progress}% Complete`;
}

// Update Task Lists
function updateTaskLists(project) {
    // Update Completed Tasks
    const completedList = projectDetailsSection.querySelector('.details-card:nth-child(1) .task-list');
    completedList.innerHTML = project.completedTasks.map(task => `
        <li class="task-item complete">
            <span>${task.name}</span>
            <span class="task-date">${task.date}</span>
        </li>
    `).join('');

    // Update In Progress Tasks
    const inProgressList = projectDetailsSection.querySelector('.details-card:nth-child(2) .task-list');
    inProgressList.innerHTML = project.inProgressTasks.map(task => `
        <li class="task-item current">
            <div>
                <span>${task.name}</span>
                <div class="task-progress">
                    <div class="progress-bar">
                        <div class="progress" style="width: ${task.progress}%"></div>
                    </div>
                    <span>${task.progress}%</span>
                </div>
            </div>
        </li>
    `).join('');

    // Update Upcoming Tasks
    const upcomingList = projectDetailsSection.querySelector('.details-card:nth-child(3) .task-list');
    upcomingList.innerHTML = project.upcomingTasks.map(task => `
        <li class="task-item upcoming">
            <span>${task.name}</span>
            <span class="task-date">${task.date}</span>
        </li>
    `).join('');

    // Add click handlers to all task items after updating the lists
    attachTaskClickHandlers();
}

// Function to attach click handlers to task items
function attachTaskClickHandlers() {
    const taskItems = document.querySelectorAll('.task-item');
    taskItems.forEach(task => {
        task.addEventListener('click', function() {
            const taskName = this.querySelector('span:first-child').textContent;
            const taskDate = this.querySelector('.task-date')?.textContent;
            const taskProgress = this.querySelector('.task-progress .progress')?.style.width;
            
            let status;
            if (this.classList.contains('complete')) {
                status = 'Complete';
            } else if (this.classList.contains('current')) {
                status = 'In Progress';
            } else if (this.classList.contains('upcoming')) {
                status = 'Upcoming';
            }
            
            showTaskOverlay(taskName, taskDate, status, taskProgress);
        });
    });
}

// Update Updates List
function updateUpdates(project) {
    const updatesList = projectDetailsSection.querySelector('.update-list');
    updatesList.innerHTML = project.updates.map(update => `
        <div class="update-item">
            <div class="update-header">
                <span class="update-author">${update.author}</span>
                <span class="update-date">${update.time}</span>
            </div>
            <p class="update-content">${update.content}</p>
        </div>
    `).join('');
}

// Show Customer Portal
function showCustomerPortal() {
    // Add a small delay to ensure smooth transition
    setTimeout(() => {
        projectDetailsSection.style.display = 'none';
        customerPortalSection.style.display = 'block';
        
        // Scroll to the projects section
        const projectsSection = document.querySelector('.page-header');
        if (projectsSection) {
            projectsSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }, 100);
}

// Smooth Progress Bar Animation
document.querySelectorAll('.progress').forEach(progress => {
    const width = progress.style.width;
    progress.style.width = '0';
    setTimeout(() => {
        progress.style.width = width;
    }, 100);
});

// Project Card Hover Effect
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-4px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Add smooth transitions for all interactive elements
document.querySelectorAll('button, input, textarea').forEach(element => {
    element.style.transition = 'all 0.2s ease';
});

// Initialize any tooltips or popovers
document.querySelectorAll('[data-tooltip]').forEach(element => {
    element.addEventListener('mouseenter', showTooltip);
    element.addEventListener('mouseleave', hideTooltip);
});

function showTooltip(e) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = this.dataset.tooltip;
    document.body.appendChild(tooltip);
    
    const rect = this.getBoundingClientRect();
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
    tooltip.style.left = rect.left + (rect.width - tooltip.offsetWidth) / 2 + 'px';
    
    setTimeout(() => tooltip.classList.add('show'), 10);
}

function hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// Add loading states for buttons
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function(e) {
        if (this.dataset.loading) {
            e.preventDefault();
            this.classList.add('loading');
            this.disabled = true;
            
            // Simulate loading
            setTimeout(() => {
                this.classList.remove('loading');
                this.disabled = false;
            }, 1000);
        }
    });
});

// Task Overlay Functions
function showTaskDetails(taskId) {
    const task = taskDetails[taskId];
    if (!task) return;

    const overlay = document.getElementById('task-overlay');
    
    // Update overlay content
    document.getElementById('task-title').textContent = task.title;
    document.getElementById('task-date').textContent = task.date;
    document.getElementById('task-assignee').textContent = task.assignee;
    document.getElementById('task-status').textContent = task.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    document.getElementById('task-status').className = `status-badge ${task.status}`;
    document.getElementById('task-description').textContent = task.description;
    
    // Update requirements list
    const requirementsList = document.getElementById('task-requirements');
    requirementsList.innerHTML = task.requirements.map(req => `
        <li>
            <i class="fas fa-check-circle"></i>
            ${req}
        </li>
    `).join('');

    // Show overlay with animation
    overlay.style.display = 'flex';
    setTimeout(() => overlay.classList.add('show'), 10);

    // Add click outside to close
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeTaskOverlay();
        }
    });

    // Add escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeTaskOverlay();
        }
    });
}

function closeTaskOverlay() {
    const overlay = document.getElementById('task-overlay');
    overlay.classList.remove('show');
    setTimeout(() => overlay.style.display = 'none', 300);
}

function showTaskOverlay(taskName, date, status, progress) {
    const taskOverlay = document.getElementById('task-overlay');
    const details = taskDetails[taskName] || {
        description: 'Task details will be added soon.',
        assignee: 'Development Team',
        requirements: ['Requirements to be defined']
    };

    // Update overlay content
    document.getElementById('task-title').textContent = taskName;
    document.getElementById('task-date').textContent = date || 'Date TBD';
    document.getElementById('task-assignee').textContent = details.assignee;
    
    const statusElement = document.getElementById('task-status');
    statusElement.textContent = status;
    statusElement.className = `status-badge ${status.toLowerCase().replace(' ', '-')}`;
    
    document.getElementById('task-description').textContent = details.description;

    // Update requirements list
    const requirementsList = document.getElementById('task-requirements');
    requirementsList.innerHTML = details.requirements.map(req => `
        <li>
            <i class="fas fa-check-circle"></i>
            ${req}
        </li>
    `).join('');

    // Show overlay with animation
    taskOverlay.style.display = 'flex';
    setTimeout(() => {
        taskOverlay.classList.add('show');
    }, 10);
}

function showNewProjectOverlay() {
    if (!newProjectOverlay) return;
    
    newProjectOverlay.style.display = 'flex';
    setTimeout(() => {
        newProjectOverlay.classList.add('show');
    }, 10);

    // Set minimum dates for date inputs
    const today = new Date().toISOString().split('T')[0];
    const startDateInput = document.getElementById('desired-start-date');
    const completionDateInput = document.getElementById('target-completion');
    
    if (startDateInput) startDateInput.min = today;
    if (completionDateInput) completionDateInput.min = today;
}

function closeNewProjectOverlay() {
    if (!newProjectOverlay) return;
    
    newProjectOverlay.classList.remove('show');
    setTimeout(() => {
        newProjectOverlay.style.display = 'none';
    }, 300);
}

function handleNewProjectSubmit(e) {
    e.preventDefault();
    
    // Show success message
    const form = e.target;
    const originalFormHTML = form.innerHTML;
    
    form.innerHTML = `
        <div class="success-message">
            <div class="success-content">
                <i class="fas fa-check-circle"></i>
                <h3>Project Request Submitted</h3>
                <p>Thank you for your submission. We'll review your request and get back to you soon.</p>
            </div>
        </div>
    `;
    
    // Close overlay after delay
    setTimeout(() => {
        closeNewProjectOverlay();
        // Reset form after closing
        setTimeout(() => {
            form.innerHTML = originalFormHTML;
            form.reset();
        }, 500);
    }, 2000);
}

// Close overlays when clicking outside
document.addEventListener('click', function(e) {
    const taskOverlay = document.getElementById('task-overlay');
    const newProjectOverlay = document.getElementById('new-project-overlay');
    
    if (e.target === taskOverlay) {
        closeTaskOverlay();
    } else if (e.target === newProjectOverlay) {
        closeNewProjectOverlay();
    }
}); 