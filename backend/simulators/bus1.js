const axios = require("axios");

const busNumber = "KL-01-1000";

let lat = 20.355537;
let lng = 85.820702;

setInterval(async () => {

  lat += 0.0002;
  lng += 0.0002;

  try {
    await axios.post("http://localhost:5000/api/update-location", {
      busNumber,
      lat,
      lng,
      speed: 35
    });

    console.log(busNumber, lat, lng);

  } catch (err) {
    console.log(err.message);
  }

}, 3000);