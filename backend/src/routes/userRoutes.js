const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// GET all users (ADMIN ONLY)
router.get("/", protect, isAdmin, async (req, res) => {
  const users = await User.find({}, { password: 0 });
  res.json(users);
});

// CREATE new user (ADMIN ONLY)
router.post("/", protect, isAdmin, async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const exists = await User.findOne({ username });
  if (exists) {
    return res.status(400).json({ message: "Username already exists" });
  }

  const user = await User.create({
    username,
    password,
    role: role || "cashier",
  });

  res.status(201).json({
    _id: user._id,
    username: user.username,
    role: user.role,
  });
});

// DELETE user (ADMIN ONLY)
router.delete("/:id", protect, isAdmin, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});


module.exports = router;
