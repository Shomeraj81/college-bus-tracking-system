const socket = io("http://localhost:5000");

// ================= MAP INIT =================
var map = L.map("map").setView([20.353, 85.819], 15);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
}).addTo(map);


// ================= STUDENT LOCATION =================
let studentLat = null;
let studentLng = null;

navigator.geolocation.getCurrentPosition(function (position) {
    studentLat = position.coords.latitude;
    studentLng = position.coords.longitude;

    L.marker([studentLat, studentLng])
     .addTo(map)
     .bindPopup("You are here");
});


// ================= BUS ICON =================
var busIcon = L.icon({
    iconUrl: "https://toppng.com/uploads/preview/bus-top-view-clip-art-bus-icon-top-view-11562896756ifkgek2ydy.png",
    iconSize: [40, 40],
});

var busMarker = L.marker([20.353, 85.819], { icon: busIcon }).addTo(map);


// ================= SELECTED BUS =================
const activeBus = localStorage.getItem("selectedBusNumber");
if (activeBus) socket.emit("joinBus", activeBus);


// ================= SOCKET: BUS LOCATION =================
socket.on("busLocationUpdated", (bus) => {

    const lat = bus.lat;
    const lng = bus.lng;

    busMarker.setLatLng([lat, lng]);
    map.panTo([lat, lng]);

    document.getElementById("speed-display").innerText = bus.speed;

    if (studentLat && studentLng) {
        const distance = calculateDistance(studentLat, studentLng, lat, lng);
        let eta = (distance / bus.speed) * 60;

        if (distance < 0.02) {
            document.getElementById("eta-display").innerText      = "Arrived";
            document.getElementById("distance-display").innerText = "0";
        } else if (distance < 0.05) {
            document.getElementById("eta-display").innerText = "Arriving";
        } else {
            document.getElementById("eta-display").innerText      = eta.toFixed(1);
            document.getElementById("distance-display").innerText = distance.toFixed(2);
        }
    }
});


// ================= SOCKET: LIVE NOTIFICATIONS =================
let unreadCount = 0;

socket.on("newNotification", (notif) => {

    // Add to top of notifications container if section is open
    prependNotification(notif);

    // Increment badge
    unreadCount++;
    updateBadge();

    // Show toast popup
    showToast(`📢 ${notif.title}: ${notif.message}`, notif.type);

});


// ================= DISTANCE FUNCTION =================
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R    = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a    =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}


// ================= SECTION SWITCHING =================
function showSection(sectionId) {
    document.querySelectorAll(".content-section").forEach(s => s.classList.remove("active"));
    document.querySelectorAll(".nav-item").forEach(i => i.classList.remove("active"));
    document.getElementById(sectionId).classList.add("active");
    if (event && event.currentTarget) event.currentTarget.classList.add("active");
    if (sectionId === "notifications") {
        loadNotifications();
        unreadCount = 0;
        updateBadge();
    }
}

// Mobile bottom nav
function showSectionMobile(sectionId, el) {
    document.querySelectorAll(".content-section").forEach(s => s.classList.remove("active"));
    document.getElementById(sectionId).classList.add("active");
    document.querySelectorAll(".bottom-nav li").forEach(i => i.classList.remove("active"));
    el.classList.add("active");
    if (sectionId === "notifications") {
        loadNotifications();
        unreadCount = 0;
        updateBadge();
    }
}


// ================= NOTIFICATION BADGE =================
function updateBadge() {
    const badges = [
        document.getElementById("notifBadge"),
        document.getElementById("notifBadgeBottom")
    ];
    badges.forEach(badge => {
        if (!badge) return;
        if (unreadCount > 0) {
            badge.style.display = "inline-block";
            badge.innerText = unreadCount;
        } else {
            badge.style.display = "none";
        }
    });
}


// ================= LOAD NOTIFICATIONS FROM SERVER =================
async function loadNotifications() {
    const container = document.getElementById("notifContainer");
    container.innerHTML = "";

    try {
        const res    = await fetch("http://localhost:5000/notifications");
        const notifs = await res.json();

        if (!notifs.length) {
            container.innerHTML = `<p style="text-align:center;color:#aab0bc;padding:40px;">No notifications yet</p>`;
            return;
        }

        notifs.forEach(n => container.appendChild(buildNotifCard(n)));

    } catch (err) {
        container.innerHTML = `<p style="text-align:center;color:#e53935;padding:40px;">⚠️ Could not load notifications</p>`;
    }
}


// ================= BUILD NOTIFICATION CARD =================
function buildNotifCard(n) {

    const icons = { info: "📘", warning: "⚠️", alert: "🚨" };
    const icon  = icons[n.type] || "📢";

    const time = new Date(n.timestamp).toLocaleString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit"
    });

    const card = document.createElement("div");
    card.className = `notification-card ${n.type === "info" ? "unread" : ""}`;
    card.style.borderLeft = n.type === "warning" ? "3px solid #FFC107"
                          : n.type === "alert"   ? "3px solid #e91e63"
                          : "3px solid #1b8f3a";

    card.innerHTML = `
        <div class="notification-icon">${icon}</div>
        <div class="notification-content">
            <p class="notification-title">${n.title}</p>
            <p class="notification-text">${n.message}</p>
            <span class="notification-time">${time}</span>
        </div>
    `;

    return card;
}


