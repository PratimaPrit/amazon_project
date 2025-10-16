const amazonService = require('./amazonService');
const geminiService = require('./geminiService');
const optimizationModel = require('../models/optimizationModel');

class ProductService {
  async optimizeProductByAsin(asin, requestId = 'unknown') {
    console.log(`[${requestId}] Validating ASIN format`);
    if (!amazonService.isValidAsin(asin)) {
      throw new Error('Invalid ASIN format. Must be 10 alphanumeric characters.');
    }

    console.log(`[${requestId}] Fetching product details from Amazon`);
    const productData = await amazonService.getProductDetails(asin, requestId);

    console.log(`[${requestId}] Optimizing product with AI`);
    const optimizedData = await geminiService.optimizeProduct(productData, requestId);

    console.log(`[${requestId}] Saving optimization to database`);
    const optimizationId = await optimizationModel.createOptimization({
      asin,
      originalTitle: productData.title,
      originalBullets: JSON.stringify(productData.bullets),
      originalDescription: productData.description,
      optimizedTitle: optimizedData.optimizedTitle,
      optimizedBullets: JSON.stringify(optimizedData.optimizedBullets),
      optimizedDescription: optimizedData.optimizedDescription,
      suggestedKeywords: JSON.stringify(optimizedData.suggestedKeywords)
    });

    console.log(`[${requestId}] Optimization saved with ID: ${optimizationId}`);

    return {
      id: optimizationId,
      asin,
      original: {
        title: productData.title,
        bullets: productData.bullets,
        description: productData.description
      },
      optimized: {
        title: optimizedData.optimizedTitle,
        bullets: optimizedData.optimizedBullets,
        description: optimizedData.optimizedDescription,
        keywords: optimizedData.suggestedKeywords
      }
    };
  }
}

module.exports = new ProductService();
