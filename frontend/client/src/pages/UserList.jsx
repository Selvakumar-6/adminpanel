import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import API from "../services/api";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import MyAppBar from "../components/AppBar";
import Footer from "../components/Footer";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const fetchUsers = async () => {
    const res = await API.get("/users");
    setUsers(res.data);
    const tokenData = JSON.parse(
      atob(localStorage.getItem("token").split(".")[1])
    );
    setCurrentUser(tokenData);
  };

  const deleteUser = async (id) => {
    await API.delete(`/users/${id}`);
    fetchUsers();
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(users);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    const blob = new Blob(
      [XLSX.write(workbook, { bookType: "xlsx", type: "array" })],
      { type: "application/octet-stream" }
    );
    saveAs(blob, "users.xlsx");
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <MyAppBar />
        <Box flex="1" p={2}>
          <TableContainer component={Paper} sx={{ marginTop: 4 }}>
            <Typography variant="h5" sx={{ m: 2 }}>
              User List
            </Typography>
            {currentUser?.role === "admin" && (
              <Button variant="contained" sx={{ m: 2 }} onClick={downloadExcel}>
                Download Excel
              </Button>
            )}
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Last Online</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      {user.lastOnline
                        ? new Date(user.lastOnline).toLocaleString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.status}
                        color={user.status === "active" ? "success" : "error"}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton color="primary">
                        <VisibilityIcon />
                      </IconButton>
                      {currentUser?.role === "admin" && (
                        <IconButton
                          color="error"
                          onClick={() => deleteUser(user._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Footer />
      </Box>
    </>
  );
}
