// ===== LOGIN FUNCTIONALITY =====
function login() {
    const role = document.getElementById('role').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        alert('Please enter both username and password!');
        return;
    }

    sessionStorage.setItem('userRole', role);
    sessionStorage.setItem('username', username);

    if (role === 'admin') {
        window.location.href = 'admin.html';
    } else {
        window.location.href = 'student.html';
    }
}

// ===== LOGOUT =====
function logout() {
    sessionStorage.clear();
    window.location.href = 'index.html';
}

// ===== CHECK AUTH =====
function checkAuth() {
    const userRole = sessionStorage.getItem('userRole');
    if (!userRole) {
        window.location.href = 'index.html';
    }
}

// ===== SECTION NAVIGATION =====
function showSection(sectionId) {
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.remove('active');
    });

    document.getElementById(sectionId).classList.add('active');

    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === '#' + sectionId) {
            item.classList.add('active');
        }
    });
}

// ===== ADD BUS =====
function addBus() {
    const busNumber   = document.getElementById('busNumber').value.trim();
    const busCapacity = document.getElementById('busCapacity').value.trim();
    const busRoute    = document.getElementById('busRoute').value;
    const busDriver   = document.getElementById('busDriver').value;

    if (!busNumber || !busCapacity || !busRoute || !busDriver) {
        alert('Please fill all fields!');
        return;
    }

    const tbody = document.getElementById('busTable').getElementsByTagName('tbody')[0];
    const newRow = tbody.insertRow();
    newRow.innerHTML = `
        <td>${busNumber}</td>
        <td>${busCapacity}</td>
        <td>${busRoute}</td>
        <td>${busDriver}</td>
        <td><span class="status active">Active</span></td>
        <td>
            <button class="edit-btn" onclick="editRow(this)">Edit</button>
            <button class="delete-btn" onclick="deleteRow(this)">Delete</button>
        </td>
    `;

    document.getElementById('busNumber').value   = '';
    document.getElementById('busCapacity').value = '';
    document.getElementById('busRoute').value    = '';
    document.getElementById('busDriver').value   = '';

    alert('Bus added successfully!');
}

// ===== ADD ROUTE =====
function addRoute() {
    const routeName  = document.getElementById('routeName').value.trim();
    const routeStart = document.getElementById('routeStart').value.trim();
    const routeEnd   = document.getElementById('routeEnd').value.trim();
    const routeStops = document.getElementById('routeStops').value.trim();

    if (!routeName || !routeStart || !routeEnd || !routeStops) {
        alert('Please fill all fields!');
        return;
    }

    const tbody = document.getElementById('routeTable').getElementsByTagName('tbody')[0];
    const newRow = tbody.insertRow();
    newRow.innerHTML = `
        <td>${routeName}</td>
        <td>${routeStart}</td>
        <td>${routeEnd}</td>
        <td>${routeStops}</td>
        <td>
            <button class="edit-btn" onclick="editRow(this)">Edit</button>
            <button class="delete-btn" onclick="deleteRow(this)">Delete</button>
        </td>
    `;

    document.getElementById('routeName').value  = '';
    document.getElementById('routeStart').value = '';
    document.getElementById('routeEnd').value   = '';
    document.getElementById('routeStops').value = '';

    alert('Route added successfully!');
}

// ===== ADD DRIVER =====
function addDriver() {
    const driverName       = document.getElementById('driverName').value.trim();
    const driverLicense    = document.getElementById('driverLicense').value.trim();
    const driverPhone      = document.getElementById('driverPhone').value.trim();
    const driverExperience = document.getElementById('driverExperience').value.trim();

    if (!driverName || !driverLicense || !driverPhone || !driverExperience) {
        alert('Please fill all fields!');
        return;
    }

    const tbody = document.getElementById('driverTable').getElementsByTagName('tbody')[0];
    const newRow = tbody.insertRow();
    newRow.innerHTML = `
        <td>${driverName}</td>
        <td>${driverLicense}</td>
        <td>${driverPhone}</td>
        <td>${driverExperience} years</td>
        <td>
            <button class="edit-btn" onclick="editRow(this)">Edit</button>
            <button class="delete-btn" onclick="deleteRow(this)">Delete</button>
        </td>
    `;

    document.getElementById('driverName').value       = '';
    document.getElementById('driverLicense').value    = '';
    document.getElementById('driverPhone').value      = '';
    document.getElementById('driverExperience').value = '';

    alert('Driver added successfully!');
}

// ===== DELETE ROW =====
function deleteRow(btn) {
    if (confirm('Are you sure you want to delete this entry?')) {
        btn.closest('tr').remove();
    }
}

// ===== EDIT ROW =====
function editRow(btn) {
    alert('Edit functionality coming soon!');
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function () {
    if (document.querySelector('.dashboard-body')) {
        checkAuth();
    }
});