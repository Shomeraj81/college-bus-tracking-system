function login() {
  let role = document.getElementById("role").value;
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;

  // Simple validation
  if (username === "" || password === "") {
    alert("Please enter username and password");
    return;
  }

  // ===================
  // ROLE BASED REDIRECT
  // ===================

  if (role === "student") {
    // Redirect to student dashboard
    window.location.href = "student.html";
  } else if (role === "admin") {
    // Redirect to admin dashboard
    window.location.href = "admin.html";
  }
}
