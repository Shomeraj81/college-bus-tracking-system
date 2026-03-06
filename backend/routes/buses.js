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

module.exports = router;
