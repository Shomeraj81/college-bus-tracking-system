const API = "http://localhost:3000"



/* ================= SECTION NAVIGATION ================= */

function showSection(sectionId){

document.querySelectorAll(".dashboard-section").forEach(section=>{
section.style.display="none"
})

document.getElementById(sectionId).style.display="block"

}



/* ================= LOAD STUDENTS ================= */

async function loadStudents(){

try{

let res = await fetch(API + "/students")

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



/* ================= PAGE LOAD ================= */

document.addEventListener("DOMContentLoaded",()=>{

loadStudents()

})



/* ================= LOGOUT ================= */

function logout(){

sessionStorage.clear()
window.location.href="index.html"

}