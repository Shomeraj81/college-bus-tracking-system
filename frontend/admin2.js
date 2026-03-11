/* ===============================
SECTION NAVIGATION
================================ */

function showSection(sectionId) {

    document.querySelectorAll(".dashboard-section").forEach(section=>{
        section.classList.remove("active");
    });

    document.getElementById(sectionId).classList.add("active");

    document.querySelectorAll(".nav-item").forEach(item=>{
        item.classList.remove("active");
    });

    document.querySelector(`[href="#${sectionId}"]`).classList.add("active");
}


/* ===============================
LOAD BUSES FROM DATABASE
================================ */

async function loadBuses(){

    const res = await fetch("http://localhost:5000/api/bus");
    const buses = await res.json();

    const tableBody = document.querySelector("#busTable tbody");
    tableBody.innerHTML = "";

    buses.forEach(bus => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${bus.busNumber}</td>
            <td>${bus.capacity}</td>
            <td>${bus.routeName}</td>
            <td>${bus.departureTime}</td>
            <td>${bus.arrivalTime}</td>
            <td><span class="status active">Active</span></td>
            <td>
                <button onclick="deleteBus('${bus._id}')" class="delete-btn">Delete</button>
            </td>
        `;

        tableBody.appendChild(row);

    });

}

/* ===============================
LOAD ROUTES FROM DATABASE
================================ */

async function loadRoutes(){

    const res = await fetch("http://localhost:5000/api/route");
    const routes = await res.json();

    const tableBody = document.querySelector("#routeTable tbody");

    tableBody.innerHTML = "";

    routes.forEach(route => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${route.routeName}</td>
            <td>${route.startPoint}</td>
            <td>${route.endPoint}</td>
            
            <td>
                <button onclick="deleteRoute('${route._id}')" class="delete-btn">Delete</button>
            </td>
        `;

        tableBody.appendChild(row);

    });

}
//load route dropdown
async function loadRouteDropdown(){

    const res = await fetch("http://localhost:5000/api/route");
    const routes = await res.json();

    const dropdown = document.getElementById("busRoute");

    dropdown.innerHTML = `<option value="">Select Route</option>`;

    routes.forEach(route => {

        const option = document.createElement("option");

        option.value = route.routeName;
        option.textContent = route.routeName;

        dropdown.appendChild(option);

    });

}

/* ===============================
ADD BUS (CONNECTED TO BACKEND)
================================ */

async function addBus(){

    let number = document.getElementById("busNumber").value;
    let capacity = document.getElementById("busCapacity").value;
    let route = document.getElementById("busRoute").value;

    let departureTime = document.getElementById("departureTime").value;
    let arrivalTime = document.getElementById("arrivalTime").value;

    if(number==="" || capacity==="" || departureTime==="" || arrivalTime===""){
        alert("Fill all fields");
        return;
    }

    try{

        const response = await fetch("http://localhost:5000/api/bus",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                busNumber:number,
                capacity:capacity,
                routeName:route,
                departureTime:departureTime,
                arrivalTime:arrivalTime
            })

        });

        await response.json();

        loadBuses();

        alert("Bus added successfully");

    }catch(error){

        console.error("Error adding bus:", error);

    }

}

/* ===============================
DELETE BUS
================================ */

async function deleteBus(id){

    if(!confirm("Delete this bus?")) return;

    await fetch(`http://localhost:5000/api/bus/${id}`,{
        method:"DELETE"
    });

    loadBuses();

}


/* ===============================
ADD ROUTE (CONNECTED TO BACKEND)
================================ */

async function addRoute(){

    let name = document.getElementById("routeName").value;
    let start = document.getElementById("routeStart").value;
    let end = document.getElementById("routeEnd").value;

    if(name === ""){
        alert("Enter route name");
        return;
    }

    await fetch("http://localhost:5000/api/route",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({
            routeName:name,
            startPoint:start,
            endPoint:end
        })

    });

    loadRoutes();
   // table.appendChild(row);

    loadRouteDropdown();

    alert("Route added successfully");

}


/* ===============================
DELETE ROUTE
================================ */

async function deleteRoute(id){

    if(!confirm("Delete this route?")) return;

    await fetch(`http://localhost:5000/api/route/${id}`,{
        method:"DELETE"
    });

    loadRoutes();
    loadRouteDropdown();

}




/* ===============================
EDIT / DELETE BUTTONS (UI)
================================ */

function attachRowEvents(row){

    let editBtn = row.querySelector(".edit-btn");
    let deleteBtn = row.querySelector(".delete-btn");

    editBtn.onclick = function(){

        let cells = row.querySelectorAll("td");

        for(let i=0;i<cells.length-1;i++){

            let old = cells[i].innerText;

            cells[i].innerHTML =
            `<input value="${old}" style="width:90%">`;

        }

        editBtn.innerText="Save";

        editBtn.onclick=function(){

            let inputs=row.querySelectorAll("input");

            inputs.forEach(input=>{
                input.parentElement.innerText=input.value;
            });

            editBtn.innerText="Edit";

            attachRowEvents(row);

        };

    };

    deleteBtn.onclick=function(){

        if(confirm("Delete this row?")){
            row.remove();
        }

    };

}
/* ================= LOAD STUDENTS ================= */
const API = "http://localhost:5000"
async function loadStudents(){

try{

let res = await fetch(API + "#students")

let students = await res.json()

let table = document.querySelector("#studentTable tbody")

table.innerHTML=""

students.forEach((student,i)=>{

let row = `
<tr>
<td>${2000+i}</td>
<td>${student.username}</td>
<td>Not Assigned</td>
<td>Not Assigned</td>
<td><span class="status active">Active</span></td>
</tr>
`

table.innerHTML += row

})

}
catch(err){

console.log("Error loading students:",err)

}

}

/* ===============================
LOGOUT
================================ */

function logout(){

    sessionStorage.clear();
    window.location.href="index.html";

}


/* ===============================
INITIAL PAGE LOAD
================================ */

document.addEventListener("DOMContentLoaded",()=>{

    loadBuses();
    loadRoutes();
    loadRouteDropdown(); 
    loadStudents();

});