const express = require("express");
const router = express.Router();

const Bus = require("../models/bus");
const Route = require("../models/route");


/* ================================
BUS ROUTES
================================ */


/* GET ALL BUSES */

router.get("/bus", async (req, res) => {

    try {

        const buses = await Bus.find();

        res.json(buses);

    } catch (error) {

        res.status(500).json({
            message: "Error fetching buses",
            error: error.message
        });

    }

});


/* ADD BUS */

router.post("/bus", async (req, res) => {

    try {

        const bus = new Bus({

            busNumber: req.body.busNumber,
            capacity: req.body.capacity,
            routeName: req.body.routeName,
            departureTime: req.body.departureTime,
            arrivalTime: req.body.arrivalTime


        });

        const savedBus = await bus.save();

        res.json(savedBus);

        console.log(req.body);

    } catch (error) {

        res.status(500).json({
            message: "Error adding bus",
            error: error.message
        });

    }

});


/* DELETE BUS */

router.delete("/bus/:id", async (req, res) => {

    try {

        await Bus.findByIdAndDelete(req.params.id);

        res.json({
            message: "Bus deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: "Error deleting bus",
            error: error.message
        });

    }

});



/* ================================
ROUTE ROUTES
================================ */


/* GET ALL ROUTES */

router.get("/route", async (req, res) => {

    try {

        const routes = await Route.find();

        res.json(routes);

    } catch (error) {

        res.status(500).json({
            message: "Error fetching routes",
            error: error.message
        });

    }

});


// ADD ROUTE
router.post("/route", async (req, res) => {

    try {

        const route = new Route({
            routeName: req.body.routeName,
            startPoint: req.body.startPoint,
            endPoint: req.body.endPoint
        });

        const savedRoute = await route.save();

        res.json(savedRoute);

    } catch (error) {

        res.status(500).json({ error: error.message });

    }

});



/* DELETE ROUTE */

// DELETE ROUTE
router.delete("/route/:id", async (req, res) => {

    try {

        await Route.findByIdAndDelete(req.params.id);

        res.json({ message: "Route deleted" });

    } catch (error) {

        res.status(500).json({ error: error.message });

    }

});

module.exports = router;