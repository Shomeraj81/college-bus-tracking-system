const mongoose = require("mongoose");

const RouteSchema = new mongoose.Schema({

    routeName: {
        type: String,
        required: true,
        unique: true
    },

    startPoint: {
        type: String,
        required: true
    },

    endPoint: {
        type: String,
        required: true
    },

    stops: [{
        name: String,
        lat: Number,
        lng: Number
    }]

}, { timestamps: true });

module.exports = mongoose.model("Route", RouteSchema);