const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// GET all users (ADMIN ONLY)
router.get("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const users = await User.find({}, "-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});


// CREATE new user (ADMIN ONLY)
router.post("/", protect, isAdmin, async (req, res) => {
  try {
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
      password, // plain text → bcrypt in model
      role: role || "cashier",
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      role: user.role,
    });
  } catch (err) {
    console.error("CREATE USER ERROR:", err);
    res.status(500).json({
      message: "Server error creating user",
      error: err.message,
    });
  }
});

// DELETE user (ADMIN ONLY)
router.delete("/:id", protect, isAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error("DELETE USER ERROR:", err);
    res.status(500).json({ message: "Failed to delete user" });
  }
});

module.exports = router;
