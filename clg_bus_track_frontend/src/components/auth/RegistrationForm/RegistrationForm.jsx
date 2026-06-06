import React, { useState } from "react";
import "./RegistrationForm.css";
import {registerUser} from "../../../services/authService";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

function RegistrationForm({ open, handleClose }) {
  const [formData, setFormData] = useState({
    fullName: "",
    rollNumber: "",
    email: "",
    phone: "",
    branch: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

   
    try {
      const response = await registerUser(formData);
        console.log(response);
    if(response.success) {
      // Handle successful registration
      console.log("Registration successful!");
     
    } else {
      // Handle registration error
      console.log("Registration failed:", response.message);
      
    }
    } catch (error) {
      console.error("Registration failed:", error);
    }
    
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="registration-modal"
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: {
            xs: "90%",
            sm: 500,
          },
          bgcolor: "background.paper",
          borderRadius: 3,
          boxShadow: 24,
          p: 4,
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          align="center"
          sx={{ mb: 3 }}
        >
          🎓 Student Registration
        </Typography>

        <TextField
          fullWidth
          label="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Roll Number"
          name="rollNumber"
          value={formData.rollNumber}
          onChange={handleChange}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Phone Number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Branch"
          name="branch"
          value={formData.branch}
          onChange={handleChange}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          margin="normal"
        />

        <Stack
  direction="row"
  spacing={2}
  sx={{ mt: 3 }}
>
  <Button
  variant="contained"
  fullWidth
  onClick={handleClose}
  sx={{
    backgroundColor: "white",
    color: "#22a63d",

    "&:hover": {
      backgroundColor: "#f5f5f5",
    },
  }}
>
  Cancel
</Button>

  <Button
    type="submit"
    variant="contained"
    fullWidth
    sx={{
      backgroundColor: "#22a63d",
      fontWeight: "bold",
    }}
  >
    Register
  </Button>
</Stack>
      </Box>
    </Modal>
  );
}

export default RegistrationForm;