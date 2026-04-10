const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

class AuthController {
  static async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          error: true, 
          message: 'Dados inválidos', 
          errors: errors.array() 
        });
      }
      
      const { name, email, password } = req.body;
      
      // Verificar se usuário já existe
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ 
          error: true, 
          message: 'E-mail já cadastrado' 
        });
      }
      
      // Criar usuário
      const user = await User.create({ name, email, password });
      
      // Gerar token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
      
      res.status(201).json({
        success: true,
        message: 'Usuário cadastrado com sucesso',
        data: { user, token }
      });
    } catch (error) {
      console.error('Erro no registro:', error);
      res.status(500).json({ 
        error: true, 
        message: 'Erro ao cadastrar usuário' 
      });
    }
  }
  
  static async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          error: true, 
          message: 'Dados inválidos', 
          errors: errors.array() 
        });
      }
      
      const { email, password } = req.body;
      
      // Buscar usuário
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ 
          error: true, 
          message: 'E-mail ou senha incorretos' 
        });
      }
      
      // Validar senha
      const isValidPassword = await User.validatePassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ 
          error: true, 
          message: 'E-mail ou senha incorretos' 
        });
      }
      
      // Gerar token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
      
      // Remover senha do objeto
      delete user.password;
      
      res.json({
        success: true,
        message: 'Login realizado com sucesso',
        data: { user, token }
      });
    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({ 
        error: true, 
        message: 'Erro ao fazer login' 
      });
    }
  }
  
  static async me(req, res) {
    try {
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ 
          error: true, 
          message: 'Usuário não encontrado' 
        });
      }
      
      res.json({
        success: true,
        data: { user }
      });
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      res.status(500).json({ 
        error: true, 
        message: 'Erro ao buscar dados do usuário' 
      });
    }
  }
}

module.exports = AuthController;
