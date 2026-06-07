const axios = require("axios");

const busNumber = "KL-01-1200";

let lat = 20.346375; //campus 1
let lng = 85.823578;

setInterval(async () => {

  lat += 0.00018;
  lng += 0.00012;

  try {
    await axios.post("http://localhost:5000/api/update-location", {
      busNumber,
      lat,
      lng,
      speed: 30
    });

    console.log(busNumber, lat, lng);

  } catch (err) {
    console.log(err.message);
  }

}, 3000);