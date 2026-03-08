const API = "http://localhost:5000"


// ================= SIGN UP =================

async function signup(){

let username = document.getElementById("username").value
let password = document.getElementById("password").value

if(username==="" || password===""){
alert("Please fill all fields")
return
}

let res = await fetch(API+"/signup",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
username,
password,
role:"student"
})

})

let data = await res.json()

if(data.success){

alert("Signup successful! Now login.")

}else{

alert("User already exists")

}

}



// ================= LOGIN =================

async function login(){

let username = document.getElementById("username").value
let password = document.getElementById("password").value
let role = document.getElementById("role").value

if(username==="" || password===""){
alert("Enter username and password")
return
}

let res = await fetch(API+"/login",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
username,
password
})

})

let data = await res.json()

if(!data.success){

alert("Invalid credentials")
return

}

sessionStorage.setItem("role",data.role)

if(data.role==="admin"){

window.location.href="admin2.html"

}else{

window.location.href="student.html"

}

}