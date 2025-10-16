// src/routes/api.js
// API routes

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const historyController = require('../controllers/historyController');

// Product optimization
router.post('/optimize', productController.optimizeProduct);

// Optimization history
router.get('/history', historyController.getAllHistory);
router.get('/history/asin/:asin', historyController.getHistoryByAsin);
router.get('/history/:id', historyController.getOptimizationById);

module.exports = router;
