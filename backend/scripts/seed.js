require('dotenv').config();
const { getConnection, closeConnection, dbPath } = require('../config/database');
const bcrypt = require('bcryptjs');

function seed() {
  try {
    console.log('🌱 Iniciando seed do banco de dados...');
    console.log(`📁 Arquivo: ${dbPath}\n`);

    const db = getConnection();

    // Criar usuário de exemplo
    console.log('⏳ Criando usuário de exemplo...');
    const hashedPassword = bcrypt.hashSync('123456', 10);

    // Verificar se usuário já existe
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get('teste@email.com');
    
    let userId;
    if (existingUser) {
      userId = existingUser.id;
      console.log(`✓ Usuário já existe (ID: ${userId})`);
    } else {
      const userResult = db.prepare(`
        INSERT INTO users (name, email, password)
        VALUES (?, ?, ?)
      `).run('Usuário Teste', 'teste@email.com', hashedPassword);
      
      userId = userResult.lastInsertRowid;
      console.log(`✓ Usuário criado (ID: ${userId})`);
    }
    
    console.log('  Email: teste@email.com');
    console.log('  Senha: 123456\n');

    // Criar contas
    console.log('⏳ Criando contas...');
    const accounts = [
      { name: 'Conta Corrente', type: 'Corrente', balance: 5000.00 },
      { name: 'Poupança', type: 'Poupança', balance: 10000.00 },
      { name: 'Carteira', type: 'Dinheiro', balance: 500.00 },
    ];

    for (const account of accounts) {
      const existing = db.prepare('SELECT id FROM accounts WHERE user_id = ? AND name = ?')
        .get(userId, account.name);
      
      if (!existing) {
        db.prepare(`
          INSERT INTO accounts (user_id, name, type, balance)
          VALUES (?, ?, ?, ?)
        `).run(userId, account.name, account.type, account.balance);
      }
    }
    console.log(`✓ ${accounts.length} contas criadas\n`);

    // Buscar IDs das contas
    const accountsResult = db.prepare('SELECT id, name FROM accounts WHERE user_id = ?').all(userId);
    
    const accountIds = {};
    accountsResult.forEach(acc => {
      accountIds[acc.name] = acc.id;
    });

    // Criar categorias personalizadas do usuário
    console.log('⏳ Criando categorias personalizadas...');
    const userCategories = [
      { name: 'Gift', type: 'income', color: '#FF6B6B', icon: 'card_giftcard' },
      { name: 'Internet', type: 'expense', color: '#4ECDC4', icon: 'wifi' },
    ];

    for (const category of userCategories) {
      const existing = db.prepare('SELECT id FROM categories WHERE user_id = ? AND name = ?')
        .get(userId, category.name);
      
      if (!existing) {
        db.prepare(`
          INSERT INTO categories (user_id, name, type, color, icon)
          VALUES (?, ?, ?, ?, ?)
        `).run(userId, category.name, category.type, category.color, category.icon);
      }
    }
    console.log(`✓ ${userCategories.length} categorias personalizadas criadas\n`);

    // Criar transações de exemplo (verificar se já existem)
    const existingTx = db.prepare('SELECT COUNT(*) as count FROM transactions WHERE user_id = ?').get(userId);
    
    if (existingTx.count === 0) {
      console.log('⏳ Criando transações de exemplo...');
      const transactions = [
        {
          type: 'income',
          amount: 5000.00,
          description: 'Salário',
          category_id: 1,
          account_id: accountIds['Conta Corrente'],
          date: '2026-02-01',
        },
        {
          type: 'expense',
          amount: 1200.00,
          description: 'Aluguel',
          category_id: 7,
          account_id: accountIds['Conta Corrente'],
          date: '2026-02-05',
        },
        {
          type: 'expense',
          amount: 350.00,
          description: 'Supermercado',
          category_id: 5,
          account_id: accountIds['Conta Corrente'],
          date: '2026-02-06',
        },
        {
          type: 'expense',
          amount: 150.00,
          description: 'Combustível',
          category_id: 6,
          account_id: accountIds['Carteira'],
          date: '2026-02-07',
        },
        {
          type: 'expense',
          amount: 200.00,
          description: 'Academia',
          category_id: 8,
          account_id: accountIds['Conta Corrente'],
          date: '2026-02-08',
        },
        {
          type: 'income',
          amount: 800.00,
          description: 'Freelance',
          category_id: 2,
          account_id: accountIds['Poupança'],
          date: '2026-02-08',
        },
        {
          type: 'expense',
          amount: 89.90,
          description: 'Netflix',
          category_id: 10,
          account_id: accountIds['Conta Corrente'],
          date: '2026-02-09',
        },
      ];

      for (const transaction of transactions) {
        db.prepare(`
          INSERT INTO transactions (user_id, account_id, category_id, type, amount, description, date)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(
          userId,
          transaction.account_id,
          transaction.category_id,
          transaction.type,
          transaction.amount,
          transaction.description,
          transaction.date
        );
      }
      console.log(`✓ ${transactions.length} transações criadas\n`);
    } else {
      console.log(`⏭️  Transações já existem (${existingTx.count} encontradas)\n`);
    }

    console.log('✓ Seed completado com sucesso!\n');
    console.log('═══════════════════════════════════════════');
    console.log('  🎉 Banco de dados populado!');
    console.log('═══════════════════════════════════════════');
    console.log('\n📝 Credenciais para login:');
    console.log('  Email: teste@email.com');
    console.log('  Senha: 123456');
    console.log('\n💡 Acesse http://localhost:5173 e faça login!');
    console.log('═══════════════════════════════════════════\n');

    closeConnection();
  } catch (error) {
    console.error('✗ Erro ao popular banco:', error);
    process.exit(1);
  }
}

seed();
