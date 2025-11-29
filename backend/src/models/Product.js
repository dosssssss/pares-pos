const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: {
      type: String,
      required: true,
      enum: ["PARES", "GOTO", "SOLO", "ADD-ONS", "DRINKS"]
    },
    isActive: { type: Boolean, default: true } // Admin can turn ON/OFF
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
