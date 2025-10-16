-- migrations/004_add_indexes/down.sql
-- Rollback: Drop index from optimizations table

ALTER TABLE optimizations
DROP INDEX idx_asin;
