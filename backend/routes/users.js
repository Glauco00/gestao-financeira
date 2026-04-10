const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Todas as rotas exigem autenticação
router.use(auth);

// Obter perfil do usuário
router.get('/profile', async (req, res) => {
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
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ 
      error: true, 
      message: 'Erro ao buscar perfil' 
    });
  }
});

// Atualizar perfil do usuário
router.put('/profile', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const updateData = {};
    
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) updateData.password = password;
    
    const user = await User.update(req.userId, updateData);
    
    if (!user) {
      return res.status(404).json({ 
        error: true, 
        message: 'Usuário não encontrado' 
      });
    }
    
    res.json({
      success: true,
      message: 'Perfil atualizado com sucesso',
      data: { user }
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ 
      error: true, 
      message: 'Erro ao atualizar perfil' 
    });
  }
});

module.exports = router;
