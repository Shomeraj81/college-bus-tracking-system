const mongoose = require("mongoose");

const GPSSchema = new mongoose.Schema({

  busNumber: {
    type: String,
    required: true,
    unique: true
  },

  lat: {
    type: Number,
    required: true
  },

  lng: {
    type: Number,
    required: true
  },

  speed: {
    type: Number,
    default: 0
  },

  timestamp: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("GPS", GPSSchema);