const Category = require('../models/Category');
const { validationResult } = require('express-validator');

class CategoryController {
  static async getAll(req, res) {
    try {
      const { type } = req.query;
      const categories = await Category.findByUser(req.userId, type);
      
      res.json({
        success: true,
        data: { categories }
      });
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      res.status(500).json({ 
        error: true, 
        message: 'Erro ao buscar categorias' 
      });
    }
  }
  
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const category = await Category.findById(parseInt(id), req.userId);
      
      if (!category) {
        return res.status(404).json({ 
          error: true, 
          message: 'Categoria não encontrada' 
        });
      }
      
      res.json({
        success: true,
        data: { category }
      });
    } catch (error) {
      console.error('Erro ao buscar categoria:', error);
      res.status(500).json({ 
        error: true, 
        message: 'Erro ao buscar categoria' 
      });
    }
  }
  
  static async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          error: true, 
          message: 'Dados inválidos', 
          errors: errors.array() 
        });
      }
      
      const category = await Category.create(req.userId, req.body);
      
      res.status(201).json({
        success: true,
        message: 'Categoria criada com sucesso',
        data: { category }
      });
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      res.status(500).json({ 
        error: true, 
        message: 'Erro ao criar categoria' 
      });
    }
  }
  
  static async update(req, res) {
    try {
      const { id } = req.params;
      const category = await Category.update(parseInt(id), req.userId, req.body);
      
      if (!category) {
        return res.status(404).json({ 
          error: true, 
          message: 'Categoria não encontrada ou não pode ser editada' 
        });
      }
      
      res.json({
        success: true,
        message: 'Categoria atualizada com sucesso',
        data: { category }
      });
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      res.status(500).json({ 
        error: true, 
        message: 'Erro ao atualizar categoria' 
      });
    }
  }
  
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Category.delete(parseInt(id), req.userId);
      
      if (!deleted) {
        return res.status(404).json({ 
          error: true, 
          message: 'Categoria não encontrada ou não pode ser excluída' 
        });
      }
      
      res.json({
        success: true,
        message: 'Categoria excluída com sucesso'
      });
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      res.status(500).json({ 
        error: true, 
        message: 'Erro ao excluir categoria' 
      });
    }
  }
}

module.exports = CategoryController;
