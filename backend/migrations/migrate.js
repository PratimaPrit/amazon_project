// migrations/migrate.js
// Database migration runner

const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

class MigrationRunner {
  constructor() {
    this.connection = null;
  }

  async connect() {
    const ssl = process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined;
    this.connection = await mysql.createConnection({
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      multipleStatements: true,
      ssl
    });
    console.log('Connected to MySQL');
  }

  async ensureDatabase() {
    // Only ensure database exists, migrations table will be created by migration 001
    await this.connection.query('CREATE DATABASE IF NOT EXISTS amazon_optimizer');
    await this.connection.query('USE amazon_optimizer');
    console.log('Database ready');
  }

  async migrationsTableExists() {
    try {
      await this.connection.query('USE amazon_optimizer');
      const [rows] = await this.connection.query("SHOW TABLES LIKE 'migrations'");
      return rows.length > 0;
    } catch {
      return false;
    }
  }

  async getExecutedMigrations() {
    const tableExists = await this.migrationsTableExists();
    if (!tableExists) {
      return [];
    }
    await this.connection.query('USE amazon_optimizer');
    const [rows] = await this.connection.query('SELECT name FROM migrations ORDER BY id');
    return rows.map(row => row.name);
  }

  async getPendingMigrations() {
    const migrationsDir = __dirname;
    const entries = await fs.readdir(migrationsDir, { withFileTypes: true });

    // Get all migration folders (numbered folders like 001_, 002_, etc.)
    const migrationFolders = entries
      .filter(entry => entry.isDirectory() && /^\d{3}_/.test(entry.name))
      .map(entry => entry.name)
      .sort();

    const executed = await this.getExecutedMigrations();
    const pending = migrationFolders.filter(folder => !executed.includes(folder));

    return pending;
  }

  async runMigration(folderName) {
    const upFilePath = path.join(__dirname, folderName, 'up.sql');

    console.log(`  Running: ${folderName}`);

    try {
      const sql = await fs.readFile(upFilePath, 'utf-8');
      await this.connection.query(sql);
      await this.connection.query('INSERT INTO migrations (name) VALUES (?)', [folderName]);
      console.log(`Success: ${folderName}`);
    } catch (error) {
      console.error(`Failed: ${folderName}`);
      throw error;
    }
  }

  async rollbackMigration(folderName) {
    const downFilePath = path.join(__dirname, folderName, 'down.sql');

    console.log(`  Rolling back: ${folderName}`);

    try {
      const sql = await fs.readFile(downFilePath, 'utf-8');
      await this.connection.query(sql);
      await this.connection.query('DELETE FROM migrations WHERE name = ?', [folderName]);
      console.log(`Rolled back: ${folderName}`);
    } catch (error) {
      console.error(`Rollback failed: ${folderName}`);
      throw error;
    }
  }

  async migrate() {
    try {
      await this.connect();
      await this.ensureDatabase();

      const pending = await this.getPendingMigrations();

      if (pending.length === 0) {
        console.log('\n No pending migrations');
        return;
      }

      console.log(`\n Found ${pending.length} pending migration(s):\n`);

      for (const migration of pending) {
        await this.runMigration(migration);
      }

      console.log('\nAll migrations completed successfully!');
    } catch (error) {
      console.error('\nMigration failed:', error.message);
      throw error;
    } finally {
      if (this.connection) {
        await this.connection.end();
      }
    }
  }

  async rollback(steps = 1) {
    try {
      await this.connect();
      await this.ensureDatabase();

      const executed = await this.getExecutedMigrations();

      if (executed.length === 0) {
        console.log('\n No migrations to rollback');
        return;
      }

      const toRollback = executed.slice(-steps).reverse();

      console.log(`\n Rolling back ${toRollback.length} migration(s):\n`);

      for (const migration of toRollback) {
        await this.rollbackMigration(migration);
      }

      console.log('\nRollback completed successfully!');
    } catch (error) {
      console.error('\nRollback failed:', error.message);
      throw error;
    } finally {
      if (this.connection) {
        await this.connection.end();
      }
    }
  }

  async status() {
    try {
      await this.connect();
      await this.ensureDatabase();

      const executed = await this.getExecutedMigrations();
      const pending = await this.getPendingMigrations();

      console.log('\n📊 Migration Status:\n');
      console.log(`Executed: ${executed.length}`);
      executed.forEach(m => console.log(`   ${m}`));

      if (pending.length > 0) {
        console.log(`\nPending: ${pending.length}`);
        pending.forEach(m => console.log(`  - ${m}`));
      } else {
        console.log('\n All migrations up to date');
      }
    } finally {
      if (this.connection) {
        await this.connection.end();
      }
    }
  }
}

// CLI Interface
const command = process.argv[2] || 'up';
const steps = parseInt(process.argv[3]) || 1;

const runner = new MigrationRunner();

if (command === 'up') {
  runner.migrate();
} else if (command === 'down') {
  runner.rollback(steps);
} else if (command === 'status') {
  runner.status();
} else {
  console.log('Usage: node migrate.js [up|down|status]');
  console.log('  up           - Run pending migrations');
  console.log('  down [steps] - Rollback migrations (default: 1)');
  console.log('  status       - Show migration status');
  console.log('\nExamples:');
  console.log('  node migrate.js up');
  console.log('  node migrate.js down');
  console.log('  node migrate.js down 2');
  console.log('  node migrate.js status');
}
