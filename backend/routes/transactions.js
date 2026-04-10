const express = require('express');
const { body } = require('express-validator');
const TransactionController = require('../controllers/TransactionController');
const auth = require('../middleware/auth');

const router = express.Router();

// Todas as rotas exigem autenticação
router.use(auth);

// Estatísticas
router.get('/stats', TransactionController.getStats);

// Listar todas as transações (com filtros)
router.get('/', TransactionController.getAll);

// Buscar transação por ID
router.get('/:id', TransactionController.getById);

// Criar nova transação
router.post('/',
  [
    body('type')
      .isIn(['income', 'expense'])
      .withMessage('Tipo deve ser "income" ou "expense"'),
    body('amount')
      .isFloat({ min: 0.01 })
      .withMessage('Valor deve ser positivo'),
    body('description')
      .optional()
      .trim(),
    body('date')
      .optional()
      .isISO8601()
      .withMessage('Data inválida'),
  ],
  TransactionController.create
);

// Atualizar transação
router.put('/:id', TransactionController.update);

// Excluir transação
router.delete('/:id', TransactionController.delete);

module.exports = router;
