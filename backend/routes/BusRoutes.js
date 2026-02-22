const mongoose = require("mongoose");

const BusRoutesSchema = new mongoose.Schema({

    bus: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bus",
        required: true
    },

    route: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Route",
        required: true
    },

    path: [{
        lat: Number,
        lng: Number
    }],

    departureTime: String,

    isRunning: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

module.exports = mongoose.model("BusRoutes", BusRoutesSchema);