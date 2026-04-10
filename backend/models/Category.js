const { getConnection } = require('../config/database');

class Category {
  static create(userId, categoryData) {
    const db = getConnection();
    
    const stmt = db.prepare(`
      INSERT INTO categories (user_id, name, type, color, icon)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      userId,
      categoryData.name,
      categoryData.type,
      categoryData.color || null,
      categoryData.icon || null
    );
    
    return db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid);
  }
  
  static findByUser(userId, type = null) {
    const db = getConnection();
    
    let query = `
      SELECT 
        c.*,
        (SELECT COUNT(*) FROM transactions WHERE category_id = c.id) as transaction_count
      FROM categories c
      WHERE (c.user_id = ? OR c.user_id = 0)
    `;
    
    const params = [userId];
    
    if (type) {
      query += ' AND c.type = ?';
      params.push(type);
    }
    
    query += ' ORDER BY c.user_id DESC, c.name ASC';
    
    return db.prepare(query).all(...params);
  }
  
  static findById(id, userId) {
    const db = getConnection();
    const category = db.prepare(
      'SELECT * FROM categories WHERE id = ? AND (user_id = ? OR user_id = 0)'
    ).get(id, userId);
    
    return category || null;
  }
  
  static update(id, userId, categoryData) {
    const db = getConnection();
    const updates = [];
    const params = [];
    
    if (categoryData.name) {
      updates.push('name = ?');
      params.push(categoryData.name);
    }
    
    if (categoryData.type) {
      updates.push('type = ?');
      params.push(categoryData.type);
    }
    
    if (categoryData.color !== undefined) {
      updates.push('color = ?');
      params.push(categoryData.color);
    }
    
    if (categoryData.icon !== undefined) {
      updates.push('icon = ?');
      params.push(categoryData.icon);
    }
    
    if (updates.length === 0) {
      return null;
    }
    
    params.push(id, userId);
    
    db.prepare(`
      UPDATE categories 
      SET ${updates.join(', ')}
      WHERE id = ? AND user_id = ?
    `).run(...params);
    
    return this.findById(id, userId);
  }
  
  static delete(id, userId) {
    const db = getConnection();
    const result = db.prepare('DELETE FROM categories WHERE id = ? AND user_id = ?')
      .run(id, userId);
    
    return result.changes > 0;
  }
}

module.exports = Category;
