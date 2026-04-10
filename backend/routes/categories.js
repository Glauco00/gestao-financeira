const express = require('express');
const { body } = require('express-validator');
const CategoryController = require('../controllers/CategoryController');
const auth = require('../middleware/auth');

const router = express.Router();

// Todas as rotas exigem autenticação
router.use(auth);

// Listar todas as categorias
router.get('/', CategoryController.getAll);

// Buscar categoria por ID
router.get('/:id', CategoryController.getById);

// Criar nova categoria
router.post('/',
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Nome da categoria é obrigatório'),
    body('type')
      .isIn(['income', 'expense'])
      .withMessage('Tipo deve ser "income" ou "expense"'),
    body('color')
      .optional()
      .trim(),
    body('icon')
      .optional()
      .trim(),
  ],
  CategoryController.create
);

// Atualizar categoria
router.put('/:id', CategoryController.update);

// Excluir categoria
router.delete('/:id', CategoryController.delete);

module.exports = router;
