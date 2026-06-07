const express = require("express");
const router = express.Router();

const GPS = require("../models/gps");

module.exports = (io) => {

router.post("/update-location", async (req, res) => {

    const { busNumber, lat, lng, speed } = req.body;

    try {

        const gps = await GPS.findOneAndUpdate(
            { busNumber: busNumber },
            {
                lat: lat,
                lng: lng,
                speed: speed
            },
            { new: true, upsert: true }   // create if not exists
        );

        // send realtime update
        io.to(busNumber).emit("busLocationUpdated", gps);

        res.json({
            message: "Location updated",
            gps
        });

        console.log("GPS RECEIVED:", busNumber, lat, lng);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});

return router;

};