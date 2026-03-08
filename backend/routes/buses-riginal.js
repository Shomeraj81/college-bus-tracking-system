const express = require("express");
const router = express.Router();

const buses = require("../data/buses");

// Search buses
router.get("/search", (req, res) => {
  const { from, to } = req.query;

  const results = buses.filter(
    (bus) =>
      bus.from.toLowerCase().includes(from.toLowerCase()) &&
      bus.to.toLowerCase().includes(to.toLowerCase()),
  );

  res.json(results);
});

// Track bus
router.get("/track/:id", (req, res) => {
  const busId = req.params.id;

  console.log("Tracking request received for:", busId);

  res.json({
    message: `Now tracking bus ${busId}`,
  });
});

module.exports = router;
