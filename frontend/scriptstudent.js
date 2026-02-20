// ================= MAP INIT =================
var map = L.map("map").setView([20.353, 85.819], 15);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

// ================= BUS OBJECT =================
let bus = {
  id: "KIIT-07",
  speed: 70,
  currentIndex: 0,
  isRunning: false,
  remainingDistance: 0,
  eta: 0,
};

// ================= ROUTE =================
var route = [
  [20.356628, 85.820006],
  [20.356645, 85.81933],
  [20.356327, 85.819306],
  [20.356492, 85.815765],
  [20.363803, 85.816287],
];

L.polyline(route, { color: "blue" }).addTo(map);

// ================= BUS ICON =================
var busIcon = L.icon({
  iconUrl:
    "https://toppng.com/uploads/preview/bus-top-view-clip-art-bus-icon-top-view-11562896756ifkgek2ydy.png",
  iconSize: [40, 40],
});

var busMarker = L.marker(route[0], { icon: busIcon }).addTo(map);

// ================= DISTANCE =================
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

// ================= MOVEMENT =================
let animationRef;

function moveBus() {
  if (!bus.isRunning) return;

  if (bus.currentIndex >= route.length - 1) {
    bus.currentIndex = 0;
  }

  var start = route[bus.currentIndex];
  var end = route[bus.currentIndex + 1];

  let steps = 100;
  let step = 0;

  let lat = start[0];
  let lng = start[1];

  let latStep = (end[0] - start[0]) / steps;
  let lngStep = (end[1] - start[1]) / steps;

  animationRef = setInterval(() => {
    lat += latStep;
    lng += lngStep;

    busMarker.setLatLng([lat, lng]);
    map.panTo([lat, lng]);

    let finalPoint = route[route.length - 1];

    bus.remainingDistance = calculateDistance(
      lat,
      lng,
      finalPoint[0],
      finalPoint[1],
    );

    bus.eta = (bus.remainingDistance / bus.speed) * 60;

    document.getElementById("speed-display").innerText = bus.speed;
    document.getElementById("distance-display").innerText =
      bus.remainingDistance.toFixed(2);
    document.getElementById("eta-display").innerText = bus.eta.toFixed(1);

    step++;

    if (step >= steps) {
      clearInterval(animationRef);
      bus.currentIndex++;
      moveBus();
    }
  }, 20);
}

// ================= START / PAUSE =================
function toggleBus() {
  if (!bus.isRunning) {
    bus.isRunning = true;
    moveBus();
  } else {
    bus.isRunning = false;
    clearInterval(animationRef);
  }
}
