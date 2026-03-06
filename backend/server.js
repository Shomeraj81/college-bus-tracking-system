const express = require("express");
const cors = require("cors");

const busRoutes = require("./routes/buses");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/buses", busRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
