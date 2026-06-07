const mongoose = require("mongoose");

const busSchema = new mongoose.Schema({

    busNumber: {
        type: String,
        required: true,
        unique: true
    },

    capacity: {
        type: Number,
        required: true
    },

    routeName: {
        type: String,
        ref: "Route",
        required: true
    },

    departureTime: {
        type: String,
        required: true
    },

    arrivalTime: {
        type: String,
        required: true
    }

},{timestamps:true});

module.exports = mongoose.model("Bus", busSchema);