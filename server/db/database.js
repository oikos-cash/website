import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'kanban.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database schema
function initializeDatabase() {
  const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');
  db.exec(schema);

  // Create default admin user if no users exist
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
  if (userCount.count === 0) {
    const defaultPassword = crypto.randomBytes(8).toString('hex');
    const passwordHash = bcrypt.hashSync(defaultPassword, 10);

    db.prepare(
      'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)'
    ).run('admin', passwordHash, 'admin');

    console.log('\n' + '='.repeat(50));
    console.log('INITIAL ADMIN CREDENTIALS');
    console.log('='.repeat(50));
    console.log('Username: admin');
    console.log(`Password: ${defaultPassword}`);
    console.log('='.repeat(50));
    console.log('Please change this password after first login!\n');
  }
}

// Initialize on module load
initializeDatabase();

export default db;
