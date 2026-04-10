const { getConnection } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static create(userData) {
    const db = getConnection();
    const hashedPassword = bcrypt.hashSync(userData.password, 10);
    
    const stmt = db.prepare(`
      INSERT INTO users (name, email, password)
      VALUES (?, ?, ?)
    `);
    
    const result = stmt.run(userData.name, userData.email, hashedPassword);
    
    const user = db.prepare('SELECT id, name, email, created_at, updated_at FROM users WHERE id = ?')
      .get(Number(result.lastInsertRowid));
    
    return user;
  }
  
  static findByEmail(email) {
    const db = getConnection();
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    return user || null;
  }
  
  static findById(id) {
    const db = getConnection();
    const user = db.prepare('SELECT id, name, email, created_at, updated_at FROM users WHERE id = ?')
      .get(id);
    return user || null;
  }
  
  static update(id, userData) {
    const db = getConnection();
    const updates = [];
    const params = [];
    
    if (userData.name) {
      updates.push('name = ?');
      params.push(userData.name);
    }
    
    if (userData.email) {
      updates.push('email = ?');
      params.push(userData.email);
    }
    
    if (userData.password) {
      const hashedPassword = bcrypt.hashSync(userData.password, 10);
      updates.push('password = ?');
      params.push(hashedPassword);
    }
    
    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);
    
    const stmt = db.prepare(`
      UPDATE users 
      SET ${updates.join(', ')}
      WHERE id = ?
    `);
    
    stmt.run(...params);
    
    return this.findById(id);
  }
  
  static validatePassword(plainPassword, hashedPassword) {
    return bcrypt.compareSync(plainPassword, hashedPassword);
  }
}

module.exports = User;
