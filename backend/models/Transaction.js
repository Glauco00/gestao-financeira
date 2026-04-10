const { getConnection } = require('../config/database');

class Transaction {
  static create(userId, transactionData) {
    const db = getConnection();
    
    const stmt = db.prepare(`
      INSERT INTO transactions (user_id, account_id, category_id, type, amount, description, date, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      userId,
      transactionData.account_id || null,
      transactionData.category_id || null,
      transactionData.type,
      transactionData.amount,
      transactionData.description || null,
      transactionData.date || new Date().toISOString().split('T')[0],
      transactionData.notes || null
    );
    
    // Atualizar saldo da conta se especificada
    if (transactionData.account_id) {
      const multiplier = transactionData.type === 'income' ? 1 : -1;
      db.prepare('UPDATE accounts SET balance = balance + ? WHERE id = ?')
        .run(transactionData.amount * multiplier, transactionData.account_id);
    }
    
    return db.prepare('SELECT * FROM transactions WHERE id = ?').get(result.lastInsertRowid);
  }
  
  static findByUser(userId, filters = {}) {
    const db = getConnection();
    let query = `
      SELECT 
        t.*,
        c.name as category_name,
        c.color as category_color,
        c.icon as category_icon,
        a.name as account_name
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      LEFT JOIN accounts a ON t.account_id = a.id
      WHERE t.user_id = ?
    `;
    
    const params = [userId];
    
    if (filters.type) {
      query += ' AND t.type = ?';
      params.push(filters.type);
    }
    
    if (filters.startDate) {
      query += ' AND t.date >= ?';
      params.push(filters.startDate);
    }
    
    if (filters.endDate) {
      query += ' AND t.date <= ?';
      params.push(filters.endDate);
    }
    
    if (filters.categoryId) {
      query += ' AND t.category_id = ?';
      params.push(filters.categoryId);
    }
    
    if (filters.accountId) {
      query += ' AND t.account_id = ?';
      params.push(filters.accountId);
    }
    
    query += ' ORDER BY t.date DESC, t.created_at DESC';
    
    return db.prepare(query).all(...params);
  }
  
  static findById(id, userId) {
    const db = getConnection();
    const transaction = db.prepare(`
      SELECT 
        t.*,
        c.name as category_name,
        a.name as account_name
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      LEFT JOIN accounts a ON t.account_id = a.id
      WHERE t.id = ? AND t.user_id = ?
    `).get(id, userId);
    
    return transaction || null;
  }
  
  static update(id, userId, transactionData) {
    const db = getConnection();
    
    // Buscar transação original para reverter saldo
    const original = this.findById(id, userId);
    if (!original) return null;
    
    // Reverter saldo anterior
    if (original.account_id) {
      const multiplier = original.type === 'income' ? -1 : 1;
      db.prepare('UPDATE accounts SET balance = balance + ? WHERE id = ?')
        .run(parseFloat(original.amount) * multiplier, original.account_id);
    }
    
    const updates = [];
    const params = [];
    
    if (transactionData.account_id !== undefined) {
      updates.push('account_id = ?');
      params.push(transactionData.account_id);
    }
    
    if (transactionData.category_id !== undefined) {
      updates.push('category_id = ?');
      params.push(transactionData.category_id);
    }
    
    if (transactionData.type) {
      updates.push('type = ?');
      params.push(transactionData.type);
    }
    
    if (transactionData.amount) {
      updates.push('amount = ?');
      params.push(transactionData.amount);
    }
    
    if (transactionData.description !== undefined) {
      updates.push('description = ?');
      params.push(transactionData.description);
    }
    
    if (transactionData.date) {
      updates.push('date = ?');
      params.push(transactionData.date);
    }
    
    if (transactionData.notes !== undefined) {
      updates.push('notes = ?');
      params.push(transactionData.notes);
    }
    
    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id, userId);
    
    db.prepare(`
      UPDATE transactions 
      SET ${updates.join(', ')}
      WHERE id = ? AND user_id = ?
    `).run(...params);
    
    const updated = this.findById(id, userId);
    
    // Aplicar novo saldo
    if (updated && updated.account_id) {
      const multiplier = updated.type === 'income' ? 1 : -1;
      db.prepare('UPDATE accounts SET balance = balance + ? WHERE id = ?')
        .run(parseFloat(updated.amount) * multiplier, updated.account_id);
    }
    
    return updated;
  }
  
  static delete(id, userId) {
    const db = getConnection();
    
    // Buscar transação para reverter saldo
    const transaction = this.findById(id, userId);
    if (!transaction) return false;
    
    // Reverter saldo
    if (transaction.account_id) {
      const multiplier = transaction.type === 'income' ? -1 : 1;
      db.prepare('UPDATE accounts SET balance = balance + ? WHERE id = ?')
        .run(parseFloat(transaction.amount) * multiplier, transaction.account_id);
    }
    
    const result = db.prepare('DELETE FROM transactions WHERE id = ? AND user_id = ?')
      .run(id, userId);
    
    return result.changes > 0;
  }
  
  static getStats(userId, startDate, endDate) {
    const db = getConnection();
    const stats = db.prepare(`
      SELECT 
        type,
        SUM(amount) as total,
        COUNT(*) as count,
        AVG(amount) as average
      FROM transactions
      WHERE user_id = ? 
        AND date BETWEEN ? AND ?
      GROUP BY type
    `).all(userId, startDate, endDate);
    
    return stats;
  }
}

module.exports = Transaction;
