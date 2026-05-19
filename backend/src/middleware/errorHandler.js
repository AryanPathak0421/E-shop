const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  const errorResponse = {
    success: false,
    error: err.message || 'Server Error',
  };

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    errorResponse.error = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
    return res.status(400).json(errorResponse);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    errorResponse.error = `${Object.keys(err.keyPattern)[0]} already exists`;
    return res.status(400).json(errorResponse);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    errorResponse.error = 'Invalid token';
    return res.status(401).json(errorResponse);
  }

  res.status(err.statusCode || 500).json(errorResponse);
};

module.exports = errorHandler;