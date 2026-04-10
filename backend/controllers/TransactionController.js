const Transaction = require('../models/Transaction');
const { validationResult } = require('express-validator');

class TransactionController {
  static async getAll(req, res) {
    try {
      const { type, startDate, endDate, categoryId, accountId } = req.query;
      
      const filters = {};
      if (type) filters.type = type;
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;
      if (categoryId) filters.categoryId = parseInt(categoryId);
      if (accountId) filters.accountId = parseInt(accountId);
      
      const transactions = await Transaction.findByUser(req.userId, filters);
      
      res.json({
        success: true,
        data: { transactions }
      });
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      res.status(500).json({ 
        error: true, 
        message: 'Erro ao buscar transações' 
      });
    }
  }
  
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const transaction = await Transaction.findById(parseInt(id), req.userId);
      
      if (!transaction) {
        return res.status(404).json({ 
          error: true, 
          message: 'Transação não encontrada' 
        });
      }
      
      res.json({
        success: true,
        data: { transaction }
      });
    } catch (error) {
      console.error('Erro ao buscar transação:', error);
      res.status(500).json({ 
        error: true, 
        message: 'Erro ao buscar transação' 
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
      
      const transaction = await Transaction.create(req.userId, req.body);
      
      res.status(201).json({
        success: true,
        message: 'Transação criada com sucesso',
        data: { transaction }
      });
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      res.status(500).json({ 
        error: true, 
        message: 'Erro ao criar transação' 
      });
    }
  }
  
  static async update(req, res) {
    try {
      const { id } = req.params;
      const transaction = await Transaction.update(parseInt(id), req.userId, req.body);
      
      if (!transaction) {
        return res.status(404).json({ 
          error: true, 
          message: 'Transação não encontrada' 
        });
      }
      
      res.json({
        success: true,
        message: 'Transação atualizada com sucesso',
        data: { transaction }
      });
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      res.status(500).json({ 
        error: true, 
        message: 'Erro ao atualizar transação' 
      });
    }
  }
  
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Transaction.delete(parseInt(id), req.userId);
      
      if (!deleted) {
        return res.status(404).json({ 
          error: true, 
          message: 'Transação não encontrada' 
        });
      }
      
      res.json({
        success: true,
        message: 'Transação excluída com sucesso'
      });
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
      res.status(500).json({ 
        error: true, 
        message: 'Erro ao excluir transação' 
      });
    }
  }
  
  static async getStats(req, res) {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({ 
          error: true, 
          message: 'As datas de início e fim são obrigatórias' 
        });
      }
      
      const stats = await Transaction.getStats(req.userId, startDate, endDate);
      
      res.json({
        success: true,
        data: { stats }
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      res.status(500).json({ 
        error: true, 
        message: 'Erro ao buscar estatísticas' 
      });
    }
  }
}

module.exports = TransactionController;
