// Simple frontend JS for shared functionality like Mobile Menu, Auth checking

document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            // Simplified toggle for demonstration
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            if (navLinks.style.display === 'flex') {
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '70px';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'var(--glass-bg)';
                navLinks.style.backdropFilter = 'blur(12px)';
                navLinks.style.padding = '1rem 0';
                navLinks.style.boxShadow = 'var(--glass-shadow)';
            }
        });
    }

    // Check auth status to conditionally render login/dashboard buttons
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    // Update nav links based on auth
    const loginBtn = document.querySelector('a[href="login.html"]');
    if (loginBtn && token) {
        if (role === 'admin') {
            loginBtn.textContent = 'Admin Dashboard';
            loginBtn.href = 'admin.html';
        } else {
            loginBtn.textContent = 'Dashboard';
            loginBtn.href = 'dashboard.html';
        }
        
        // Add logout button
        const logoutLi = document.createElement('li');
        const logoutBtn = document.createElement('a');
        logoutBtn.href = "#";
        logoutBtn.className = "btn btn-secondary";
        logoutBtn.style.marginLeft = "10px";
        logoutBtn.textContent = "Logout";
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('role');
            window.location.href = 'index.html';
        });
        logoutLi.appendChild(logoutBtn);
        document.querySelector('.nav-links').appendChild(logoutLi);
    }
});

// Utility to handle API Calls (simplifies fetch)
async function apiCall(endpoint, method = 'GET', body = null) {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json'
    };
    if (token) headers['x-auth-token'] = token;

    const options = {
        method,
        headers
    };
    if (body) options.body = JSON.stringify(body);

    const res = await fetch(`/api${endpoint}`, options);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'API Error');
    return data;
}
