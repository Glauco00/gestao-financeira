const express = require('express');
const { body } = require('express-validator');
const AccountController = require('../controllers/AccountController');
const auth = require('../middleware/auth');

const router = express.Router();

// Todas as rotas exigem autenticação
router.use(auth);

// Listar todas as contas
router.get('/', AccountController.getAll);

// Buscar conta por ID
router.get('/:id', AccountController.getById);

// Criar nova conta
router.post('/',
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Nome da conta é obrigatório'),
    body('type')
      .trim()
      .notEmpty()
      .withMessage('Tipo da conta é obrigatório'),
    body('balance')
      .optional()
      .isFloat()
      .withMessage('Saldo deve ser um número'),
    body('currency')
      .optional()
      .trim(),
  ],
  AccountController.create
);

// Atualizar conta
router.put('/:id', AccountController.update);

// Excluir conta
router.delete('/:id', AccountController.delete);

module.exports = router;
