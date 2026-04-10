const Account = require('../models/Account');
const { validationResult } = require('express-validator');

class AccountController {
  static async getAll(req, res) {
    try {
      const accounts = await Account.findByUser(req.userId);
      const totalBalance = await Account.getTotalBalance(req.userId);
      
      res.json({
        success: true,
        data: { accounts, totalBalance }
      });
    } catch (error) {
      console.error('Erro ao buscar contas:', error);
      res.status(500).json({ 
        error: true, 
        message: 'Erro ao buscar contas' 
      });
    }
  }
  
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const account = await Account.findById(parseInt(id), req.userId);
      
      if (!account) {
        return res.status(404).json({ 
          error: true, 
          message: 'Conta não encontrada' 
        });
      }
      
      res.json({
        success: true,
        data: { account }
      });
    } catch (error) {
      console.error('Erro ao buscar conta:', error);
      res.status(500).json({ 
        error: true, 
        message: 'Erro ao buscar conta' 
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
      
      const account = await Account.create(req.userId, req.body);
      
      res.status(201).json({
        success: true,
        message: 'Conta criada com sucesso',
        data: { account }
      });
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      res.status(500).json({ 
        error: true, 
        message: 'Erro ao criar conta' 
      });
    }
  }
  
  static async update(req, res) {
    try {
      const { id } = req.params;
      const account = await Account.update(parseInt(id), req.userId, req.body);
      
      if (!account) {
        return res.status(404).json({ 
          error: true, 
          message: 'Conta não encontrada' 
        });
      }
      
      res.json({
        success: true,
        message: 'Conta atualizada com sucesso',
        data: { account }
      });
    } catch (error) {
      console.error('Erro ao atualizar conta:', error);
      res.status(500).json({ 
        error: true, 
        message: 'Erro ao atualizar conta' 
      });
    }
  }
  
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Account.delete(parseInt(id), req.userId);
      
      if (!deleted) {
        return res.status(404).json({ 
          error: true, 
          message: 'Conta não encontrada' 
        });
      }
      
      res.json({
        success: true,
        message: 'Conta excluída com sucesso'
      });
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
      res.status(500).json({ 
        error: true, 
        message: 'Erro ao excluir conta' 
      });
    }
  }
}

module.exports = AccountController;
