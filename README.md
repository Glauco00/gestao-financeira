# 💰 Gestão Financeira - Full Stack

Sistema completo de gestão financeira pessoal com backend em Node.js + SQLite e frontend em React + Vite.

## 🌟 Características

- ✅ **Autenticação segura** com JWT
- 💸 **Controle de transações** (receitas e despesas)
- 🏦 **Gerenciamento de contas** bancárias
- 📊 **Categorias personalizáveis**
- 📈 **Dashboard com gráficos** e estatísticas
- 💾 **Banco de dados SQLite** simples e portátil
- 🔒 **API RESTful** completa e documentada
- 🚀 **Zero configuração** - Sem necessidade de instalar banco de dados!

## 🚀 Início Rápido

### Opção 1: Setup Automático (Windows)

Execute o arquivo `setup.bat` na raiz do projeto:
```bash
setup.bat
```

Depois, para iniciar os servidores:
```bash
start.bat
```

### Opção 2: Manual

Veja o arquivo **[QUICK_START.md](QUICK_START.md)** para instruções detalhadas.

## 📚 Documentação Completa

- **[QUICK_START.md](QUICK_START.md)** - Comece em 2 minutos
- **[COMO_INICIAR.md](COMO_INICIAR.md)** - Guia completo de instalação
- **[backend/README.md](backend/README.md)** - Documentação da API
- **[backend/API_TESTS.md](backend/API_TESTS.md)** - Exemplos de requisições
- **[backend/DATABASE.md](backend/DATABASE.md)** - Estrutura do banco de dados

## 🏗️ Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **SQLite** - Banco de dados leve e portátil
- **JWT** - Autenticação
- **bcryptjs** - Criptografia
- **better-sqlite3** - Driver SQLite

### Frontend
- **React 18** - Framework UI
- **Vite** - Build tool
- **React Router** - Roteamento
- **Chart.js / Recharts** - Gráficos
- **Axios** - Cliente HTTP

## 📂 Estrutura do Projeto

```
gestao-financeira-vite-react/
├── backend/                      # 🔧 API Node.js + Express
│   ├── config/                   # Configuração do banco
│   │   └── database.js
│   ├── controllers/              # Lógica de negócio
│   │   ├── AuthController.js
│   │   ├── TransactionController.js
│   │   ├── AccountController.js
│   │   └── CategoryController.js
│   ├── middleware/               # Autenticação JWT
│   │   └── auth.js
│   ├── models/                   # Modelos de dados
│   │   ├── User.js
│   │   ├── Transaction.js
│   │   ├── Account.js
│   │   └── Category.js
│   ├── routes/                   # Rotas da API
│   │   ├── auth.js
│   │   ├── transactions.js
│   │   ├── accounts.js
│   │   ├── categories.js
│   │   └── users.js
│   ├── scripts/                  # Scripts utilitários
│   │   ├── migrate.js           # Criar banco e tabelas
│   │   ├── seed.js              # Dados de exemplo
│   │   └── test-connection.js   # Testar banco de dados
│   ├── .env                      # Variáveis de ambiente
│   ├── .env.example
│   ├── database.sqlite           # Arquivo do banco de dados SQLite
│   ├── server.js                 # Ponto de entrada
│   ├── package.json
│   ├── README.md                 # Documentação do backend
│   ├── API_TESTS.md             # Exemplos de uso da API
│   └── DATABASE.md              # Estrutura do banco
│
├── src/                          # 🎨 Frontend React
│   ├── components/              # Componentes reutilizáveis
│   │   ├── Layout.jsx
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   ├── TransactionList.jsx
│   │   ├── TransactionForm.jsx
│   │   └── charts/
│   │       ├── BalanceChart.jsx
│   │       └── DashboardCharts.jsx
│   ├── context/                 # Context API
│   │   ├── AuthContext.jsx
│   │   ├── SidebarContext.jsx
│   │   └── TransactionsContext.jsx
│   ├── hooks/                   # Custom hooks
│   │   └── useTransactions.js
│   ├── pages/                   # Páginas da aplicação
│   │   ├── Dashboard.jsx
│   │   ├── Transacoes.jsx
│   │   ├── Contas.jsx
│   │   ├── Relatorios.jsx
│   │   ├── Configuracoes.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── AddTransaction.jsx
│   ├── routes/                  # Configuração de rotas
│   │   └── index.jsx
│   ├── services/                # Serviços e API
│   │   ├── api.js              # Cliente HTTP (Axios)
│   │   └── storage.js
│   ├── stores/                  # Gerenciamento de estado
│   │   └── transactionStore.js
│   ├── styles/                  # Estilos globais
│   │   ├── index.css
│   │   └── variables.css
│   ├── utils/                   # Funções utilitárias
│   │   └── format.js
│   ├── App.jsx                  # Componente principal
│   └── main.jsx                 # Ponto de entrada
│
├── public/                       # Arquivos estáticos
│   └── robots.txt
│
├── tests/                        # Testes
│   ├── App.test.jsx
│   └── setupTests.js
│
├── index.html                    # HTML principal
├── package.json                  # Dependências do frontend
├── vite.config.mjs              # Configuração do Vite
├── setup.bat                     # ⚡ Instalação automática (Windows)
├── start.bat                     # ⚡ Iniciar servidores (Windows)
├── QUICK_START.md               # 🚀 Guia início rápido
├── COMO_INICIAR.md              # 📖 Guia completo
└── README.md                    # Este arquivo
```

