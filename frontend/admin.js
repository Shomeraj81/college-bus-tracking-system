// ===== LOGIN FUNCTIONALITY =====
function login() {
  const role = document.getElementById("role").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (!username || !password) {
    alert("Please enter both username and password!");
    return;
  }

  sessionStorage.setItem("userRole", role);
  sessionStorage.setItem("username", username);

  if (role === "admin") {
    window.location.href = "admin.html";
  } else {
    window.location.href = "student.html";
  }
}

// ===== LOGOUT =====
function logout() {
  if (confirm("Are you sure you want to logout?")) {
    sessionStorage.clear();
    window.location.href = "index.html";
  }
}

// ===== SECTION NAVIGATION =====
function showSection(sectionId) {
  // Prevent default link behavior
  event.preventDefault();

  // Hide all sections
  document.querySelectorAll(".dashboard-section").forEach((section) => {
    section.classList.remove("active");
  });

  // Show selected section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add("active");
  }

  // Update nav items
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.remove("active");
    if (item.getAttribute("href") === "#" + sectionId) {
      item.classList.add("active");
    }
  });
}

// ===== ADD BUS =====
function addBus() {
  const busNumber = document.getElementById("busNumber").value.trim();
  const busCapacity = document.getElementById("busCapacity").value.trim();
  const busRoute = document.getElementById("busRoute").value;
  const busDriver = document.getElementById("busDriver").value;

  // Validation
  if (!busNumber || !busCapacity || !busRoute || !busDriver) {
    alert("Please fill all fields!");
    return;
  }

  // Validate bus number format (optional)
  if (!/^[A-Z]{2}-\d{2}-\d{4}$/.test(busNumber)) {
    if (!confirm("Bus number format should be XX-00-0000. Continue anyway?")) {
      return;
    }
  }

  // Add to table
  const tbody = document
    .getElementById("busTable")
    .getElementsByTagName("tbody")[0];
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

  // Clear inputs
  document.getElementById("busNumber").value = "";
  document.getElementById("busCapacity").value = "";
  document.getElementById("busRoute").value = "";
  document.getElementById("busDriver").value = "";

  alert("Bus added successfully!");
}

// ===== ADD ROUTE =====
function addRoute() {
  const routeName = document.getElementById("routeName").value.trim();
  const routeStart = document.getElementById("routeStart").value.trim();
  const routeEnd = document.getElementById("routeEnd").value.trim();
  const routeStops = document.getElementById("routeStops").value.trim();

  // Validation
  if (!routeName || !routeStart || !routeEnd || !routeStops) {
    alert("Please fill all fields!");
    return;
  }

  if (routeStops < 2) {
    alert("Route must have at least 2 stops!");
    return;
  }

  // Add to table
  const tbody = document
    .getElementById("routeTable")
    .getElementsByTagName("tbody")[0];
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

  // Clear inputs
  document.getElementById("routeName").value = "";
  document.getElementById("routeStart").value = "";
  document.getElementById("routeEnd").value = "";
  document.getElementById("routeStops").value = "";

  alert("Route added successfully!");
}

// ===== ADD DRIVER =====
function addDriver() {
  const driverName = document.getElementById("driverName").value.trim();
  const driverLicense = document.getElementById("driverLicense").value.trim();
  const driverPhone = document.getElementById("driverPhone").value.trim();
  const driverExperience = document
    .getElementById("driverExperience")
    .value.trim();

  // Validation
  if (!driverName || !driverLicense || !driverPhone || !driverExperience) {
    alert("Please fill all fields!");
    return;
  }

  // Validate phone number (basic)
  if (!/^\+?[\d\s-]{10,}$/.test(driverPhone)) {
    alert("Please enter a valid phone number!");
    return;
  }

  if (driverExperience < 1) {
    alert("Experience must be at least 1 year!");
    return;
  }

  // Add to table
  const tbody = document
    .getElementById("driverTable")
    .getElementsByTagName("tbody")[0];
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

  // Clear inputs
  document.getElementById("driverName").value = "";
  document.getElementById("driverLicense").value = "";
  document.getElementById("driverPhone").value = "";
  document.getElementById("driverExperience").value = "";

  alert("Driver added successfully!");
}

// ===== DELETE ROW =====
function deleteRow(btn) {
  if (confirm("Are you sure you want to delete this entry?")) {
    const row = btn.closest("tr");
    row.remove();
    alert("Entry deleted successfully!");
  }
}

// ===== EDIT ROW =====
function editRow(btn) {
  alert(
    "Edit functionality coming soon!\n\nThis feature will allow you to modify existing entries.",
  );
}

// ===== INITIALIZE ON PAGE LOAD =====
document.addEventListener("DOMContentLoaded", function () {
  // Check if on dashboard page
  if (document.querySelector(".dashboard-body")) {
    checkAuth();

    // Display welcome message
    const username = sessionStorage.getItem("username");
    if (username) {
      console.log("Welcome, " + username + "!");
    }
  }

  // Add keyboard shortcuts
  document.addEventListener("keydown", function (e) {
    // Ctrl/Cmd + S to focus on search (if implemented)
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      // Future: focus search input
    }

    // ESC to close modals (if implemented)
    if (e.key === "Escape") {
      // Future: close any open modals
    }
  });
});

// ===== UTILITY FUNCTIONS =====

// Format phone number
function formatPhoneNumber(phone) {
  const cleaned = phone.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{2})(\d{10})$/);
  if (match) {
    return "+" + match[1] + " " + match[2];
  }
  return phone;
}

// Format bus number
function formatBusNumber(busNum) {
  return busNum.toUpperCase();
}

// Validate email (for future use)
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

console.log("Admin Dashboard JS loaded successfully!");
