# Backend - Gestão Financeira

API RESTful para o sistema de gestão financeira, construída com Node.js, Express e SQLite.

## 🚀 Tecnologias

- **Node.js** - Ambiente de execução JavaScript
- **Express** - Framework web
- **SQLite** - Banco de dados leve e portátil
- **better-sqlite3** - Driver SQLite síncrono e rápido
- **JWT** - Autenticação via tokens
- **bcryptjs** - Criptografia de senhas
- **express-validator** - Validação de dados

## 📋 Pré-requisitos

- Node.js 14+ instalado
- npm ou yarn

**Só isso!** O SQLite é criado automaticamente. 🎉

## 🔧 Instalação

1. **Navegue até a pasta do backend:**
   ```bash
   cd backend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente (Opcional):**
   
   O arquivo `.env` já vem configurado com valores padrão:
   ```env
   PORT=3001
   NODE_ENV=development
   
   # SQLite
   DB_PATH=./database.sqlite
   
   # JWT
   JWT_SECRET=seu_secret_key_super_seguro_aqui
   JWT_EXPIRES_IN=7d
   ```
   
   **Você só precisa editar se quiser mudar a porta ou o JWT secret.**

4. **Execute as migrações do banco de dados:**
   ```bash
   npm run migrate
   ```
   
   Esse comando irá:
   - Criar o banco de dados SQLite automaticamente
   - Criar todas as tabelas necessárias
   - Inserir categorias padrão

## ▶️ Executando

### Modo de desenvolvimento (com auto-reload):
```bash
npm run dev
```

### Modo de produção:
```bash
npm start
```

O servidor estará rodando em `http://localhost:3001`

## 📚 Estrutura do Banco de Dados

### Tabelas:

- **users** - Usuários do sistema
- **transactions** - Transações financeiras
- **accounts** - Contas bancárias/carteiras
- **categories** - Categorias de receitas e despesas

### Relacionamentos:

- Cada usuário pode ter várias transações, contas e categorias
- Cada transação pertence a um usuário, pode ter uma conta e uma categoria
- Categorias padrão (user_id = 0) são compartilhadas por todos os usuários

## 🔐 Endpoints da API

### Autenticação

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/auth/register` | Registrar novo usuário | Não |
| POST | `/api/auth/login` | Login | Não |
| GET | `/api/auth/me` | Dados do usuário logado | Sim |

### Transações

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/transactions` | Listar transações | Sim |
| GET | `/api/transactions/:id` | Buscar transação | Sim |
| POST | `/api/transactions` | Criar transação | Sim |
| PUT | `/api/transactions/:id` | Atualizar transação | Sim |
| DELETE | `/api/transactions/:id` | Excluir transação | Sim |
| GET | `/api/transactions/stats` | Estatísticas | Sim |

### Contas

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/accounts` | Listar contas | Sim |
| GET | `/api/accounts/:id` | Buscar conta | Sim |
| POST | `/api/accounts` | Criar conta | Sim |
| PUT | `/api/accounts/:id` | Atualizar conta | Sim |
| DELETE | `/api/accounts/:id` | Excluir conta | Sim |

### Categorias

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/categories` | Listar categorias | Sim |
| GET | `/api/categories/:id` | Buscar categoria | Sim |
| POST | `/api/categories` | Criar categoria | Sim |
| PUT | `/api/categories/:id` | Atualizar categoria | Sim |
| DELETE | `/api/categories/:id` | Excluir categoria | Sim |

## 📝 Exemplos de Uso

### Registro de Usuário
```bash
POST http://localhost:3001/api/auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123"
}
```

### Login
```bash
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
  "email": "joao@email.com",
  "password": "senha123"
}
```

### Criar Transação
```bash
POST http://localhost:3001/api/transactions
Authorization: Bearer {seu_token}
Content-Type: application/json

{
  "type": "expense",
  "amount": 150.00,
  "description": "Compras no mercado",
  "category_id": 5,
  "account_id": 1,
  "date": "2026-02-09"
}
```

## 🔑 Autenticação

A API usa JWT (JSON Web Tokens) para autenticação. Após o login ou registro, você receberá um token que deve ser incluído no header das requisições:

```
Authorization: Bearer seu_token_aqui
```

## ⚠️ Solução de Problemas

### Banco de dados não foi criado:

Execute novamente as migrações:
```bash
npm run migrate
```

O arquivo `database.sqlite` será criado automaticamente na pasta `backend/`.

### Porta já em uso:

Altere a porta no arquivo `.env`:
```env
PORT=3002
```

## 📄 Licença

MIT
