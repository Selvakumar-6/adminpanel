import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { Box, Button, Container, TextField, Typography } from "@mui/material";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/users");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
    >
      <Container maxWidth="sm">
        <Typography variant="h2" textAlign={"center"} color="primary">
          emilus
        </Typography>
        <Box mt={5} display="flex" flexDirection="column" gap={2}>
          <Typography variant="h4">Login</Typography>
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
          />
          <Button variant="contained" color="primary" onClick={handleLogin}>
            Login
          </Button>
        </Box>
        <Typography variant="h5">
          Don't have an account yet?
          <Link to="/register"> Sign Up</Link>
        </Typography>{" "}
      </Container>
    </Box>
  );
}
