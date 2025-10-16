const productService = require('../services/productService');

exports.optimizeProduct = async (req, res, next) => {
  try {
    const { asin } = req.body;
    const requestId = req.requestId;

    if (!asin) {
      console.log(`[${requestId}] Validation failed: ASIN is required`);
      return res.status(400).json({
        success: false,
        error: 'ASIN is required'
      });
    }

    console.log(`[${requestId}] Starting optimization for ASIN: ${asin}`);
    const result = await productService.optimizeProductByAsin(asin, requestId);
    console.log(`[${requestId}] Optimization completed successfully for ASIN: ${asin}`);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error(`[${req.requestId}] Error optimizing product:`, error.message);
    next(error);
  }
};
