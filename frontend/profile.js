let isEditing = false;

function toggleEdit() {

    let email = document.getElementById("email");
    let phone = document.getElementById("phone");
    let hostel = document.getElementById("hostel");
    let studentId = document.getElementById("studentId");

    if (!isEditing) {

        email.innerHTML = `<input type="text" value="${email.innerText}" id="emailInput">`;
        phone.innerHTML = `<input type="text" value="${phone.innerText}" id="phoneInput">`;
        hostel.innerHTML = `<input type="text" value="${hostel.innerText}" id="hostelInput">`;
        studentId.innerHTML = `<input type="text" value="${studentId.innerText}" id="studentIdInput">`;

        document.querySelector(".edit-btn").innerText = "Save Changes";
        isEditing = true;

    } else {

        let newEmail = document.getElementById("emailInput").value;
        let newPhone = document.getElementById("phoneInput").value;
        let newHostel = document.getElementById("hostelInput").value;
        let newStudentId = document.getElementById("studentIdInput").value;

        email.innerText = newEmail;
        phone.innerText = newPhone;
        hostel.innerText = newHostel;
        studentId.innerText = newStudentId;

        document.querySelector(".edit-btn").innerText = "Edit Profile";
        isEditing = false;

        alert("Profile Updated Successfully!");
    }
}