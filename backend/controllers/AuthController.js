const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

class AuthController {
  static async register(req, res) {
    // Registro bloqueado, sistema operando em modo "Admin Only" via .env
    return res.status(403).json({ 
      error: true, 
      message: 'O cadastro de novos usuários está bloqueado pelo administrador.' 
    });
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
      let user = await User.findByEmail(email);

      const adminEmail = process.env.ADMIN_EMAIL;
      const adminPassword = process.env.ADMIN_PASSWORD;

      // Se for a tentativa de login do ADMIN via .env
      if (adminEmail && adminPassword && email === adminEmail && password === adminPassword) {
        // Se o admin não existir no banco de dados, nós o criamos automaticamente na primeira vez
        if (!user) {
           user = await User.create({ name: 'Administrador', email: adminEmail, password: adminPassword });
        }
      } else {
        // Se não for o admin master (ou as senhas do master nao baterem), tentar fluxo normal de DB
        if (!user) {
          return res.status(401).json({ 
            error: true, 
            message: 'E-mail ou senha incorretos' 
          });
        }
        
        const isValidPassword = await User.validatePassword(password, user.password);
        if (!isValidPassword) {
          return res.status(401).json({ 
            error: true, 
            message: 'E-mail ou senha incorretos' 
          });
        }
      }
      
      // Gerar token com fallbacks de segurança para evitar crashes se o ENV falhar
      const secret = process.env.JWT_SECRET || 'fallback_secret_key_gestao_fin';
      const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

      const token = jwt.sign(
        { userId: Number(user.id), email: user.email },
        secret,
        { expiresIn }
      );
      
      // Remover senha do objeto final
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
