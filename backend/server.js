require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log de requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rotas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/accounts', require('./routes/accounts'));
app.use('/api/categories', require('./routes/categories'));

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'API Gestão Financeira está rodando!',
    timestamp: new Date().toISOString()
  });
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(err.status || 500).json({
    error: true,
    message: err.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Rota 404
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: true, 
    message: 'Rota não encontrada' 
  });
});

// Iniciar servidor
async function startServer() {
  try {
    // Testar conexão com o banco
    await testConnection();
    console.log('✓ Conexão com SQL Server estabelecida com sucesso!');
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✓ Servidor rodando na porta ${PORT}`);
      console.log(`✓ Modo: ${process.env.NODE_ENV}`);
      console.log(`✓ Acesse: http://0.0.0.0:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('✗ Erro ao iniciar servidor:', error.message);
    process.exit(1);
  }
}

startServer();
