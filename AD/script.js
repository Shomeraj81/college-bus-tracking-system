// Step 1: Create Map
var map = L.map('map').setView([20.3530, 85.8190], 15);

// Step 2: Add Tile Layer (Map Design)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Custom Bus Icon
var busIcon = L.icon({
    iconUrl: 'https://toppng.com/uploads/preview/bus-top-view-clip-art-bus-icon-top-view-11562896756ifkgek2ydy.png',
    iconSize: [40, 40]
});

// Add Marker
var busMarker = L.marker([20.3530, 85.8190], { icon: busIcon }).addTo(map);

var route = [
    [20.356628,85.820006],
    [20.356645,85.819330],
    [20.356327,85.819306],
    [20.356492,85.815765],
    [20.363803,85.816287]
];

var polyline = L.polyline(route, { color: 'blue' }).addTo(map);

var i = 0;

function moveBus() {
    if (i < route.length) {
        busMarker.setLatLng(route[i]);
        i++;
    } else {
        i = 0; // restart route
    }
}

setInterval(moveBus, 3000);

/*let map;
let busMarker;
let routePath;
let i = 0;

// Predefined Route Coordinates (Simulated GPS Path)
const route = [
  { lat: 20.3530, lng: 85.8190 },
  { lat: 20.3540, lng: 85.8200 },
  { lat: 20.3550, lng: 85.8210 },
  { lat: 20.3560, lng: 85.8220 },
  { lat: 20.3570, lng: 85.8230 }
];

// This function is automatically called by Google Maps API
function initMap() {

  // Center Map at KIIT
  const kiitLocation = { lat: 20.3530, lng: 85.8190 };

  // Create Map
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    center: kiitLocation,
  });

  // Create Bus Marker
  busMarker = new google.maps.Marker({
    position: kiitLocation,
    map: map,
    title: "KIIT Bus - Route 1",
    icon: {
      url: "https://maps.google.com/mapfiles/kml/shapes/bus.png",
      scaledSize: new google.maps.Size(40, 40)
    }
  });

  // Draw Route Line
  routePath = new google.maps.Polyline({
    path: route,
    geodesic: true,
    strokeColor: "#0000FF",
    strokeOpacity: 1.0,
    strokeWeight: 4,
  });

  routePath.setMap(map);

  // Auto fit map to route
  const bounds = new google.maps.LatLngBounds();
  route.forEach(coord => bounds.extend(coord));
  map.fitBounds(bounds);

  // Start Bus Movement
  startBusMovement();
}


// Function to Move Bus
function startBusMovement() {
  setInterval(() => {

    if (i < route.length) {
      busMarker.setPosition(route[i]);
      i++;
    } else {
      i = 0; // Restart route
    }

  }, 3000); // Move every 3 seconds
}*/

