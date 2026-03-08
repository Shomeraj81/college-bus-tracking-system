// ================= MAP INIT =================
var map = L.map("map").setView([20.353, 85.819], 15);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

// ================= SELECTED BUS =================
const activeBus = localStorage.getItem("selectedBus");

console.log("Tracking bus:", activeBus);

// ================= BUS OBJECT =================
let bus = {
  id: activeBus || "KIIT-07",
  speed: 70,
  currentIndex: 0,
  isRunning: false,
  remainingDistance: 0,
  eta: 0,
};

// update bus number on UI
document.addEventListener("DOMContentLoaded", () => {
  const busDisplay = document.getElementById("bus-number");
  if (busDisplay) {
    busDisplay.innerText = bus.id;
  }
});

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

// ================= SECTION SWITCHING =================
function showSection(sectionId) {
  document
    .querySelectorAll(".content-section")
    .forEach((section) => section.classList.remove("active"));

  document.getElementById(sectionId).classList.add("active");
}

// ================= ROUTE SEARCH =================
async function searchBus() {
  const from = document.getElementById("fromLocation").value;
  const to = document.getElementById("toLocation").value;

  const res = await fetch(
    `http://localhost:5000/api/buses/schedule?from=${from}&to=${to}`,
  );

  const buses = await res.json();

  console.log("API Result:", buses);

  const tableBody = document.querySelector(".schedule-table tbody");

  tableBody.innerHTML = "";

  buses.forEach((bus) => {
    const row = `
<tr class="bus-row" data-busid="${bus._id}">
<td class="bus-id">🚌 ${bus.busNumber}</td>
<td>${bus.from} → ${bus.to}</td>
<td>${bus.departure}</td>
<td>${bus.arrival}</td>
<td>
<span class="badge ${bus.status === "On Time" ? "ontime" : "delay"}">
${bus.status}
</span>
</td>
</tr>
`;

    tableBody.innerHTML += row;
  });

  enableBusClicks();
}

// ================= ENABLE BUS CLICK =================
function enableBusClicks() {
  document.querySelectorAll(".bus-row").forEach((row) => {
    row.addEventListener("click", async function () {
      const busId = this.dataset.busid;

      console.log("Selected Bus ID:", busId);

      localStorage.setItem("selectedBus", busId);

      showBusSelectionMessage(busId);

      try {
        const res = await fetch(
          `http://localhost:5000/api/buses/track/${busId}`,
        );

        const data = await res.json();

        console.log(data.message);
      } catch {
        console.log("Backend not reachable");
      }

      setTimeout(() => {
        showSection("tracking");
      }, 1500);
    });
  });
}

// ================= RESET SEARCH =================
function resetSearch() {
  document.getElementById("fromLocation").value = "";
  document.getElementById("toLocation").value = "";

  const tableBody = document.querySelector(".schedule-table tbody");

  tableBody.innerHTML = `
<tr>
<td colspan="5">Search to view buses</td>
</tr>
`;
}

// ================= PAGE LOAD =================
document.addEventListener("DOMContentLoaded", () => {
  enableBusClicks();
});

// ================= MESSAGE =================
function showBusSelectionMessage(busId) {
  const container = document.getElementById("toast-container");

  const toast = document.createElement("div");
  toast.className = "toast toast-success";

  toast.innerText = `🚌 Bus ${busId} selected. Starting tracking...`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}
