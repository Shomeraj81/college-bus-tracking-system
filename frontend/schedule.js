function goBack() {
    window.location.href = "student.html";
}

function findBus() {

    let fromInput = document.getElementById("fromLocation").value.toLowerCase();
    let toInput = document.getElementById("toLocation").value.toLowerCase();
    let timeFilter = document.getElementById("timeFilter").value;

    let table = document.getElementById("scheduleTable");
    let rows = table.getElementsByTagName("tr");

    for (let i = 1; i < rows.length; i++) {

        let from = rows[i].getElementsByTagName("td")[1].innerText.toLowerCase();
        let to = rows[i].getElementsByTagName("td")[2].innerText.toLowerCase();
        let departureTime = rows[i].getElementsByTagName("td")[3].innerText;

        let hour = parseInt(departureTime.split(":")[0]);

        let matchLocation =
            (from.includes(fromInput) || fromInput === "") &&
            (to.includes(toInput) || toInput === "");

        let matchTime = true;

        if (timeFilter === "morning") {
            matchTime = hour >= 6 && hour < 12;
        } else if (timeFilter === "afternoon") {
            matchTime = hour >= 12 && hour < 18;
        }

        if (matchLocation && matchTime) {
            rows[i].style.display = "";
        } else {
            rows[i].style.display = "none";
        }
    }
}