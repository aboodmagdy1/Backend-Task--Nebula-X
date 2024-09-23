const path = require("path");
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");

const ApiError = require("./utils/apiError.class");
const globalErrorHandler = require("./middlewares/errorHandling.middleware");
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
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

// 404 Routes
app.all("*", (req, res, next) => {
  next(new ApiError(404, ` Cant Find This Route : ${req.originalUrl} `));
});

// Global error handler
app.use(globalErrorHandler);

const server = app.listen(port, () => {
  console.log(`Mode : ${process.env.NODE_ENV}`);
  console.log(`Server is running on port ${port}`);
});

// Event : unhandled Rejection Error [outside express like : DB connection ,...]
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  // to shut down any pending requests
  server.close(() => {
    console.error("UNHANDLED REJECTION! Shutting down...");
    process.exit(1);
  });
});
