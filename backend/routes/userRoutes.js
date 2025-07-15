const express = require("express");
const { register, login, getUsers, deleteUser } = require("../controller/userController");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/users", auth, getUsers);
router.delete("/users/:id", auth, deleteUser);

module.exports = router;
