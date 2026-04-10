const express = require('express');
const { body } = require('express-validator');
const AuthController = require('../controllers/AuthController');
const auth = require('../middleware/auth');

const router = express.Router();

// Registro
router.post('/register',
  [
    body('name').trim().notEmpty().withMessage('Nome é obrigatório'),
    body('email').isEmail().withMessage('E-mail inválido').normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Senha deve ter no mínimo 6 caracteres'),
  ],
  AuthController.register
);

// Login
router.post('/login',
  [
    body('email').isEmail().withMessage('E-mail inválido').normalizeEmail(),
    body('password').notEmpty().withMessage('Senha é obrigatória'),
  ],
  AuthController.login
);

// Obter dados do usuário logado
router.get('/me', auth, AuthController.me);

module.exports = router;
