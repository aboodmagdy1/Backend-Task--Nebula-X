require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const productRoutes = require("./routes/product.routes");
const cartRoutes = require("./routes/cart.routes");
const connectDB = require("./configs/database");
const app = express();
const port = process.env.PORT || 3000;

// DB
connectDB();

// API Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
