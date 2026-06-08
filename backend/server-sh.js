require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const http = require("http");
const { Server } = require("socket.io");

const busRoutes = require("./routes/busRoutes");
const buses = require("./routes/buses");
const locationRoutes = require("./routes/location");

const jwt = require("jsonwebtoken");
const auth = require("./middlewares/auth");
const User = require("./models/users");
const bcrypt = require("bcryptjs");
const {validate} = require("./middlewares/signupSchema.js");

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
    .then(() => {
        console.log("✅ MongoDB Connected");
    })
    .catch(err => {
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

io.on("connection", (socket) => {

    console.log("User Connected");

    socket.on("joinBus", (busNumber) => {
        socket.join(busNumber);
        console.log("Student joined bus room:", busNumber);
    });

});


function generateToken(user) {
    return jwt.sign(
        {
            userId: user._id,
            role: user.role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d",
        }
    );
}


/* ================= SIGNUP ================= */
app.post("/signup", validate, async(req, res) => {
    try {
        const {
            fullName,
            rollNumber,
            email,
            phone,
            password,
        } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = new User({
            fullName,
            rollNumber,
            email,
            phone,
            password: hashedPassword,
            role: "student",
        });
        await user.save();
        const token = generateToken(user);

        return res.status(201).json({
            success: true,
            message: "Registration successful",
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
    
});



/* ================= LOGIN ================= */

app.post("/login", async (req, res) => {
    try {
        console.log(req.body);
        const { username, password } = req.body;
        const email = username; // Assuming username is the email
        const user = await User.findOne({ email });
        console.log(user);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const token = generateToken(user);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,                
                role: user.role,
            },
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});



/* ================= GET STUDENTS ================= */

app.get("/students", (req, res) => {

    let students = users.filter(u => u.role === "student")

    res.json(students)

})

/* ==========================
   SERVER START
========================== */

const PORT = 5000;

server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(process.env.JWT_SECRET);
});