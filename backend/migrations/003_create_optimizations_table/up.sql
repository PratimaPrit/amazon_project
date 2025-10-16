-- migrations/003_create_optimizations_table/up.sql
-- Create optimizations table to store optimization records

CREATE TABLE IF NOT EXISTS optimizations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  asin VARCHAR(10) NOT NULL,
  original_title TEXT NOT NULL,
  original_bullets JSON,
  original_description TEXT,
  optimized_title TEXT NOT NULL,
  optimized_bullets JSON,
  optimized_description TEXT,
  suggested_keywords JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
