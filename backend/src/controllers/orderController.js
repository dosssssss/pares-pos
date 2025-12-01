const Order = require("../models/Order");

// Create Order
exports.createOrder = async (req, res) => {
  try {
    const { items, total, cash, change, cashier } = req.body;

    // Convert to PH Time
    const nowPH = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" })
    );

    // YYYY-MM-DD
    const date = nowPH.toISOString().split("T")[0];

    // HH:mm:ss
    const time = nowPH.toTimeString().split(" ")[0];

    const order = await Order.create({
      items,
      total,
      cash,
      change,
      cashier,
      date,
      time,
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get orders (Admin & Counter)
exports.getOrders = async (req, res) => {
  try {
    const { date } = req.query;

    let filter = {};
    if (date) filter.date = date;

    const orders = await Order.find(filter).sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("GET ORDERS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// Monthly Report
exports.getMonthlyReport = async (req, res) => {
  try {
    const orders = await Order.find({});
    const monthlyTotals = {};

    orders.forEach((order) => {
      const monthKey = order.date.slice(0, 7);

      if (!monthlyTotals[monthKey]) {
        monthlyTotals[monthKey] = 0;
      }

      monthlyTotals[monthKey] += order.total;
    });

    res.json(monthlyTotals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
