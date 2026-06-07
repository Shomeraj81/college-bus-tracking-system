import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../../services/authService";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

function LoginForm(role) {
    const navigate = useNavigate();

    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    });
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await loginUser(credentials);
            console.log(response);
            if (response.success) {
                console.log("Login successful!");
                localStorage.setItem(
                    "token",
                    response.token
                );

                localStorage.setItem(
                    "user",
                    JSON.stringify(response.user)
                );

                if (response.user.role === "student") {
                   navigate("/student-dashboard");
                } else {
                    navigate("/admin-dashboard");
                }
            } else {
                console.log("Login failed:", response.message);
            }
            console.log(response);
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <Box
            component="form"
            onSubmit={handleLogin}
            sx={{
                mt: 3,
                display: "flex",
                flexDirection: "column",
                gap: 3
            }}
        >

            <TextField
                label="Username"
                variant="outlined"
                fullWidth
                value={credentials.username}
                onChange={handleChange}
                name="username"
                placeholder="Enter username"
            />

            <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                value={credentials.password}
                onChange={handleChange}
                name="password"
                placeholder="Enter password"
            />

            <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                    backgroundColor: "#22a63d",

                    fontWeight: "bold"
                }}
            >
                Login
            </Button>

        </Box>
    );
}

export default LoginForm;