import { AppBar, Toolbar, Typography } from "@mui/material";
import React from "react";

const MyAppBar = () => {
  return (
    <AppBar position="static" color="primary" sx={{ margin: "0" }}>
      <Toolbar sx={{ justifyContent: "center" }}>
        <Typography variant="h6" component="div" align="center">
          Knock Digital Technologies
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default MyAppBar;
