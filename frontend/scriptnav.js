// ======================================
// 1️⃣ MAP INITIALIZATION
// ======================================
var map = L.map('map').setView([20.3530, 85.8190], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);


// ======================================
// 2️⃣ BUS STATE OBJECT
// ======================================
let bus = {
    id: "KIIT-07",
    speed: 70, // km/h
    currentIndex: 0,
    isRunning: false,
    remainingDistance: 0,
    eta: 0
};


// ======================================
// 3️⃣ ROUTE DATA
// ======================================
var route = [
    [20.356628,85.820006],
    [20.356645,85.819330],
    [20.356327,85.819306],
    [20.356492,85.815765],
    [20.363803,85.816287]
];

L.polyline(route, { color: 'blue' }).addTo(map);


// ======================================
// 4️⃣ BUS ICON & MARKER
// ======================================
var busIcon = L.icon({
    iconUrl: 'https://toppng.com/uploads/preview/bus-top-view-clip-art-bus-icon-top-view-11562896756ifkgek2ydy.png',
    iconSize: [40, 40],
    iconAnchor: [20, 20]
});

var busMarker = L.marker(route[0], { icon: busIcon }).addTo(map);


// ======================================
// 5️⃣ DISTANCE FUNCTION (HAVERSINE)
// ======================================
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}


// ======================================
// 6️⃣ MOVEMENT ENGINE
// ======================================
let animationRef;

function moveBus() {

    if (!bus.isRunning) return;

    if (bus.currentIndex >= route.length - 1) {
        bus.currentIndex = 0; // Restart
    }

    var start = route[bus.currentIndex];
    var end = route[bus.currentIndex + 1];

    var steps = 100;
    var step = 0;

    var latStep = (end[0] - start[0]) / steps;
    var lngStep = (end[1] - start[1]) / steps;

    var lat = start[0];
    var lng = start[1];

    animationRef = setInterval(function () {

        lat += latStep;
        lng += lngStep;

        busMarker.setLatLng([lat, lng]);

        // Auto follow camera
        map.panTo([lat, lng]);

        // 🔥 Calculate distance from CURRENT position to FINAL destination
        var finalPoint = route[route.length - 1];

        bus.remainingDistance = calculateDistance(
            lat, lng,
            finalPoint[0], finalPoint[1]
        );

        // Prevent negative value
        if (bus.remainingDistance < 0) {
            bus.remainingDistance = 0;
        }

        // ETA calculation
        bus.eta = (bus.remainingDistance / bus.speed) * 60;

        // Update UI
        document.getElementById("speed-display").innerText = bus.speed;
        document.getElementById("distance-display").innerText =
            bus.remainingDistance.toFixed(2);
        document.getElementById("eta-display").innerText =
            bus.eta.toFixed(1);

        step++;

        if (step >= steps) {
            clearInterval(animationRef);
            bus.currentIndex++;
            moveBus();
        }

    }, 20);
}


// ======================================
// 7️⃣ START / PAUSE CONTROL
// ======================================
function toggleBus() {
    if (!bus.isRunning) {
        bus.isRunning = true;
        moveBus();
    } else {
        bus.isRunning = false;
        clearInterval(animationRef);
    }
}
