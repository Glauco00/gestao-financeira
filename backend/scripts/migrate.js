require('dotenv').config();
const { getConnection, dbPath } = require('../config/database');

const migrations = [
  {
    name: 'create_users_table',
    up: `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `,
  },
  {
    name: 'create_categories_table',
    up: `
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
        color TEXT,
        icon TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
      
      CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
    `,
  },
  {
    name: 'create_accounts_table',
    up: `
      CREATE TABLE IF NOT EXISTS accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        balance REAL DEFAULT 0,
        currency TEXT DEFAULT 'BRL',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
      
      CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
    `,
  },
  {
    name: 'create_transactions_table',
    up: `
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        account_id INTEGER,
        category_id INTEGER,
        type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
        amount REAL NOT NULL,
        description TEXT,
        date DATE NOT NULL,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE SET NULL,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
      );
      
      CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
      CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
      CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
    `,
  },
  {
    name: 'insert_default_categories',
    up: `
      INSERT OR IGNORE INTO categories (id, user_id, name, type, color, icon) VALUES
      (1, 0, 'Salário', 'income', '#4CAF50', 'work'),
      (2, 0, 'Freelance', 'income', '#8BC34A', 'laptop'),
      (3, 0, 'Investimentos', 'income', '#009688', 'trending_up'),
      (4, 0, 'Outros', 'income', '#00BCD4', 'attach_money'),
      (5, 0, 'Alimentação', 'expense', '#F44336', 'restaurant'),
      (6, 0, 'Transporte', 'expense', '#E91E63', 'directions_car'),
      (7, 0, 'Moradia', 'expense', '#9C27B0', 'home'),
      (8, 0, 'Saúde', 'expense', '#673AB7', 'local_hospital'),
      (9, 0, 'Educação', 'expense', '#3F51B5', 'school'),
      (10, 0, 'Lazer', 'expense', '#2196F3', 'sports_esports'),
      (11, 0, 'Compras', 'expense', '#FF9800', 'shopping_cart'),
      (12, 0, 'Contas', 'expense', '#FF5722', 'receipt');
    `,
  }
];

function runMigrations() {
  try {
    console.log('🗄️  Conectando ao banco de dados SQLite...');
    console.log(`📁 Arquivo: ${dbPath}\n`);
    
    const db = getConnection();
    
    console.log('Executando migrações...\n');
    
    for (const migration of migrations) {
      console.log(`⏳ Executando: ${migration.name}`);
      try {
        db.exec(migration.up);
        console.log(`✓ ${migration.name} - OK\n`);
      } catch (error) {
        console.error(`✗ ${migration.name} - ERRO:`, error.message);
        throw error;
      }
    }
    
    console.log('✓ Todas as migrações foram executadas com sucesso!');
    console.log('\n=== Banco de dados configurado e pronto para uso ===\n');
    
  } catch (error) {
    console.error('✗ Erro ao executar migrações:', error);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  runMigrations();
}

module.exports = { runMigrations };
