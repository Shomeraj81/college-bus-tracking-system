const buses = require("../data/buses");

exports.searchBuses = (req, res) => {
  const { from, to } = req.query;

  const filtered = buses.filter((bus) => {
    return (
      bus.from.toLowerCase().includes(from.toLowerCase()) &&
      bus.to.toLowerCase().includes(to.toLowerCase())
    );
  });

  const busIds = filtered.map((bus) => bus.id);

  res.json(busIds);
};
