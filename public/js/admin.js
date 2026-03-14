document.addEventListener('DOMContentLoaded', () => {
    // Auth Check
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    
    if (!token || userRole !== 'admin') {
        window.location.href = 'index.html';
        return;
    }

    // Logout
    const logoutBtn = document.createElement('a');
    logoutBtn.href = "#";
    logoutBtn.className = "btn btn-secondary";
    logoutBtn.textContent = "Logout";
    logoutBtn.style.color = "#2b6cb0";
    logoutBtn.style.borderColor = "#2b6cb0";
    logoutBtn.onclick = (e) => {
        e.preventDefault();
        localStorage.clear();
        window.location.href = 'index.html';
    };
    document.getElementById('logout-container').appendChild(logoutBtn);

    // Navigation
    const links = document.querySelectorAll('.sidebar-menu a');
    const sections = document.querySelectorAll('.view-section');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            const targetId = link.getAttribute('data-target');
            sections.forEach(s => s.style.display = 'none');
            const targetEl = document.getElementById(targetId);
            if(targetEl) targetEl.style.display = 'block';

            if(window.innerWidth <= 768) {
                document.querySelector('.sidebar').classList.remove('open');
            }
        });
    });

    // Mobile Sidebar
    const dashHamburger = document.getElementById('dash-hamburger');
    if(dashHamburger) {
        dashHamburger.addEventListener('click', () => {
            document.querySelector('.sidebar').classList.toggle('open');
        });
    }

    loadAdminData();
    setupForms();
});

let globalCrops = [];

async function loadAdminData() {
    try {
        const [crops, prices, storages] = await Promise.all([
            apiCall('/crops'),
            apiCall('/market'),
            apiCall('/storage')
        ]);
        globalCrops = crops; // save for dropdowns

        // Render Crops Table
        const cBody = document.getElementById('crops-table-body');
        cBody.innerHTML = '';
        crops.forEach(c => {
            const ideas = c.valueAdditionIdeas ? c.valueAdditionIdeas.join(', ') : '';
            cBody.innerHTML += `<tr><td>${c.name}</td><td>${c.category}</td><td>${ideas}</td></tr>`;
        });

        // Render Prices Table
        const pBody = document.getElementById('prices-table-body');
        pBody.innerHTML = '';
        prices.forEach(p => {
            const date = new Date(p.date).toLocaleDateString();
            const cName = p.crop ? p.crop.name : 'Unknown';
            pBody.innerHTML += `<tr><td>${date}</td><td>${cName}</td><td>${p.marketLocation}</td><td>₹${p.pricePerKg}</td></tr>`;
        });

        // Render Storage Table
        const sBody = document.getElementById('storage-table-body');
        sBody.innerHTML = '';
        storages.forEach(s => {
            sBody.innerHTML += `<tr><td>${s.name}</td><td>${s.type}</td><td>${s.location}</td><td>${s.capacity}</td></tr>`;
        });

        // Populate Dropdowns
        populateCropDropdowns();
    } catch (err) {
        console.error('Error loading admin data', err);
    }
}

function populateCropDropdowns() {
    const pSelect = document.getElementById('price-crop-id');
    const dSelect = document.getElementById('demand-crop-id');
    
    let options = '<option value="">Select a crop...</option>';
    globalCrops.forEach(c => {
        options += `<option value="${c._id}">${c.name}</option>`;
    });

    if(pSelect) pSelect.innerHTML = options;
    if(dSelect) dSelect.innerHTML = options;
}

function setupForms() {
    // Add Crop
    document.getElementById('add-crop-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const body = {
            name: document.getElementById('crop-name').value,
            category: document.getElementById('crop-category').value,
            valueAdditionIdeas: document.getElementById('crop-ideas').value.split(',').map(s=>s.trim()).filter(s=>s)
        };
        try {
            await apiCall('/crops', 'POST', body);
            alert('Crop added successfully');
            document.getElementById('add-crop-form').reset();
            loadAdminData();
        } catch(err) { alert(err.message); }
    });

    // Add Price
    document.getElementById('add-price-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const body = {
            crop: document.getElementById('price-crop-id').value,
            marketLocation: document.getElementById('price-location').value,
            pricePerKg: Number(document.getElementById('price-amount').value)
        };
        try {
            await apiCall('/market', 'POST', body);
            alert('Price updated successfully');
            document.getElementById('add-price-form').reset();
            loadAdminData();
        } catch(err) { alert(err.message); }
    });

    // Add Storage
    document.getElementById('add-storage-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const body = {
            name: document.getElementById('storage-name').value,
            type: document.getElementById('storage-type').value,
            location: document.getElementById('storage-location').value,
            capacity: document.getElementById('storage-capacity').value,
            contactDetails: document.getElementById('storage-contact').value
        };
        try {
            await apiCall('/storage', 'POST', body);
            alert('Storage added successfully');
            document.getElementById('add-storage-form').reset();
            loadAdminData();
        } catch(err) { alert(err.message); }
    });

    // Add Demand
    document.getElementById('add-demand-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const body = {
            crop: document.getElementById('demand-crop-id').value,
            currentDemand: document.getElementById('demand-current').value,
            predictedDemand: document.getElementById('demand-predicted').value
        };
        try {
            await apiCall('/demand', 'POST', body);
            alert('Demand prediction updated!');
            document.getElementById('add-demand-form').reset();
        } catch(err) { alert(err.message); }
    });
}
