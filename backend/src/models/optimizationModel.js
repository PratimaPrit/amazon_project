const Optimization = require('./Optimization');

class OptimizationModel {
  async createOptimization(data) {
    const optimization = await Optimization.create({
      asin: data.asin,
      original_title: data.originalTitle,
      original_bullets: data.originalBullets,
      original_description: data.originalDescription,
      optimized_title: data.optimizedTitle,
      optimized_bullets: data.optimizedBullets,
      optimized_description: data.optimizedDescription,
      suggested_keywords: data.suggestedKeywords
    });
    return optimization.id;
  }

  async getHistoryByAsin(asin) {
    const rows = await Optimization.findAll({
      where: { asin },
      attributes: ['id', 'asin', 'original_title', 'created_at'],
      order: [['created_at', 'DESC']],
      raw: true
    });

    return rows.map(row => ({
      id: row.id,
      asin: row.asin,
      original: {
        title: row.original_title
      },
      createdAt: row.created_at
    }));
  }

  async getAllHistory(limit = 10, offset = 0) {
    const rows = await Optimization.findAll({
      attributes: ['id', 'asin', 'original_title', 'created_at'],
      order: [['id', 'ASC']],
      limit,
      offset,
      raw: true
    });

    return rows.map(row => ({
      id: row.id,
      asin: row.asin,
      original: {
        title: row.original_title
      },
      createdAt: row.created_at
    }));
  }

  async getOptimizationById(id) {
    const row = await Optimization.findByPk(id, { raw: true });
    if (!row) return null;
    return this.formatOptimization(row);
  }

  formatOptimization(row) {
    const safeJsonParse = (value, defaultValue = []) => {
      if (!value) return defaultValue;
      if (typeof value !== 'string') return value;
      if (value.trim() === '') return defaultValue;
      try {
        return JSON.parse(value);
      } catch (error) {
        console.error(`JSON parse error for value: ${value}`, error);
        return defaultValue;
      }
    };

    return {
      id: row.id,
      asin: row.asin,
      original: {
        title: row.original_title || '',
        bullets: safeJsonParse(row.original_bullets, []),
        description: row.original_description || ''
      },
      optimized: {
        title: row.optimized_title || '',
        bullets: safeJsonParse(row.optimized_bullets, []),
        description: row.optimized_description || '',
        keywords: safeJsonParse(row.suggested_keywords, [])
      },
      createdAt: row.created_at
    };
  }
}

module.exports = new OptimizationModel();
