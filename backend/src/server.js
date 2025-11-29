const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();


const app = express(); // ✅ app must be created BEFORE using it

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");



app.use("/api/auth", authRoutes);       // login / register
app.use("/api/products", productRoutes); // food list
app.use("/api/orders", orderRoutes);     // order history / create order
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/users", require("./routes/userRoutes"));



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
