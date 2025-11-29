// controllers/orderController.js

const Order = require("../models/Order");

// ===============================
// Save New Order
// ===============================
exports.createOrder = async (req, res) => {
  try {
    const { items, total, cash, change, cashier } = req.body;

    // Philippine Date & Time
    const nowPH = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Manila",
    });

    const iso = new Date(nowPH).toISOString(); // Save as ISO in DB

    const order = new Order({
      items,
      total,
      cash,
      change,
      cashier,
      date: iso,         // full timestamp
      time: iso,         // optional separate field (if your model requires it)
    });

    const saved = await order.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Order Error:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

// ===============================
// Get Orders (with optional ?date=YYYY-MM-DD)
// ===============================
exports.getOrders = async (req, res) => {
  try {
    const { date } = req.query;

    let filter = {};

    if (date) {
      // 🎯 Convert selected date into Philippine range
      const start = new Date(`${date}T00:00:00+08:00`);
      const end = new Date(`${date}T23:59:59+08:00`);

      filter.date = { $gte: start, $lte: end };
    }

    const orders = await Order.find(filter).sort({ date: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Get Orders Error:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};
