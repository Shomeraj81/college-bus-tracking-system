const mongoose = require("mongoose");

const BusSchema = new mongoose.Schema({
    busNumber: {
        type: String,
        required: true,
        unique: true
    },

    capacity: {
        type: Number,
        required: true
    },

    driverName: {
        type: String,
        required: true
    },

    route: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Route"
    },

    currentLocation: {
        lat: { type: Number, default: 0 },
        lng: { type: Number, default: 0 }
    },

    speed: {
        type: Number,
        default: 0
    },

    status: {
        type: String,
        enum: ["ACTIVE", "INACTIVE"],
        default: "ACTIVE"
    }

}, { timestamps: true });

module.exports = mongoose.model("Bus", BusSchema);