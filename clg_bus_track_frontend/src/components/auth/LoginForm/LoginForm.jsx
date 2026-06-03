import React, { useState } from "react";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

function LoginForm(role) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();

        console.log({
            username,
            password
        });

        // API call will go here later
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
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
            />

            <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
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