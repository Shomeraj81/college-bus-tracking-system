const express = require("express");
const router = express.Router();

const Bus = require("../models/bus");
const Route = require("../models/route");

// Search buses
router.get("/schedule", async (req, res) => {

  try {

    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({ error: "from and to required" });
    }

    const routes = await Route.find({
      startPoint: { $regex: from, $options: "i" },
      endPoint: { $regex: to, $options: "i" }
    });

    const routeNames = routes.map(r => r.routeName);

    const buses = await Bus.find({
      routeName: { $in: routeNames }
    });

    const schedule = buses.map(bus => {
      const route = routes.find(r => r.routeName === bus.routeName);

      return {
        _id: bus._id,
        busNumber: bus.busNumber,
        from: route.startPoint,
        to: route.endPoint,
        departure: bus.departureTime,
        arrival: bus.arrivalTime
      };
    });

    res.json(schedule);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});

// Track bus
router.get("/track/:id", async (req, res) => {

  try {

    const bus = await Bus.findById(req.params.id);

    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    res.json(bus);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});
module.exports = router;