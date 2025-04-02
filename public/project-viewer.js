class ProjectViewer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.projects = [];
        this.currentFilter = 'all';
        this.setupUI();
    }

    setupUI() {
        // Create filter buttons
        const filterContainer = document.createElement('div');
        filterContainer.className = 'filter-container';
        filterContainer.innerHTML = `
            <button class="filter-btn active" data-filter="all">All</button>
            <button class="filter-btn" data-filter="in-progress">In Progress</button>
            <button class="filter-btn" data-filter="pending">Pending</button>
            <button class="filter-btn" data-filter="completed">Completed</button>
        `;
        this.container.appendChild(filterContainer);

        // Create projects container
        this.projectsContainer = document.createElement('div');
        this.projectsContainer.className = 'projects-container';
        this.container.appendChild(this.projectsContainer);

        // Add filter click handlers
        filterContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                this.currentFilter = e.target.dataset.filter;
                filterContainer.querySelectorAll('.filter-btn').forEach(btn => 
                    btn.classList.toggle('active', btn === e.target)
                );
                this.renderProjects();
            }
        });

        // Create overlay for task details
        this.overlay = document.createElement('div');
        this.overlay.className = 'task-overlay';
        this.overlay.style.display = 'none';
        document.body.appendChild(this.overlay);

        // Close overlay on click outside
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.hideTaskDetails();
            }
        });
    }

    setProjects(projects) {
        this.projects = projects;
        this.renderProjects();
    }

    renderProjects() {
        this.projectsContainer.innerHTML = '';
        
        const filteredProjects = this.projects.filter(project => {
            if (this.currentFilter === 'all') return true;
            return project.status.toLowerCase() === this.currentFilter;
        });

        filteredProjects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = `project-card ${project.status.toLowerCase()}`;
            
            const startDate = new Date(project.startDate).toLocaleDateString();
            const dueDate = new Date(project.dueDate).toLocaleDateString();
            
            projectCard.innerHTML = `
                <h3>${project.name}</h3>
                <p class="project-dates">
                    <span>Start: ${startDate}</span>
                    <span>Due: ${dueDate}</span>
                </p>
                <p class="project-status ${project.status.toLowerCase()}">${project.status}</p>
                <div class="project-progress">
                    <div class="progress-bar" style="width: ${project.progress}%"></div>
                </div>
                <p class="project-description">${project.description}</p>
                <button class="view-tasks-btn">View Tasks</button>
            `;

            projectCard.querySelector('.view-tasks-btn').addEventListener('click', () => {
                this.showTaskDetails(project);
            });

            this.projectsContainer.appendChild(projectCard);
        });
    }

    showTaskDetails(project) {
        this.overlay.innerHTML = `
            <div class="task-details">
                <h2>${project.name} - Tasks</h2>
                <div class="task-list">
                    ${project.tasks.map(task => `
                        <div class="task-item ${task.status.toLowerCase()}">
                            <h4>${task.name}</h4>
                            <p>${task.description}</p>
                            <div class="task-meta">
                                <span>Status: ${task.status}</span>
                                <span>Due: ${new Date(task.dueDate).toLocaleDateString()}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <button class="close-overlay">Close</button>
            </div>
        `;

        this.overlay.querySelector('.close-overlay').addEventListener('click', () => {
            this.hideTaskDetails();
        });

        this.overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    hideTaskDetails() {
        this.overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Export for use in other files
window.ProjectViewer = ProjectViewer; 