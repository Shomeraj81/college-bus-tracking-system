const API = "http://localhost:5000";

let selectedType = "info";

/* ===============================
SECTION NAVIGATION
================================ */

function showSection(sectionId) {
    document.querySelectorAll(".dashboard-section").forEach(s => s.classList.remove("active"));
    document.getElementById(sectionId).classList.add("active");

    document.querySelectorAll(".nav-item").forEach(i => i.classList.remove("active"));
    const sideLink = document.querySelector(`[href="#${sectionId}"]`);
    if (sideLink) sideLink.classList.add("active");

    // Sync mobile bottom nav
    document.querySelectorAll(".admin-bottom-nav a").forEach(i => i.classList.remove("active"));
    const bottomLink = document.querySelector(`.admin-bottom-nav a[href="#${sectionId}"]`);
    if (bottomLink) bottomLink.classList.add("active");

    if (sectionId === "students")      loadStudents();
    if (sectionId === "notifications") loadNotifications();
}

/* ===============================
LOAD BUSES
================================ */

async function loadBuses() {
    try {
        const res = await fetch(API + "/api/bus");
        const buses = await res.json();
        const tbody = document.querySelector("#busTable tbody");
        tbody.innerHTML = "";

        if (!buses.length) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:#999;padding:20px;">No buses added yet</td></tr>`;
            return;
        }

        buses.forEach(bus => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${bus.busNumber}</td>
                <td>${bus.capacity}</td>
                <td>${bus.routeName}</td>
                <td>${bus.departureTime}</td>
                <td>${bus.arrivalTime}</td>
                <td><span class="status active">Active</span></td>
                <td><button onclick="deleteBus('${bus._id}')" class="delete-btn">Delete</button></td>
            `;
            tbody.appendChild(row);
        });
    } catch (err) {
        console.error("Error loading buses:", err);
    }
}

/* ===============================
LOAD ROUTES
================================ */

async function loadRoutes() {
    try {
        const res = await fetch(API + "/api/route");
        const routes = await res.json();
        const tbody = document.querySelector("#routeTable tbody");
        tbody.innerHTML = "";

        if (!routes.length) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:#999;padding:20px;">No routes added yet</td></tr>`;
            return;
        }

        routes.forEach(route => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${route.routeName}</td>
                <td>${route.startPoint}</td>
                <td>${route.endPoint}</td>
                <td><button onclick="deleteRoute('${route._id}')" class="delete-btn">Delete</button></td>
            `;
            tbody.appendChild(row);
        });
    } catch (err) {
        console.error("Error loading routes:", err);
    }
}

/* ===============================
ROUTE DROPDOWN
================================ */

async function loadRouteDropdown() {
    try {
        const res = await fetch(API + "/api/route");
        const routes = await res.json();
        const dropdown = document.getElementById("busRoute");
        dropdown.innerHTML = `<option value="">Select Route</option>`;
        routes.forEach(route => {
            const opt = document.createElement("option");
            opt.value = route.routeName;
            opt.textContent = route.routeName;
            dropdown.appendChild(opt);
        });
    } catch (err) {
        console.error("Error loading route dropdown:", err);
    }
}

/* ===============================
ADD BUS
================================ */

async function addBus() {
    const number  = document.getElementById("busNumber").value.trim();
    const capacity= document.getElementById("busCapacity").value.trim();
    const route   = document.getElementById("busRoute").value;
    const dep     = document.getElementById("departureTime").value.trim();
    const arr     = document.getElementById("arrivalTime").value.trim();

    if (!number || !capacity || !dep || !arr) {
        alert("Fill all fields");
        return;
    }

    try {
        await fetch(API + "/api/bus", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ busNumber: number, capacity, routeName: route, departureTime: dep, arrivalTime: arr })
        });
        loadBuses();
        alert("Bus added successfully");
    } catch (err) {
        console.error("Error adding bus:", err);
    }
}

/* ===============================
DELETE BUS
================================ */

async function deleteBus(id) {
    if (!confirm("Delete this bus?")) return;
    await fetch(`${API}/api/bus/${id}`, { method: "DELETE" });
    loadBuses();
}

/* ===============================
ADD ROUTE
================================ */

async function addRoute() {
    const name  = document.getElementById("routeName").value.trim();
    const start = document.getElementById("routeStart").value.trim();
    const end   = document.getElementById("routeEnd").value.trim();

    if (!name) { alert("Enter route name"); return; }

    await fetch(API + "/api/route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ routeName: name, startPoint: start, endPoint: end })
    });

    loadRoutes();
    loadRouteDropdown();
    alert("Route added successfully");
}

/* ===============================
DELETE ROUTE
================================ */

async function deleteRoute(id) {
    if (!confirm("Delete this route?")) return;
    await fetch(`${API}/api/route/${id}`, { method: "DELETE" });
    loadRoutes();
    loadRouteDropdown();
}

/* ===============================
LOAD STUDENTS
================================ */

async function loadStudents() {
    try {
        const res      = await fetch(API + "/students");
        const students = await res.json();
        const tbody    = document.querySelector("#studentTable tbody");
        tbody.innerHTML = "";

        if (!students.length) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:#999;padding:30px;">No students registered yet</td></tr>`;
            return;
        }

        students.forEach(student => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${student.id || "-"}</td>
                <td>${student.name || student.username}</td>
                <td>${student.roll || "-"}</td>
                <td>${student.branch || "-"}</td>
                <td>${student.email || "-"}</td>
                <td>${student.phone || "-"}</td>
                <td><span class="status active">Active</span></td>
            `;
            tbody.appendChild(row);
        });
    } catch (err) {
        document.querySelector("#studentTable tbody").innerHTML =
            `<tr><td colspan="7" style="text-align:center;color:#e53935;padding:30px;">⚠️ Could not load students. Is the server running?</td></tr>`;
    }
}

/* ===============================
NOTIFICATION TYPE SELECTOR
================================ */

function selectType(type, el) {
    selectedType = type;
    document.querySelectorAll(".type-chip").forEach(c => {
        c.className = "type-chip"; // reset
    });
    el.classList.add(`selected-${type}`);
}

/* ===============================
SEND NOTIFICATION
================================ */

async function sendNotification() {
    const title   = document.getElementById("notifTitle").value.trim();
    const message = document.getElementById("notifMessage").value.trim();

    if (!title || !message) {
        alert("Please enter both title and message");
        return;
    }

    try {
        const res = await fetch(API + "/notifications", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, message, type: selectedType })
        });

        const data = await res.json();

        if (data.success) {
            document.getElementById("notifTitle").value   = "";
            document.getElementById("notifMessage").value = "";
            alert("✅ Notification sent to all students!");
            loadNotifications();
        }
    } catch (err) {
        alert("❌ Failed to send. Is the server running?");
    }
}

/* ===============================
LOAD SENT NOTIFICATIONS
================================ */

async function loadNotifications() {
    try {
        const res    = await fetch(API + "/notifications");
        const notifs = await res.json();
        const list   = document.getElementById("notifList");

        if (!notifs.length) {
            list.innerHTML = `<p class="notif-empty">No notifications sent yet</p>`;
            return;
        }

        list.innerHTML = "";

        notifs.forEach(n => {
            const icons = { info: "📘", warning: "⚠️", alert: "🚨" };
            const icon  = icons[n.type] || "📢";
            const time  = new Date(n.timestamp).toLocaleString("en-IN", {
                day: "numeric", month: "short", year: "numeric",
                hour: "2-digit", minute: "2-digit"
            });

            const div = document.createElement("div");
            div.className = `notif-item ${n.type === "info" ? "" : n.type}`;
            div.innerHTML = `
                <div class="notif-item-icon">${icon}</div>
                <div class="notif-item-body">
                    <div class="notif-item-title">${n.title}</div>
                    <div class="notif-item-msg">${n.message}</div>
                    <div class="notif-item-time">${time}</div>
                </div>
                <button class="notif-delete-btn" onclick="deleteNotification(${n.id})">Delete</button>
            `;
            list.appendChild(div);
        });

    } catch (err) {
        document.getElementById("notifList").innerHTML =
            `<p class="notif-empty" style="color:#e53935;">⚠️ Could not load notifications.</p>`;
    }
}

/* ===============================
DELETE NOTIFICATION
================================ */

async function deleteNotification(id) {
    if (!confirm("Delete this notification?")) return;
    await fetch(`${API}/notifications/${id}`, { method: "DELETE" });
    loadNotifications();
}

/* ===============================
LOGOUT
================================ */

function logout() {
    sessionStorage.clear();
    window.location.href = "index.html";
}

/* ===============================
PAGE LOAD
================================ */

document.addEventListener("DOMContentLoaded", () => {
    loadBuses();
    loadRoutes();
    loadRouteDropdown();
});