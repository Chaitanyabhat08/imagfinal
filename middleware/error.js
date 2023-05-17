const ErrorHandler = require('../utils/errorhandler');

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';
  //wrong  mongoDb field error
  if (err.name === 'CastError') {
    const message = `Resource not found. Invalid: ${err}`;
    err = new ErrorHandler(message, 400);
  }
  if (err.code === 11000) {
    const message = `User ${Object.keys(err.keyValue)} already exists. Please Login `;
    err = new ErrorHandler(message, 400);
  }
  if (err.name === 'JsonWebTokenError') {
    const message = `JsonWebToken is Invalid. Please Try Again.`;
    err = new ErrorHandler(message, 400);
  }
  if (err.name === 'JsonWebTokenExpiredError') {
    const message = `JsonWebToken is Expired. Please Try Again.`;
  }
  res.status(err.statusCode).json({
    success: false,
    error: err.message,
  });
};