document.addEventListener('DOMContentLoaded', () => {
    // Authentication Check
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    
    if (!token || userRole !== 'farmer') {
        if(userRole === 'admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'login.html';
        }
        return;
    }

    // Set user name
    const userData = JSON.parse(localStorage.getItem('user'));
    if(userData && userData.name) {
        document.getElementById('user-name').textContent = userData.name;
    }

    // Logout
    const logoutBtn = document.createElement('a');
    logoutBtn.href = "#";
    logoutBtn.className = "btn btn-secondary";
    logoutBtn.textContent = "Logout";
    logoutBtn.onclick = (e) => {
        e.preventDefault();
        localStorage.clear();
        window.location.href = 'index.html';
    };
    document.getElementById('logout-container').appendChild(logoutBtn);

    // Sidebar navigation logic
    const links = document.querySelectorAll('.sidebar-menu a');
    const sections = document.querySelectorAll('.view-section');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // Remove active from all
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Hide all sections, show target
            const targetId = link.getAttribute('data-target');
            sections.forEach(s => s.style.display = 'none');
            const targetEl = document.getElementById(targetId);
            if(targetEl) targetEl.style.display = 'block';

            // Close sidebar on mobile
            if(window.innerWidth <= 768) {
                document.querySelector('.sidebar').classList.remove('open');
            }
        });
    });

    // Mobile Sidebar toggle
    const dashHamburger = document.getElementById('dash-hamburger');
    if(dashHamburger) {
        dashHamburger.addEventListener('click', () => {
            document.querySelector('.sidebar').classList.toggle('open');
        });
    }

    // Load Data
    loadDashboardData();
});

async function loadDashboardData() {
    try {
        // 1. Weather Data (Mock/Real from API)
        const weather = await apiCall('/weather');
        document.getElementById('w-temp').textContent = `${Math.round(weather.temperature)}°C`;
        document.getElementById('w-loc').textContent = weather.location;
        document.getElementById('w-desc').textContent = weather.forecast;
        
        let iconClass = 'fa-sun';
        if(weather.forecast.includes('rain')) iconClass = 'fa-cloud-rain';
        else if(weather.forecast.includes('cloud')) iconClass = 'fa-cloud';
        document.getElementById('w-icon').className = `fa-solid ${iconClass}`;

        // 2. Fetch all required DB data in parallel
        // For actual implementation, crops, prices, storage endpoints are required to return full lists.
        const [crops, prices, storages, demands] = await Promise.all([
            apiCall('/crops'),
            apiCall('/market'),
            apiCall('/storage'),
            apiCall('/demand')
        ]);

        // 3. Render Market Prices
        const trendingBody = document.getElementById('trending-prices-body');
        const allPricesBody = document.getElementById('all-prices-body');
        
        if (prices.length === 0) {
            trendingBody.innerHTML = '<tr><td colspan="3">No price data available</td></tr>';
            allPricesBody.innerHTML = '<tr><td colspan="5">No price data available</td></tr>';
        } else {
            trendingBody.innerHTML = '';
            allPricesBody.innerHTML = '';
            
            // Render first 5 for trending
            prices.slice(0, 5).forEach(p => {
                const tr = document.createElement('tr');
                const cropName = p.crop ? p.crop.name : 'Unknown';
                tr.innerHTML = `<td>${cropName}</td><td>${p.marketLocation}</td><td style="color:var(--primary-color);font-weight:bold;">₹${p.pricePerKg}</td>`;
                trendingBody.appendChild(tr);
            });

            // Render all
            prices.forEach(p => {
                const tr = document.createElement('tr');
                const cropName = p.crop ? p.crop.name : 'Unknown';
                const cat = p.crop ? p.crop.category : '-';
                const date = new Date(p.date).toLocaleDateString();
                tr.innerHTML = `<td>${date}</td><td><strong>${cropName}</strong></td><td>${cat}</td><td>${p.marketLocation}</td><td style="color:var(--primary-color);font-weight:bold;">₹${p.pricePerKg}</td>`;
                allPricesBody.appendChild(tr);
            });
        }

        // 4. Render Storage
        const storageGrid = document.getElementById('storage-grid');
        storageGrid.innerHTML = '';
        if(storages.length === 0) {
            storageGrid.innerHTML = '<p>No storage facilities added yet.</p>';
        } else {
            storages.forEach(s => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <div class="card-header"><h3><i class="fa-solid fa-warehouse"></i> ${s.name}</h3></div>
                    <p><strong>Type:</strong> ${s.type}</p>
                    <p><strong>Location:</strong> ${s.location}</p>
                    <p><strong>Capacity:</strong> ${s.capacity}</p>
                    <p><strong>Contact:</strong> ${s.contactDetails}</p>
                `;
                storageGrid.appendChild(card);
            });
        }

        // 5. Render Value Addition
        const vaGrid = document.getElementById('va-grid');
        vaGrid.innerHTML = '';
        if(crops.length === 0) {
            vaGrid.innerHTML = '<p>No crops and ideas available.</p>';
        } else {
            crops.forEach(c => {
                if(c.valueAdditionIdeas && c.valueAdditionIdeas.length > 0) {
                    const card = document.createElement('div');
                    card.className = 'va-card';
                    card.innerHTML = `
                        <h4><i class="fa-solid fa-leaf"></i> ${c.name}</h4>
                        <ul style="list-style-type:circle; text-align:left; display:inline-block; margin-top:0.5rem;">
                            ${c.valueAdditionIdeas.map(idea => `<li>${idea}</li>`).join('')}
                        </ul>
                    `;
                    vaGrid.appendChild(card);
                }
            });
            if(vaGrid.innerHTML === '') vaGrid.innerHTML = '<p>No value addition ideas found for existing crops.</p>';
        }

        // 6. Draw Mock Demand Chart
        const ctx = document.getElementById('demandChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Tomato Demand (Mock Metric)',
                    data: [65, 59, 80, 81, 56, 95],
                    fill: true,
                    backgroundColor: 'rgba(76, 175, 80, 0.2)',
                    borderColor: 'rgba(76, 175, 80, 1)',
                    tension: 0.4
                }, {
                    label: 'Potato Demand (Mock Metric)',
                    data: [28, 48, 40, 19, 86, 27],
                    fill: true,
                    backgroundColor: 'rgba(249, 168, 37, 0.2)',
                    borderColor: 'rgba(249, 168, 37, 1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });

        // 7. Render Demand Data
        const demandBody = document.getElementById('demand-table-body');
        if (demandBody) {
            demandBody.innerHTML = '';
            if(!demands || demands.length === 0) {
                demandBody.innerHTML = '<tr><td colspan="4">No demand data available</td></tr>';
            } else {
                demands.forEach(d => {
                    const tr = document.createElement('tr');
                    const cropName = d.crop ? d.crop.name : 'Unknown';
                    const date = new Date(d.date).toLocaleDateString();
                    
                    const getDemandStyle = (level) => {
                        if(level === 'High') return 'color: #e53e3e; font-weight: bold;';
                        if(level === 'Medium') return 'color: #d69e2e; font-weight: bold;';
                        if(level === 'Low') return 'color: #38a169; font-weight: bold;';
                        return '';
                    };

                    tr.innerHTML = `
                        <td>${date}</td>
                        <td><strong>${cropName}</strong></td>
                        <td style="${getDemandStyle(d.currentDemand)}">${d.currentDemand}</td>
                        <td style="${getDemandStyle(d.predictedDemand)}">${d.predictedDemand}</td>
                    `;
                    demandBody.appendChild(tr);
                });
            }
        }

    } catch (err) {
        console.error('Error loading dashboard data', err);
    }
}
