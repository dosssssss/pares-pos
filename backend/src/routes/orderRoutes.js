const express = require("express");
const router = express.Router();
const { createOrder, getOrders, getMonthlyReport } = require("../controllers/orderController");

// Create order
router.post("/", createOrder);

// Get orders (with optional date filter)
router.get("/", getOrders);

// Monthly report
router.get("/monthly", getMonthlyReport);

module.exports = router;
