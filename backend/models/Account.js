const { getConnection } = require('../config/database');

class Account {
  static create(userId, accountData) {
    const db = getConnection();
    
    const stmt = db.prepare(`
      INSERT INTO accounts (user_id, name, type, balance, currency)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      userId,
      accountData.name,
      accountData.type,
      accountData.balance || 0,
      accountData.currency || 'BRL'
    );
    
    return db.prepare('SELECT * FROM accounts WHERE id = ?').get(result.lastInsertRowid);
  }
  
  static findByUser(userId) {
    const db = getConnection();
    const accounts = db.prepare(`
      SELECT 
        a.*,
        (SELECT COUNT(*) FROM transactions WHERE account_id = a.id) as transaction_count
      FROM accounts a
      WHERE a.user_id = ?
      ORDER BY a.created_at DESC
    `).all(userId);
    
    return accounts;
  }
  
  static findById(id, userId) {
    const db = getConnection();
    const account = db.prepare('SELECT * FROM accounts WHERE id = ? AND user_id = ?')
      .get(id, userId);
    
    return account || null;
  }
  
  static update(id, userId, accountData) {
    const db = getConnection();
    const updates = [];
    const params = [];
    
    if (accountData.name) {
      updates.push('name = ?');
      params.push(accountData.name);
    }
    
    if (accountData.type) {
      updates.push('type = ?');
      params.push(accountData.type);
    }
    
    if (accountData.balance !== undefined) {
      updates.push('balance = ?');
      params.push(accountData.balance);
    }
    
    if (accountData.currency) {
      updates.push('currency = ?');
      params.push(accountData.currency);
    }
    
    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id, userId);
    
    db.prepare(`
      UPDATE accounts 
      SET ${updates.join(', ')}
      WHERE id = ? AND user_id = ?
    `).run(...params);
    
    return this.findById(id, userId);
  }
  
  static delete(id, userId) {
    const db = getConnection();
    const result = db.prepare('DELETE FROM accounts WHERE id = ? AND user_id = ?')
      .run(id, userId);
    
    return result.changes > 0;
  }
  
  static getTotalBalance(userId) {
    const db = getConnection();
    const result = db.prepare('SELECT SUM(balance) as total FROM accounts WHERE user_id = ?')
      .get(userId);
    
    return parseFloat(result.total || 0);
  }
}

module.exports = Account;
