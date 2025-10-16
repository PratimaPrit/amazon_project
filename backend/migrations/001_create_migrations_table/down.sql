-- migrations/001_create_migrations_table/down.sql
-- Rollback: Drop migrations table

DROP TABLE IF EXISTS migrations;
