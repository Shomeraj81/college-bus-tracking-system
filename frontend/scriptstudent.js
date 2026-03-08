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

  console.log("Student location:", studentLat, studentLng);

  L.marker([studentLat, studentLng])
    .addTo(map)
    .bindPopup("You are here");
});


// ================= BUS ICON =================
var busIcon = L.icon({
  iconUrl:
    "https://toppng.com/uploads/preview/bus-top-view-clip-art-bus-icon-top-view-11562896756ifkgek2ydy.png",
  iconSize: [40, 40],
});


// ================= BUS MARKER =================
var busMarker = L.marker([20.353, 85.819], { icon: busIcon }).addTo(map);


// ================= SELECTED BUS =================
const activeBus = localStorage.getItem("selectedBusNumber");
socket.emit("joinBus", activeBus);

console.log("Tracking bus:", activeBus);


// ================= SOCKET LISTENER =================
socket.on("busLocationUpdated",(bus)=>{

  

   console.log("Selected bus update:", bus);
  const lat = bus.lat;
  const lng = bus.lng;

  // move bus marker
  busMarker.setLatLng([lat, lng]);

  // follow bus
  map.panTo([lat, lng]);

  // update speed
  document.getElementById("speed-display").innerText = bus.speed;

  // calculate ETA if student location exists
  if (studentLat && studentLng) {

    const distance = calculateDistance(
      studentLat,
      studentLng,
      lat,
      lng
    );

    let eta = (distance / bus.speed) * 60;

    if (distance < 0.02) {

      document.getElementById("eta-display").innerText = "Arrived";
      document.getElementById("distance-display").innerText = "0";

    } else if (distance < 0.05) {

      document.getElementById("eta-display").innerText = "Arriving";

    } else {

      document.getElementById("eta-display").innerText = eta.toFixed(1);
      document.getElementById("distance-display").innerText =
        distance.toFixed(2);

    }
  }
});


// ================= DISTANCE FUNCTION =================
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
    `http://localhost:5000/api/buses/schedule?from=${from}&to=${to}`
  );

  const buses = await res.json();

  const tableBody = document.querySelector(".schedule-table tbody");

  if (!Array.isArray(buses) || buses.length === 0) {
    tableBody.innerHTML =
      `<tr><td colspan="5">No buses found</td></tr>`;
    return;
  }

  tableBody.innerHTML = "";

  buses.forEach((bus) => {
    const row = `
<tr class="bus-row" data-busid="${bus._id}" data-busnumber="${bus.busNumber}">
<td class="bus-id">🚌 ${bus.busNumber}</td>
<td>${bus.from} → ${bus.to}</td>
<td>${bus.departure}</td>
<td>${bus.arrival}</td>
<td><span class="badge ontime">On Time</span></td>
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
      const busNumber = this.dataset.busnumber;

      localStorage.setItem("selectedBusId", busId);
      localStorage.setItem("selectedBusNumber", busNumber);

      console.log("Selected Bus ID:", busId);

      showBusSelectionMessage(busId);

      try {
        const res = await fetch(
          `http://localhost:5000/api/buses/track/${busId}`
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

  tableBody.innerHTML =
    `<tr><td colspan="5">Search to view buses</td></tr>`;
}


// ================= PAGE LOAD =================
document.addEventListener("DOMContentLoaded", () => {

  const busDisplay = document.getElementById("bus-number");

  if (busDisplay && activeBus) {
      busDisplay.innerText = activeBus;
  }

});


// ================= MESSAGE =================
function showBusSelectionMessage(busId) {
  const container = document.getElementById("toast-container");

  const toast = document.createElement("div");
  toast.className = "toast toast-success";

  toast.innerText =
    `🚌 Bus ${busId} selected. Starting tracking...`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}