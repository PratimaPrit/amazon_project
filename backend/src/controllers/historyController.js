const optimizationModel = require('../models/optimizationModel');

exports.getHistoryByAsin = async (req, res, next) => {
  try {
    const { asin } = req.params;
    const history = await optimizationModel.getHistoryByAsin(asin);

    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('getHistoryByAsin error:', error);
    next(error);
  }
};

exports.getAllHistory = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const history = await optimizationModel.getAllHistory(limit, offset);

    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('getAllHistory error:', error);
    next(error);
  }
};

exports.getOptimizationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const optimization = await optimizationModel.getOptimizationById(id);

    if (!optimization) {
      return res.status(404).json({
        success: false,
        error: 'Optimization not found'
      });
    }

    res.json({
      success: true,
      data: optimization
    });
  } catch (error) {
    next(error);
  }
};
