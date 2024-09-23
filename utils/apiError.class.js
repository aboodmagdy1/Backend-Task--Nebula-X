class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error"; // from 400 to 499 is fail, from 500 to 599 is error
    this.isOperational = true; // Errors that i can predict [ i handle it in development]
  }
}

module.exports = ApiError;
