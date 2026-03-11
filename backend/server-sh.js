const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const http = require("http");
const { Server } = require("socket.io");

const busRoutes = require("./routes/busRoutes");
const buses = require("./routes/buses");
const locationRoutes = require("./routes/location");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: "*" }
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
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ MongoDB Error:", err));

/* ==========================
   ROOT API
========================== */

app.get("/", (req, res) => {
    res.send("🚍 KIIT Bus Tracker API Running");
});

/* ==========================
   ROUTES
========================== */

app.use("/api", busRoutes);
app.use("/api/buses", buses);
app.use("/api", locationRoutes(io));

/* ==========================
   SOCKET CONNECTION
========================== */

io.on("connection", (socket) => {

    console.log("User Connected:", socket.id);

    socket.on("joinBus", (busNumber) => {
        socket.join(busNumber);
        console.log("Student joined bus room:", busNumber);
    });

});

/* ==========================
   FILE HELPERS — USERS
========================== */

const USERS_FILE = path.join(__dirname, "users.json");

function loadUsers() {
    try {
        const data = fs.readFileSync(USERS_FILE, "utf8");
        return JSON.parse(data);
    } catch {
        return [{
            id: 1,
            username: "admin",
            password: "admin123",
            role: "admin",
            name: "Admin"
        }];
    }
}

function saveUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
}

let users = loadUsers();
console.log(`📋 Loaded ${users.length} user(s) from users.json`);

/* ==========================
   FILE HELPERS — NOTIFICATIONS
========================== */

const NOTIF_FILE = path.join(__dirname, "notifications.json");

function loadNotifications() {
    try {
        const data = fs.readFileSync(NOTIF_FILE, "utf8");
        return JSON.parse(data);
    } catch {
        return [];
    }
}

function saveNotifications(notifs) {
    fs.writeFileSync(NOTIF_FILE, JSON.stringify(notifs, null, 2), "utf8");
}

/* ================= SIGNUP ================= */

app.post("/signup", (req, res) => {

    const { name, roll, email, phone, branch, username, password, role } = req.body;

    if (!username || !password) {
        return res.json({ success: false, message: "Missing fields" });
    }

    if (users.find(u => u.username === username)) {
        return res.json({ success: false, message: "Username already exists" });
    }

    const newUser = {
        id:       users.length + 1,
        username,
        password,
        role:     role   || "student",
        name:     name   || username,
        roll:     roll   || "",
        email:    email  || "",
        phone:    phone  || "",
        branch:   branch || ""
    };

    users.push(newUser);
    saveUsers(users);

    console.log("✅ New student registered:", username);
    res.json({ success: true });

});

/* ================= LOGIN ================= */

app.post("/login", (req, res) => {

    const { username, password } = req.body;

    users = loadUsers(); // always fresh

    const user = users.find(
        u => u.username === username && u.password === password
    );

    if (!user) {
        return res.json({ success: false });
    }

    res.json({
        success:  true,
        role:     user.role,
        id:       user.id,
        username: user.username,
        name:     user.name   || "",
        roll:     user.roll   || "",
        email:    user.email  || "",
        phone:    user.phone  || "",
        branch:   user.branch || ""
    });

});

/* ================= GET ALL STUDENTS ================= */

app.get("/students", (req, res) => {
    users = loadUsers();
    const students = users.filter(u => u.role === "student");
    res.json(students);
});

/* ================= NOTIFICATIONS — GET ================= */

app.get("/notifications", (req, res) => {
    const notifs = loadNotifications();
    res.json([...notifs].reverse()); // newest first
});

/* ================= NOTIFICATIONS — POST (Admin sends) ================= */

app.post("/notifications", (req, res) => {

    const { title, message, type } = req.body;

    if (!title || !message) {
        return res.json({ success: false, message: "Title and message required" });
    }

    const notifs = loadNotifications();

    const newNotif = {
        id:        Date.now(),
        title,
        message,
        type:      type || "info",  // info | warning | alert
        timestamp: new Date().toISOString()
    };

    notifs.push(newNotif);
    saveNotifications(notifs);

    // 🔴 Broadcast live to all connected students
    io.emit("newNotification", newNotif);

    console.log("📢 Notification sent:", title);
    res.json({ success: true, notification: newNotif });

});

/* ================= NOTIFICATIONS — DELETE ================= */

app.delete("/notifications/:id", (req, res) => {

    let notifs = loadNotifications();
    notifs = notifs.filter(n => n.id !== parseInt(req.params.id));
    saveNotifications(notifs);

    res.json({ success: true });

});

/* ==========================
   SERVER START
========================== */

const PORT = 5000;

server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});