// ================= PREPEND SINGLE NOTIFICATION (live) =================
function prependNotification(n) {
    const container = document.getElementById("notifContainer");
    // If "no notifications" placeholder is showing, clear it
    if (container.querySelector("p")) container.innerHTML = "";
    container.prepend(buildNotifCard(n));
}


// ================= ROUTE SEARCH =================
async function searchBus() {
    const from = document.getElementById("fromLocation").value;
    const to   = document.getElementById("toLocation").value;

    const res = await fetch(
        `http://localhost:5000/api/buses/schedule?from=${from}&to=${to}`
    );

    const buses    = await res.json();
    const tableBody = document.querySelector(".schedule-table tbody");

    if (!Array.isArray(buses) || buses.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No buses found</td></tr>`;
        return;
    }

    tableBody.innerHTML = "";

    buses.forEach(bus => {
        tableBody.innerHTML += `
            <tr class="bus-row" data-busid="${bus._id}" data-busnumber="${bus.busNumber}">
                <td class="bus-id">🚌 ${bus.busNumber}</td>
                <td>${bus.from} → ${bus.to}</td>
                <td>${bus.departure}</td>
                <td>${bus.arrival}</td>
                <td><span class="badge ontime">On Time</span></td>
            </tr>
        `;
    });

    enableBusClicks();
}


// ================= ENABLE BUS CLICK =================
function enableBusClicks() {
    document.querySelectorAll(".bus-row").forEach(row => {
        row.addEventListener("click", async function () {
            const busId     = this.dataset.busid;
            const busNumber = this.dataset.busnumber;

            localStorage.setItem("selectedBusId",     busId);
            localStorage.setItem("selectedBusNumber",  busNumber);

            showToast(`🚌 Bus ${busNumber} selected. Starting tracking...`, "info");

            try {
                const res = await fetch(`http://localhost:5000/api/buses/track/${busId}`);
                await res.json();
            } catch {
                console.log("Backend not reachable");
            }

            setTimeout(() => showSection("tracking"), 1500);
        });
    });
}


// ================= RESET SEARCH =================
function resetSearch() {
    document.getElementById("fromLocation").value = "";
    document.getElementById("toLocation").value   = "";
    document.querySelector(".schedule-table tbody").innerHTML =
        `<tr><td colspan="5" style="text-align:center;">Search to view buses</td></tr>`;
}


// ================= LOAD PROFILE =================
function loadProfile() {
    const name     = sessionStorage.getItem("name")     || "—";
    const username = sessionStorage.getItem("username")  || "—";
    const roll     = sessionStorage.getItem("roll")      || "—";
    const branch   = sessionStorage.getItem("branch")    || "—";
    const email    = sessionStorage.getItem("email")     || "—";
    const phone    = sessionStorage.getItem("phone")     || "—";

    document.getElementById("prof_name").innerText     = name;
    document.getElementById("prof_username").innerText = username;
    document.getElementById("prof_roll").innerText     = roll;
    document.getElementById("prof_branch").innerText   = branch;
    document.getElementById("prof_email").innerText    = email;
    document.getElementById("prof_phone").innerText    = phone;

    // Set avatar initials
    const avatar = document.getElementById("profileAvatar");
    const initials = name !== "—"
        ? name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
        : username[0].toUpperCase();
    avatar.innerText = initials;

    // Bus info from localStorage (set when student picks a bus)
    const busNumber = localStorage.getItem("selectedBusNumber");
    if (busNumber) {
        document.getElementById("prof_bus").innerText = busNumber;
    }
}


// ================= LOGOUT =================
function logout() {
    sessionStorage.clear();
    window.location.href = "index.html";
}


// ================= TOAST =================
function showToast(message, type) {
    const container = document.getElementById("toast-container");
    const toast     = document.createElement("div");

    const colors = {
        info:    "border-left-color: #1b8f3a;",
        warning: "border-left-color: #FFC107;",
        alert:   "border-left-color: #e91e63;"
    };

    toast.className = "toast";
    toast.style.cssText = colors[type] || colors.info;
    toast.innerText = message;

    container.appendChild(toast);

    setTimeout(() => toast.remove(), 4000);
}


// ================= PAGE LOAD =================
document.addEventListener("DOMContentLoaded", () => {

    // Set bus number in tracking panel
    const busDisplay = document.getElementById("bus-number");
    if (busDisplay && activeBus) busDisplay.innerText = activeBus;

    // Load profile from session
    loadProfile();

    // Load notifications initially
    loadNotifications();
});