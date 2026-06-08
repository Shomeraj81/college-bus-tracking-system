const signupSchema = require("../schema.js");
const User = require("../models/users");

module.exports.validate = (req,res,next)=>{
    const { error } = signupSchema.validate(req.body);
        console.log("Validation result:", error ? "Negative" : "Positive");
        if(error){
            console.log(error.details);
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        next();
};



