// ===============================
// NAVIGATION CONTROLLER
// ===============================

function navigateTo(section) {

    // Remove active class from all nav items
    let navItems = document.querySelectorAll(".nav-links li");
    navItems.forEach(item => item.classList.remove("active"));

    // Add active class to clicked item
    event.target.classList.add("active");

    // Page redirection logic
    switch(section) {

        case "tracking":
            window.location.href = "student.html";
            break;

        case "schedule":
            window.location.href = "schedule.html";
            break;

        case "notifications":
            window.location.href = "notification.html";
            break;

        case "profile":
            window.location.href = "profile.html";
            break;

        case "settings":
            window.location.href = "settings.html";
            break;

        default:
            console.log("Section not found");
    }
}


// ===============================
// LOGOUT BUTTON
// ===============================

document.querySelector(".logout-btn").addEventListener("click", function () {

    if(confirm("Are you sure you want to logout?")) {
        window.location.href = "index.html";
    }

});


