// src/middleware/errorHandler.js
// Global error handling middleware

module.exports = (err, req, res) => {
  const requestId = req.requestId || 'unknown';
  console.error(`[${requestId}] Error:`, err);

  // Handle specific error types
  if (err.message.includes('ASIN')) {
    return res.status(400).json({
      success: false,
      error: err.message
    });
  }

  if (err.message.includes('Product not found')) {
    return res.status(404).json({
      success: false,
      error: 'Product not found. Please check the ASIN and try again.'
    });
  }

  if (err.message.includes('not accessible')) {
    return res.status(403).json({
      success: false,
      error: 'Product not accessible through Amazon API'
    });
  }

  if (err.code === 'ECONNREFUSED') {
    return res.status(503).json({
      success: false,
      error: 'Database connection failed'
    });
  }

  // Default error
  res.status(500).json({
    success: false,
    error: 'An unexpected error occurred. Please try again.'
  });
};
