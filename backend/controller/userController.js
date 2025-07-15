const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const register = async (req, res) => {
  const { name, email, password,role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = new User({ name, email, password: hashedPassword, role});    
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user._id ,role: user.role}, process.env.JWT_SECRET);
  res.json({ token, user });
};

const getUsers = async (req, res) => {
  if (req.user.role === "admin") {
    const users = await User.find().select("-password");
    return res.json(users);
  } else {
    const user = await User.findById(req.user.id).select("-password");
    return res.json([user]);
  }
};

const deleteUser = async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Unauthorized" });
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
};

module.exports = {
  register,
  login,
  getUsers,
  deleteUser,
};
