const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const Optimization = sequelize.define(
  'Optimization',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    asin: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    original_title: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'original_title'
    },
    original_bullets: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'original_bullets'
    },
    original_description: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'original_description'
    },
    optimized_title: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'optimized_title'
    },
    optimized_bullets: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'optimized_bullets'
    },
    optimized_description: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'optimized_description'
    },
    suggested_keywords: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'suggested_keywords'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    }
  },
  {
    tableName: 'optimizations',
    timestamps: false,
    underscored: true
  }
);

module.exports = Optimization;
