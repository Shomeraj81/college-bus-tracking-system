const axios = require("axios");

const busNumber = "KL-02-1100";

let lat = 20.354190; // campus 4
let lng = 85.820210;

setInterval(async () => {

  lat += 0.00015;
  lng += 0.00015;

  try {
    await axios.post("http://localhost:5000/api/update-location", {
      busNumber,
      lat,
      lng,
      speed: 40
    });

    console.log(busNumber, lat, lng);

  } catch (err) {
    console.log(err.message);
  }

}, 3000);