import { Box, Typography } from "@mui/material";
import React from "react";

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#1976d2",
        color: "#fff",
        padding: "1rem",
        marginTop: "auto",
        textAlign: "center",
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} Knock Digital Technologies | MERN Task Demo
      </Typography>
    </Box>
  );
};

export default Footer;