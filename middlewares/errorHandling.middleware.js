// For Development Errors
const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    error: err,
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
};

// For production Errors
const sendProdError = (err, res) => {
  res.status(err.statusCode).json({ status: err.status, message: err.message });
};

module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";
  error.message = error.message || "no err message";

  if (process.env.NODE_ENV === "development") {
    sendDevError(error, res);
  } else {
    sendProdError(error, res);
  }
};
