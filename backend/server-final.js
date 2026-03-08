const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const http = require("http");
const { Server } = require("socket.io");

const busRoutes = require("./routes/buses");
const locationRoutes = require("./routes/location");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

app.use(cors());
app.use(express.json());

/* ==========================
   MONGODB CONNECTION
========================== */

mongoose.connect("mongodb://127.0.0.1:27017/kiit_bus")
.then(()=>{
    console.log("MongoDB Connected");
})
.catch(err=>{
    console.log("MongoDB Error:", err);
});


/* ==========================
   ROOT API
========================== */

app.get("/", (req, res) => {
  res.send("KIIT Bus Tracker API is running");
});


/* ==========================
   BUS ROUTES
========================== */

app.use("/api/buses", busRoutes);
app.use("/api", locationRoutes(io));


/* ==========================
   SOCKET CONNECTION
========================== */

io.on("connection",(socket)=>{

    socket.on("joinBus",(busNumber)=>{

        socket.join(busNumber);
        console.log("Student joined room:",busNumber);

    });

});


/* ==========================
   SERVER START
========================== */

server.listen(5000, () => {
  console.log("Server running on port 5000");
});