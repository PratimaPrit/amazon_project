-- migrations/004_add_indexes/up.sql
-- Add index for ASIN searches

ALTER TABLE optimizations
ADD INDEX idx_asin (asin);
