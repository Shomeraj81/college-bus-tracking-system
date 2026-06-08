const Joi = require("joi");

const signupSchema = Joi.object({
    fullName: Joi.string()
        .min(3)
        .max(30)
        .required(),

    email: Joi.string()
        .email()
        .required(),
    
    rollNumber: Joi.string()
        .required(),

    password: Joi.string()
        .min(6)
        .max(50)
        .required(),

    role: Joi.string()
        .valid("student", "admin")
        .required(),

    phone: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .required()
});
console.log("Schema loaded successfully");
module.exports = signupSchema;