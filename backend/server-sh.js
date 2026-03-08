const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const http = require("http");
const { Server } = require("socket.io");

const busRoutes = require("./routes/busRoutes");
const buses = require("./routes/buses");
const locationRoutes = require("./routes/location");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

/* ==========================
   MIDDLEWARE
========================== */

app.use(cors());
app.use(express.json());

/* ==========================
   MONGODB CONNECTION
========================== */

mongoose.connect("mongodb://127.0.0.1:27017/kiit_bus")
.then(()=>{
    console.log("✅ MongoDB Connected");
})
.catch(err=>{
    console.log("❌ MongoDB Error:", err);
});

/* ==========================
   ROOT API
========================== */

app.get("/", (req, res) => {
  res.send("🚍 KIIT Bus Tracker API Running");
});

/* ==========================
   ROUTES
========================== */

app.use("/api", busRoutes);       // schedule routes
app.use("/api/buses", buses);     // bus search
app.use("/api", locationRoutes(io)); // realtime location

/* ==========================
   SOCKET CONNECTION
========================== */

io.on("connection",(socket)=>{

    console.log("User Connected");

    socket.on("joinBus",(busNumber)=>{
        socket.join(busNumber);
        console.log("Student joined bus room:", busNumber);
    });

});

let users = [
{
username:"admin",
password:"admin123",
role:"admin"
}
]



/* ================= SIGNUP ================= */

app.post("/signup",(req,res)=>{

const {username,password,role} = req.body

if(users.find(u=>u.username===username)){
return res.json({success:false})
}

users.push({
username,
password,
role
})

console.log("New student registered:",username)

res.json({success:true})

})



/* ================= LOGIN ================= */

app.post("/login",(req,res)=>{

const {username,password} = req.body

let user = users.find(
u=>u.username===username && u.password===password
)

if(!user){
return res.json({success:false})
}

res.json({
success:true,
role:user.role
})

})



/* ================= GET STUDENTS ================= */

app.get("/students",(req,res)=>{

let students = users.filter(u=>u.role==="student")

res.json(students)

})

/* ==========================
   SERVER START
========================== */

const PORT = 5000;

server.listen(PORT, ()=>{
    console.log(`🚀 Server running on port ${PORT}`);
});