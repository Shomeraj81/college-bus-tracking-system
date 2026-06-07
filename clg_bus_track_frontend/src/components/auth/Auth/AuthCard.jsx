import React from "react";
import { useState } from "react";
import "./AuthCard.css";
import LoginForm from "../LoginForm/LoginForm.jsx";
import RegistrationForm from "../RegistrationForm/RegistrationForm.jsx";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { AdUnits } from "@mui/icons-material";

export default function AuthCard() {
    const [selectedRole, setSelectedRole] = useState("student");
    const switchRole = (role) => () => {
        if (role === "student") {
            setSelectedRole("student");

        } else {
            setSelectedRole("admin");
        }
    };

    const [isLogin, setIsLogin] = useState(false);

    const Login = () => {
        setIsLogin(!isLogin);
        
    }

    const [isRegistration, setIsRegistration] = useState(false);

    const Registration = () => {
        setIsRegistration(!isRegistration);        
    }
    
    

    return (
        <Card className="signup-login-card" style={{ opacity: 1 }}>
            <CardContent>

                {/* Heading */}
                <Typography
                    variant="h6"
                    align="center"
                    fontWeight="bold"
                    style={{ width: '70%', justifySelf: 'center' }}
                >
                    WELCOME!
                </Typography>

                {/* Toggle Buttons */}
                <Box className="role-toggle">
                    <Button

                        variant={
                            selectedRole === "student"
                                ? "contained"
                                : "outlined"
                        }
                        className="student-btn"
                        onClick={switchRole("student")}
                        style={
                            selectedRole === "student"
                                ? { backgroundColor: "#22a63d", color: "white" }
                                : { color: "#22a63d" }
                        }
                    >
                        🎓 Student
                    </Button>

                    <Button
                        variant={
                            selectedRole === "admin"
                                ? "contained"
                                : "outlined"
                        }
                        className="admin-btn"
                        onClick={switchRole("admin")}
                        style={
                            selectedRole === "admin"
                                ? { backgroundColor: "#22a63d", color: "white" }
                                : { color: "#22a63d" }
                        }
                    >
                        🔐 Admin
                    </Button>
                </Box>

                {selectedRole === "student" && (      
                    <>
                        {/* Description */}
                <Typography
                    variant="body2"
                    align="center"
                    className="description"
                >
                    New here? Register to track your bus,
                    <br />
                    view schedules and get notifications.
                </Typography>

                {/* Sign Up Button */}
                <Button
                    variant="contained"
                    fullWidth
                    className="signup-btn"
                    onClick={Registration}
                >
                    Sign Up
                </Button>
                {isRegistration && <RegistrationForm open={isRegistration}
    handleClose={() => setIsRegistration(false)} />}

                {/* Login Link */}
                <Typography
                    variant="body2"
                    align="center"
                    className="login-text"
                >
                    Already have an account?{" "}
                    <span className="login-link" onClick={Login}>
                        Login here
                    </span>
                    {isLogin && <LoginForm />}
                </Typography>
                    </>
                
                )}

                {selectedRole === "admin" && (
                    <LoginForm /> 
                )}

                {/* Description */}
            </CardContent>
        </Card>
    );
}