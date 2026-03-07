const express = require("express")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

let users = [
{
username:"admin",
password:"admin123",
role:"admin"
}
]



/* ================= SIGNUP ================= */

app.post("/signup",(req,res)=>{

const {username,password,role} = req.body

if(users.find(u=>u.username===username)){
return res.json({success:false})
}

users.push({
username,
password,
role
})

console.log("New student registered:",username)

res.json({success:true})

})



/* ================= LOGIN ================= */

app.post("/login",(req,res)=>{

const {username,password} = req.body

let user = users.find(
u=>u.username===username && u.password===password
)

if(!user){
return res.json({success:false})
}

res.json({
success:true,
role:user.role
})

})



/* ================= GET STUDENTS ================= */

app.get("/students",(req,res)=>{

let students = users.filter(u=>u.role==="student")

res.json(students)

})



app.listen(3000,()=>{
console.log("Server running on port 3000")
})