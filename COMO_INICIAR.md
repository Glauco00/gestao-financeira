# 🚀 COMO INICIAR O PROJETO

## Backend (API)

### 1. Instalar dependências do backend
```bash
cd backend
npm install
```

### 2. Banco de dados SQLite

O SQLite já vem configurado! Não precisa instalar nada. 🎉

O arquivo do banco de dados (`database.sqlite`) será criado automaticamente na pasta `backend/` quando você executar as migrações.

### 3. Configurar variáveis de ambiente (Opcional)

O arquivo `backend/.env` já vem configurado com valores padrão:

```env
PORT=3001
NODE_ENV=development

# SQLite
DB_PATH=./database.sqlite

# JWT
JWT_SECRET=seu_secret_key_super_seguro_mude_isso_em_producao
JWT_EXPIRES_IN=7d
```

**Você só precisa editar se quiser mudar a porta ou o JWT secret.**

### 4. Criar banco de dados e tabelas

```bash
npm run migrate
```

Você deve ver:
```
✓ Banco de dados SQLite criado com sucesso!
✓ Tabelas criadas: users, categories, accounts, transactions
✓ Índices criados para melhor performance
✓ Categorias padrão inseridas
✓ Todas as migrações foram executadas com sucesso!
```

### 5. Iniciar o servidor backend

**Modo desenvolvimento (com auto-reload):**
```bash
npm run dev
```

**Modo produção:**
```bash
npm start
```

O backend estará rodando em: **http://localhost:3001**

---

## Frontend (React)

### 1. Em um novo terminal, voltar para a raiz do projeto
```bash
cd ..
```

### 2. Instalar dependências (se ainda não instalou)
```bash
npm install
```

### 3. Iniciar o frontend
```bash
npm run dev
```

O frontend estará rodando em: **http://localhost:5173** (ou outra porta informada)

---

## ✅ Verificar se está funcionando

### Testar o Backend

1. Abra o navegador e acesse: http://localhost:3001/api/health
   
   Você deve ver:
   ```json
   {
     "status": "ok",
     "message": "API Gestão Financeira está rodando!",
     "timestamp": "2026-02-09T..."
   }
   ```

2. Ou use o PowerShell:
   ```powershell
   Invoke-RestMethod -Uri "http://localhost:3001/api/health"
   ```

### Testar o Frontend

Acesse http://localhost:5173 e você deve ver a aplicação de gestão financeira.

---

## 📋 Estrutura de Pastas

```
gestao-financeira-vite-react/
├── backend/                    # API Node.js + Express
│   ├── config/                 # Configuração do banco
│   ├── controllers/            # Lógica de negócio
│   ├── middleware/             # Autenticação, etc
│   ├── models/                 # Modelos de dados
│   ├── routes/                 # Rotas da API
│   ├── scripts/                # Scripts de migração
│   ├── .env                    # Variáveis de ambiente
│   ├── package.json
│   └── server.js               # Ponto de entrada
│
├── src/                        # Frontend React
│   ├── components/
│   ├── pages/
│   ├── services/
│   │   └── api.js              # Cliente HTTP (conecta ao backend)
│   └── ...
│
├── package.json
└── vite.config.mjs
```

---

## 🔥 Comandos Úteis

### Backend

```bash
cd backend

# Desenvolvimento (auto-reload)
npm run dev

# Produção
npm start

# Recriar banco de dados
npm run migrate

# Ver logs do servidor
# Os logs aparecem no terminal onde você executou npm run dev
```

### Frontend

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run serve
```

---

## 🛠️ Solução de Problemas

### ❌ Banco de dados não foi criado

**Solução:** Execute novamente as migrações:
```bash
cd backend
npm run migrate
```

O arquivo `database.sqlite` será criado na pasta `backend/`.

### ❌ Porta 3001 já em uso

**Solução:** Altere a porta no arquivo `backend/.env`:
```env
PORT=3002
```

E no frontend `src/services/api.js`:
```javascript
baseURL: 'http://localhost:3002/api',
```

### ❌ CORS Error no frontend

**Causa:** Backend não está rodando ou URL incorreta

**Solução:**
1. Verifique se o backend está rodando em http://localhost:3001
2. Verifique o `baseURL` em `src/services/api.js`

---

## 📚 Próximos Passos

1. **Registrar um usuário:**
   - Acesse a tela de registro no frontend
   - Crie sua conta

2. **Fazer login:**
   - Use suas credenciais para entrar

3. **Criar contas:**
   - Adicione suas contas bancárias (Conta Corrente, Poupança, etc)

4. **Adicionar transações:**
   - Registre suas receitas e despesas

5. **Ver estatísticas:**
   - Acesse o Dashboard para ver gráficos e relatórios

---

## 🔒 Segurança

**IMPORTANTE:** Antes de colocar em produção:

1. Altere o `JWT_SECRET` no `.env` para um valor único e secreto
2. Configure HTTPS
3. Não commite o arquivo `.env` no Git
4. Use variáveis de ambiente seguras no servidor de produção
5. Considere usar um banco de dados mais robusto (PostgreSQL, MySQL) para produção

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs do backend no terminal
2. Verifique o Console do navegador (F12) para erros do frontend
3. Verifique se as portas 3001 e 5173 não estão bloqueadas pelo firewall
