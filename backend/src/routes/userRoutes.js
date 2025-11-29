const express = require("express");
const router = express.Router();
const User = require("../models/User");

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// CREATE new user
router.post("/", async (req, res) => {
  try {
    const { username, password, role } = req.body;

    await User.create({
      username,
      password,
      role: role || "cashier",
    });

    res.json({ message: "User created" });
  } catch (err) {
    console.error("User create error:", err);
    res.status(400).json({ message: "Failed to create user" });
  }
});

// DELETE user
router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(400).json({ message: "Failed to delete user" });
  }
});

module.exports = router;
