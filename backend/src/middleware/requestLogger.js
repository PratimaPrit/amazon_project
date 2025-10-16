// src/middleware/requestLogger.js
// Request logging middleware with unique request IDs

const { v4: uuidv4 } = require('uuid');

const requestLogger = (req, res, next) => {
  // Generate unique request ID
  const requestId = uuidv4();
  req.requestId = requestId;

  // Store start time
  const startTime = Date.now();

  // Log incoming request
  console.log(
    `[${new Date().toISOString()}] [${requestId}] --> ${req.method} ${req.originalUrl || req.url}`
  );

  // Log request body
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`[${requestId}] Request Body:`, JSON.stringify(req.body));
  }

  // Capture the original res.json function
  const originalJson = res.json.bind(res);

  // Override res.json to log response
  res.json = function (data) {
    const duration = Date.now() - startTime;
    console.log(
      `[${new Date().toISOString()}] [${requestId}] <-- ${req.method} ${req.originalUrl || req.url} - ${res.statusCode} (${duration}ms)`
    );

    // Log response data
    const responseStr = JSON.stringify(data);
    console.log(`[${requestId}] Response:`, responseStr);

    return originalJson(data);
  };

  // Handle errors in response
  res.on('finish', () => {
    if (res.statusCode >= 400) {
      const duration = Date.now() - startTime;
      console.error(
        `[${new Date().toISOString()}] [${requestId}] ERROR - ${req.method} ${req.originalUrl || req.url} - ${res.statusCode} (${duration}ms)`
      );
    }
  });

  next();
};

module.exports = requestLogger;
