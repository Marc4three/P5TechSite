// Project Data
window.projectsData = {
    'patient-portal': {
        id: 'patient-portal',
        title: 'Patient Portal Enhancement',
        status: 'pending',
        phase: 'Development',
        progress: 25,
        dueDate: '2024-05-31',
        team: '5 members',
        description: 'Developing a modern patient portal with secure access to medical records and appointment scheduling.',
        completedTasks: [
            {
                id: 'task-1',
                name: 'UI/UX Design',
                description: 'Design new user interface for enhanced patient experience',
                date: '2024-04-10',
                assignee: 'Sarah Johnson',
                status: 'completed',
                requirements: [
                    'User dashboard layout',
                    'Patient information forms',
                    'Appointment scheduling interface'
                ]
            }
        ],
        inProgressTasks: [
            {
                id: 'task-2',
                name: 'Feature Implementation',
                description: 'Implement new features and functionality',
                date: '2024-04-30',
                assignee: 'Mike Wilson',
                status: 'in-progress',
                requirements: [
                    'Patient records integration',
                    'Appointment booking system',
                    'Notification system'
                ]
            }
        ],
        upcomingTasks: [
            {
                id: 'task-3',
                name: 'Testing & Deployment',
                description: 'Conduct testing and prepare for deployment',
                date: '2024-05-15',
                assignee: 'Emily Brown',
                status: 'upcoming',
                requirements: [
                    'User acceptance testing',
                    'Performance testing',
                    'Security testing'
                ]
            }
        ],
        updates: [
            {
                author: 'Sarah Johnson',
                time: '2 days ago',
                content: 'Completed the UI/UX design phase with stakeholder approval.'
            }
        ]
    },
    'scheduling-tool': {
        id: 'scheduling-tool',
        title: 'Appointment Scheduling Tool',
        status: 'review',
        phase: 'Testing',
        progress: 85,
        dueDate: '2024-05-01',
        team: '4 members',
        description: 'Building a comprehensive scheduling system for healthcare providers.',
        completedTasks: [
            {
                id: 'task-5',
                name: 'Calendar Integration',
                description: 'Integrate with popular calendar systems',
                date: '2024-03-10',
                assignee: 'Alex Turner',
                status: 'completed',
                requirements: [
                    'Google Calendar sync',
                    'Outlook integration',
                    'iCal support'
                ]
            }
        ],
        inProgressTasks: [
            {
                id: 'task-6',
                name: 'Automated Notifications',
                description: 'Implement notification system',
                date: '2024-03-25',
                assignee: 'Lisa Chen',
                status: 'in-progress',
                requirements: [
                    'SMS notifications',
                    'Email reminders',
                    'Custom templates'
                ]
            }
        ],
        upcomingTasks: [
            {
                id: 'task-7',
                name: 'Analytics Dashboard',
                description: 'Create analytics reporting system',
                date: '2024-04-10',
                assignee: 'David Kim',
                status: 'upcoming',
                requirements: [
                    'Usage statistics',
                    'Performance metrics',
                    'Custom reports'
                ]
            }
        ],
        updates: [
            {
                author: 'Alex Turner',
                time: '3 days ago',
                content: 'Completed calendar integration with major providers.'
            }
        ]
    },
    'internal-dashboard': {
        id: 'internal-dashboard',
        title: 'Internal Analytics Dashboard',
        status: 'complete',
        phase: 'Deployment',
        progress: 100,
        dueDate: '2024-03-01',
        team: '3 members',
        description: 'Creating a comprehensive dashboard for internal business analytics.',
        completedTasks: [
            {
                id: 'task-8',
                name: 'Data Integration',
                description: 'Connect all data sources',
                date: '2024-02-15',
                assignee: 'Rachel Green',
                status: 'completed',
                requirements: [
                    'API connections',
                    'Data validation',
                    'Error handling'
                ]
            }
        ],
        inProgressTasks: [],
        upcomingTasks: [],
        updates: [
            {
                author: 'Rachel Green',
                time: '1 week ago',
                content: 'Successfully deployed the dashboard to production.'
            }
        ]
    },
    'crm-dashboards': {
        id: 'crm-dashboards',
        title: 'CRM Dashboard Suite',
        status: 'in-progress',
        phase: 'Development',
        progress: 45,
        dueDate: '2024-07-01',
        team: '6 members',
        description: 'Building a suite of dashboards for customer relationship management.',
        completedTasks: [
            {
                id: 'task-9',
                name: 'Customer Overview',
                description: 'Create main customer dashboard',
                date: '2024-03-01',
                assignee: 'Tom Wilson',
                status: 'completed',
                requirements: [
                    'Customer profiles',
                    'Interaction history',
                    'Key metrics'
                ]
            }
        ],
        inProgressTasks: [
            {
                id: 'task-10',
                name: 'Sales Analytics',
                description: 'Implement sales tracking system',
                date: '2024-03-20',
                assignee: 'Anna Martinez',
                status: 'in-progress',
                requirements: [
                    'Revenue tracking',
                    'Pipeline visualization',
                    'Forecasting tools'
                ]
            }
        ],
        upcomingTasks: [
            {
                id: 'task-11',
                name: 'Customer Support',
                description: 'Build support ticket system',
                date: '2024-04-05',
                assignee: 'Chris Lee',
                status: 'upcoming',
                requirements: [
                    'Ticket management',
                    'Response tracking',
                    'Satisfaction surveys'
                ]
            }
        ],
        updates: [
            {
                author: 'Tom Wilson',
                time: '2 days ago',
                content: 'Completed the customer overview dashboard with key metrics.'
            }
        ]
    },
    'rfp-pricing-tool': {
        id: 'rfp-pricing-tool',
        title: 'RFP Pricing Tool',
        status: 'upcoming',
        phase: 'Planning',
        progress: 20,
        dueDate: '2024-08-01',
        team: '4 members',
        description: 'Developing a tool for managing RFP pricing and proposals.',
        completedTasks: [],
        inProgressTasks: [
            {
                id: 'task-12',
                name: 'Requirements Analysis',
                description: 'Define core features and requirements',
                date: '2024-03-15',
                assignee: 'Mark Thompson',
                status: 'in-progress',
                requirements: [
                    'User requirements',
                    'System architecture',
                    'Integration points'
                ]
            }
        ],
        upcomingTasks: [
            {
                id: 'task-13',
                name: 'Database Design',
                description: 'Design database schema',
                date: '2024-04-01',
                assignee: 'Laura White',
                status: 'upcoming',
                requirements: [
                    'Data modeling',
                    'Relationships',
                    'Indexing strategy'
                ]
            }
        ],
        updates: [
            {
                author: 'Mark Thompson',
                time: '1 day ago',
                content: 'Completed initial requirements gathering session.'
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
    }
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
window.showProjectDetails = function(projectId) {
    const project = window.projectsData[projectId];
    if (!project) {
        console.error('Project not found:', projectId);
        return;
    }

    // Get current user's email
    const accounts = window.b2cInstance.getAllAccounts();
    if (accounts.length === 0) {
        console.error('No authenticated user found');
        return;
    }
    const userEmail = accounts[0].username;

    // Check if user has access to this project
    if (!window.isProjectForCustomer(projectId, userEmail)) {
        console.error('User does not have access to this project');
        return;
    }

    const projectDetails = document.getElementById('project-details');
    const customerPortal = document.getElementById('customer-portal-section');

    if (!projectDetails || !customerPortal) {
        console.error('Required DOM elements not found');
        return;
    }

    try {
        // Update header
        const titleElement = projectDetails.querySelector('.project-title h1');
        const statusBadge = projectDetails.querySelector('.status-badge');
        
        if (titleElement) titleElement.textContent = project.title;
        if (statusBadge) {
            statusBadge.textContent = project.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
            statusBadge.className = `status-badge ${project.status}`;
        }

        // Update meta information
        const metaItems = projectDetails.querySelectorAll('.meta-item span:not(.meta-label)');
        if (metaItems.length >= 2) {
            metaItems[0].textContent = project.dueDate;
            metaItems[1].textContent = `${project.progress}%`;
        }

        // Update task lists
        const completedTasksList = projectDetails.querySelector('#completed-tasks');
        const inProgressTasksList = projectDetails.querySelector('#in-progress-tasks');
        const upcomingTasksList = projectDetails.querySelector('#upcoming-tasks');

        if (completedTasksList) {
            completedTasksList.innerHTML = project.completedTasks.map(task => createTaskListItem(task)).join('');
        }
        if (inProgressTasksList) {
            inProgressTasksList.innerHTML = project.inProgressTasks.map(task => createTaskListItem(task)).join('');
        }
        if (upcomingTasksList) {
            upcomingTasksList.innerHTML = project.upcomingTasks.map(task => createTaskListItem(task)).join('');
        }

        // Update updates/comments section
        const updateList = projectDetails.querySelector('.update-list');
        if (updateList) {
            updateList.innerHTML = project.updates.map(update => `
        <div class="update-item">
            <div class="update-header">
                <span class="update-author">${update.author}</span>
                        <span class="update-time">${update.time}</span>
            </div>
            <p class="update-content">${update.content}</p>
        </div>
    `).join('');
}

        // Show project details section
        customerPortal.style.display = 'none';
        projectDetails.style.display = 'block';

        // Add smooth transitions
        document.querySelectorAll('.task-item').forEach(item => {
            item.style.transition = 'all 0.2s ease';
        });

    } catch (error) {
        console.error('Error updating project details:', error);
    }
};

// Create task list item with modern styling
function createTaskListItem(task) {
    return `
        <li class="task-item" onclick="showTaskDetails('${task.id}')">
            <div class="task-header">
                <div class="task-name">
                    <i class="fas fa-circle-check"></i>
                    <span>${task.name}</span>
                </div>
                <div class="task-date">
                    <i class="fas fa-calendar"></i>
                    <span>${task.date}</span>
                </div>
            </div>
            <div class="task-description">${task.description}</div>
            <div class="task-meta">
                <div class="task-assignee">
                    <i class="fas fa-user"></i>
                    <span>${task.assignee}</span>
                </div>
            </div>
        </li>
    `;
}

// Format date
window.formatDate = function(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
};

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
    let task = null;

    // Find the task in all projects
    for (const project of Object.values(window.projectsData)) {
        const foundTask = [...project.completedTasks, ...project.inProgressTasks, ...project.upcomingTasks]
            .find(t => t.id === taskId);
        if (foundTask) {
            task = foundTask;
            break;
        }
    }

    if (!task) {
        console.error('Task not found:', taskId);
        return;
    }

    const overlay = document.getElementById('task-overlay');
    
    // Update the content
    document.getElementById('task-title').textContent = task.name;
    document.getElementById('task-date').textContent = task.date;
    document.getElementById('task-assignee').textContent = task.assignee;
    
    const statusElement = document.getElementById('task-status');
    statusElement.textContent = task.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    statusElement.className = `status-badge ${task.status}`;
    
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

    // Add escape key listener
    document.addEventListener('keydown', handleEscapeKey);
}

function closeTaskOverlay() {
    const overlay = document.getElementById('task-overlay');
    overlay.classList.remove('show');
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 300);

    // Remove escape key listener
    document.removeEventListener('keydown', handleEscapeKey);
}

function handleEscapeKey(event) {
    if (event.key === 'Escape') {
        window.closeTaskOverlay();
    }
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

// Task click handlers
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