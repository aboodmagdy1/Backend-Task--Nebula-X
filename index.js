require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const ApiError = require("./utils/apiError.class");
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

// 404 Routes
app.all("*", (req, res, next) => {
  next(new ApiError(404, ` Cant Find This Route : ${req.originalUrl} `));
});

// Global error handler
app.use((error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  res.status(error.statusCode).json({
    status: error.status,
    error,
    message: error.message,
    stack: error.stack,
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