## 🔑 Primeiros Passos

### 1. Pré-requisitos

- ✅ Node.js 14+ instalado
- ✅ npm ou yarn

**Só isso!** O banco de dados SQLite é criado automaticamente. 🎉

### 2. Instalação Rápida

**Windows (Automático):**
```bash
setup.bat
```

**Manual:**
```bash
# Instalar dependências do backend
cd backend
npm install

# O arquivo .env já vem configurado
# (opcional: você pode editar backend/.env)

# Criar banco de dados e tabelas
npm run migrate

# (Opcional) Popular com dados de exemplo
npm run seed

# Voltar à raiz
cd ..

# Instalar dependências do frontend
npm install
```

### 3. Executar

**Windows (Automático):**
```bash
start.bat
```

**Manual:**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
npm run dev
```

Acesse: http://localhost:5173

## 🎯 Funcionalidades

### ✅ Autenticação
- Registro de usuários
- Login com JWT
- Proteção de rotas

### 💸 Transações
- Adicionar receitas e despesas
- Editar e excluir transações
- Filtrar por data, categoria e conta
- Estatísticas detalhadas

### 🏦 Contas
- Criar múltiplas contas
- Atualização automática de saldos
- Visualizar histórico por conta

### 📊 Categorias
- Categorias padrão pré-configuradas
- Criar categorias personalizadas
- Ícones e cores customizáveis

### 📈 Dashboard
- Gráficos de receitas vs despesas
- Evolução temporal
- Resumo financeiro

## 🔐 API Endpoints

### Autenticação
```
POST /api/auth/register  - Registrar usuário
POST /api/auth/login     - Login
GET  /api/auth/me        - Dados do usuário logado
```

### Transações
```
GET    /api/transactions       - Listar (com filtros)
GET    /api/transactions/:id   - Buscar por ID
POST   /api/transactions       - Criar
PUT    /api/transactions/:id   - Atualizar
DELETE /api/transactions/:id   - Excluir
GET    /api/transactions/stats - Estatísticas
```

### Contas
```
GET    /api/accounts       - Listar
POST   /api/accounts       - Criar
PUT    /api/accounts/:id   - Atualizar
DELETE /api/accounts/:id   - Excluir
```

### Categorias
```
GET    /api/categories       - Listar
POST   /api/categories       - Criar
PUT    /api/categories/:id   - Atualizar
DELETE /api/categories/:id   - Excluir
```

Veja [backend/API_TESTS.md](backend/API_TESTS.md) para exemplos completos.

## 🗃️ Banco de Dados

### Tabelas:
- **users** - Usuários do sistema
- **transactions** - Transações financeiras
- **accounts** - Contas bancárias
- **categories** - Categorias de receitas/despesas

Veja [backend/DATABASE.md](backend/DATABASE.md) para diagrama completo.

## 🛠️ Scripts Disponíveis

### Backend
```bash
cd backend
npm run dev        # Servidor com auto-reload
npm start          # Servidor produção
npm run migrate    # Criar banco e tabelas
npm run seed       # Popular com dados de exemplo
npm run test-db    # Testar conexão com banco de dados
```

### Frontend
```bash
npm run dev        # Servidor desenvolvimento
npm run build      # Build para produção
npm run serve      # Preview do build
```

## 🧪 Testando

### Usuário de Teste (após `npm run seed`):
```
Email: teste@email.com
Senha: 123456
```

### Testar API com PowerShell:
```powershell
# Login
$response = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" `
  -Method Post `
  -Body (@{email="teste@email.com"; password="123456"} | ConvertTo-Json) `
  -ContentType "application/json"

$token = $response.data.token

# Listar transações
$headers = @{ Authorization = "Bearer $token" }
Invoke-RestMethod -Uri "http://localhost:3001/api/transactions" -Headers $headers
```

## 🚨 Solução de Problemas

### Banco de dados não foi criado?
Execute novamente:
```bash
cd backend
npm run migrate
```

O arquivo `database.sqlite` será criado automaticamente na pasta `backend/`.

### Porta já em uso?
Altere no `backend/.env`:
```env
PORT=3002
```

E no `src/services/api.js`:
```javascript
baseURL: 'http://localhost:3002/api'
```

### Mais ajuda?
Consulte [COMO_INICIAR.md](COMO_INICIAR.md) para guia completo.

## 🤝 Contribuindo

Contribuições são bem-vindas! 

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

Desenvolvido com ❤️ para facilitar o controle financeiro pessoal.

---

⭐ Se este projeto te ajudou, considere dar uma estrela!