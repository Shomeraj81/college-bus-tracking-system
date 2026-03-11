const API = "http://localhost:5000";

let currentRole = "student";


// ================= ROLE TAB SWITCH =================

function switchRole(role) {
    currentRole = role;

    // Update tab styles
    document.querySelectorAll(".role-tab").forEach(tab => tab.classList.remove("active"));
    event.currentTarget.classList.add("active");

    // Show correct panel
    document.getElementById("studentPanel").style.display = role === "student" ? "block" : "none";
    document.getElementById("adminPanel").style.display   = role === "admin"   ? "block" : "none";

    // Reset student login form when switching tabs
    if (role === "student") {
        document.getElementById("studentLoginForm").classList.remove("open");
    }
}


// ================= STUDENT LOGIN TOGGLE =================

function toggleStudentLogin() {
    const form = document.getElementById("studentLoginForm");
    form.classList.toggle("open");
}


// ================= MODAL CONTROLS =================

function openSignupModal() {
    document.getElementById("signupModal").classList.add("open");
}

function closeSignupModal() {
    document.getElementById("signupModal").classList.remove("open");
    ["sig_name","sig_roll","sig_email","sig_phone","sig_branch","sig_username","sig_password"]
        .forEach(id => document.getElementById(id).value = "");
}


// ================= SIGN UP =================

async function signup() {

    const name     = document.getElementById("sig_name").value.trim();
    const roll     = document.getElementById("sig_roll").value.trim();
    const email    = document.getElementById("sig_email").value.trim();
    const phone    = document.getElementById("sig_phone").value.trim();
    const branch   = document.getElementById("sig_branch").value.trim();
    const username = document.getElementById("sig_username").value.trim();
    const password = document.getElementById("sig_password").value.trim();

    if (!name || !roll || !email || !username || !password) {
        alert("Please fill all required fields (marked with *)");
        return;
    }

    const res = await fetch(API + "/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, roll, email, phone, branch, username, password, role: "student" })
    });

    const data = await res.json();

    if (data.success) {
        alert("Registration successful! You can now login.");
        closeSignupModal();
        // Open student login form and pre-fill username
        document.getElementById("studentLoginForm").classList.add("open");
        document.getElementById("username").value = username;
    } else {
        alert(data.message || "Username already exists. Try another.");
    }

}


// ================= LOGIN =================

async function login() {

    // Get credentials from whichever panel is active
    let username, password;

    if (currentRole === "admin") {
        username = document.getElementById("adminUsername").value.trim();
        password = document.getElementById("adminPassword").value.trim();
    } else {
        username = document.getElementById("username").value.trim();
        password = document.getElementById("password").value.trim();
    }

    if (!username || !password) {
        alert("Enter username and password");
        return;
    }

    const res = await fetch(API + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!data.success) {
        alert("Invalid credentials");
        return;
    }

    // Save full profile to sessionStorage
    sessionStorage.setItem("role",     data.role);
    sessionStorage.setItem("id",       data.id      || "");
    sessionStorage.setItem("username", data.username || "");
    sessionStorage.setItem("name",     data.name     || "");
    sessionStorage.setItem("roll",     data.roll     || "");
    sessionStorage.setItem("email",    data.email    || "");
    sessionStorage.setItem("phone",    data.phone    || "");
    sessionStorage.setItem("branch",   data.branch   || "");

    if (data.role === "admin") {
        window.location.href = "admin2.html";
    } else {
        window.location.href = "student.html";
    }

}