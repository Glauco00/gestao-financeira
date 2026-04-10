const Database = require('better-sqlite3');
const path = require('path');

const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'database.sqlite');

let db = null;

function getConnection() {
  if (!db) {
    db = new Database(dbPath, { verbose: console.log });
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

function testConnection() {
  try {
    const db = getConnection();
    db.prepare('SELECT 1').get();
    return true;
  } catch (error) {
    throw new Error(`Falha na conexão com o banco: ${error.message}`);
  }
}

function closeConnection() {
  if (db) {
    db.close();
    db = null;
  }
}

module.exports = {
  getConnection,
  testConnection,
  closeConnection,
  dbPath
};
