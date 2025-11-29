const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  items: [
    {
      name: String,
      price: Number,
      qty: Number,
    }
  ],
  total: Number,
  cash: Number,
  change: Number,
  cashier: String,

  date: {
    type: Date,
    default: Date.now
  },

  time: {
    type: String,
    default: () => {
      const now = new Date();
      return now.toLocaleTimeString("en-US", { hour12: false });
    }
  }
});

module.exports = mongoose.model("Order", orderSchema);
