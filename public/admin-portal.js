// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeOverlayButtons();
    initializeStatusFilter();
    initializeCloseOverlayHandlers();
    initializeFormHandlers();
    addPageTransitionHandlers();
});

function initializeOverlayButtons() {
    // New Project button
    const newProjectBtn = document.getElementById('newProjectBtn');
    if (newProjectBtn) {
        newProjectBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showNewProjectOverlay();
        });
    } else {
        console.error('New Project button not found');
    }

    // Add Customer button
    const addCustomerBtn = document.getElementById('addCustomerBtn');
    if (addCustomerBtn) {
        addCustomerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showNewCustomerOverlay();
        });
    } else {
        console.error('Add Customer button not found');
    }
}

function initializeCloseOverlayHandlers() {
    // Close buttons
    const closeButtons = document.querySelectorAll('.close-button');
    closeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const overlay = button.closest('.overlay');
            if (overlay) {
                closeOverlay(overlay);
            }
        });
    });

    // Cancel buttons
    const cancelButtons = document.querySelectorAll('.form-actions .action-button.secondary');
    cancelButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const overlay = button.closest('.overlay');
            if (overlay) {
                closeOverlay(overlay);
            }
        });
    });

    // Close on outside click
    const overlays = document.querySelectorAll('.overlay');
    overlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeOverlay(overlay);
            }
        });
    });
}

function initializeFormHandlers() {
    // New Project form
    const newProjectForm = document.getElementById('new-project-form');
    if (newProjectForm) {
        newProjectForm.addEventListener('submit', handleNewProjectSubmit);
    }

    // New Customer form
    const newCustomerForm = document.getElementById('new-customer-form');
    if (newCustomerForm) {
        newCustomerForm.addEventListener('submit', handleNewCustomerSubmit);
    }

    // Logo upload preview
    const logoInput = document.getElementById('customer-logo');
    if (logoInput) {
        logoInput.addEventListener('change', handleLogoPreview);
    }
}

function handleLogoPreview(e) {
    const file = e.target.files[0];
    const preview = document.getElementById('logo-preview-img');
    
    if (file && preview) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

function showNewProjectOverlay() {
    const overlay = document.getElementById('new-project-overlay');
    if (overlay) {
        overlay.style.display = 'flex';
        setTimeout(() => {
            overlay.classList.add('show');
        }, 10);
        const form = document.getElementById('new-project-form');
        if (form) {
            form.reset();
        }
    } else {
        console.error('Project overlay not found');
    }
}

function showNewCustomerOverlay() {
    const overlay = document.getElementById('new-customer-overlay');
    if (overlay) {
        overlay.style.display = 'flex';
        setTimeout(() => {
            overlay.classList.add('show');
        }, 10);
        const form = document.getElementById('new-customer-form');
        if (form) {
            form.reset();
        }
        const logoPreview = document.getElementById('logo-preview-img');
        if (logoPreview) {
            logoPreview.style.display = 'none';
        }
    } else {
        console.error('Customer overlay not found');
    }
}

function closeOverlay(overlay) {
    overlay.classList.remove('show');
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 300);
}

function handleNewProjectSubmit(e) {
    e.preventDefault();
    
    // Show success message
    const form = e.target;
    showSuccessMessage(form, 'Project Created Successfully', 'Your new project has been created and assigned.');
}

function handleNewCustomerSubmit(e) {
    e.preventDefault();
    
    // Show success message
    const form = e.target;
    showSuccessMessage(form, 'Customer Added Successfully', 'The new customer has been added to your portfolio.');
}

function showSuccessMessage(form, title, message) {
    const originalContent = form.innerHTML;
    
    form.innerHTML = `
        <div class="success-message">
            <div class="success-content">
                <i class="fas fa-check-circle"></i>
                <h3>${title}</h3>
                <p>${message}</p>
            </div>
        </div>
    `;
    
    setTimeout(() => {
        const overlay = form.closest('.overlay');
        if (overlay) {
            closeOverlay(overlay);
            // Reset form after closing
            setTimeout(() => {
                form.innerHTML = originalContent;
                form.reset();
                // Reset logo preview if it exists
                const logoPreview = document.getElementById('logo-preview-img');
                if (logoPreview) {
                    logoPreview.style.display = 'none';
                }
            }, 300);
        }
    }, 2000);
}

// Initialize status filter functionality
function initializeStatusFilter() {
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            const selectedStatus = this.value;
            filterProjectsByStatus(selectedStatus);
        });
    }
}

function filterProjectsByStatus(status) {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        const cardStatus = card.querySelector('.status-badge').textContent.toLowerCase();
        if (status === 'all' || cardStatus.includes(status)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
    updateProjectCounts();
}

function updateProjectCounts() {
    const customerGroups = document.querySelectorAll('.customer-group');
    customerGroups.forEach(group => {
        const visibleProjects = group.querySelectorAll('.project-card[style="display: block"]').length;
        const countElement = group.querySelector('.customer-info p');
        if (countElement) {
            countElement.textContent = `${visibleProjects} Projects Shown`;
        }
    });
}

// Add page transition handling
function addPageTransitionHandlers() {
    const mainContent = document.querySelector('.main-content');
    const navLinks = document.querySelectorAll('.nav-link');

    // Function to handle page transitions
    function handlePageTransition(event) {
        event.preventDefault();
        const targetHref = event.currentTarget.getAttribute('href');

        // Don't transition if clicking the current page
        if (event.currentTarget.classList.contains('active')) {
            return;
        }

        // Remove active class from all links
        navLinks.forEach(link => link.classList.remove('active'));
        // Add active class to clicked link
        event.currentTarget.classList.add('active');

        // Fade out
        mainContent.classList.add('fade-out');

        // Wait for fade out, then navigate
        setTimeout(() => {
            window.location.href = targetHref;
        }, 300);
    }

    // Add click handlers to nav links
    navLinks.forEach(link => {
        link.addEventListener('click', handlePageTransition);
    });

    // Add fade-in class when page loads
    mainContent.classList.add('fade-in');
}