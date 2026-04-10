# 🎯 QUICK START - Comece em 2 minutos!

## Passo 1: Configurar Backend

```bash
# Entrar na pasta backend
cd backend

# Instalar dependências
npm install

# Criar banco de dados e tabelas automaticamente
npm run migrate

# (Opcional) Popular com dados de exemplo
npm run seed

# Iniciar servidor
npm run dev
```

O backend estará em: http://localhost:3001

**Pronto!** O SQLite criou o banco automaticamente em `backend/database.sqlite` 🎉

---

## Passo 2: Iniciar Frontend

**Em outro terminal:**

```bash
# Voltar para a raiz do projeto
cd ..

# Instalar dependências (se ainda não instalou)
npm install

# Iniciar frontend
npm run dev
```

O frontend estará em: http://localhost:5173

---

## Passo 3: Testar

### Se você rodou o seed (npm run seed):

1. Acesse: http://localhost:5173
2. Clique em "Login"
3. Use:
   - **Email:** `teste@email.com`
   - **Senha:** `123456`
4. Pronto! Você terá dados de exemplo para explorar

### Se não rodou o seed:

1. Acesse: http://localhost:5173
2. Clique em "Registrar"
3. Crie sua conta
4. Faça login
5. Comece adicionando contas e transações

---

## ✅ Verificação Rápida

### Backend funcionando?
Abra no navegador: http://localhost:3001/api/health

Deve mostrar:
```json
{
  "status": "ok",
  "message": "API Gestão Financeira está rodando!",
  "timestamp": "..."
}
```

### Frontend funcionando?
Abra no navegador: http://localhost:5173

Deve mostrar a tela de login/registro.

---

## 🚨 Problemas Comuns

### "Banco de dados não foi criado"
Execute novamente:
```bash
cd backend
npm run migrate
```

O arquivo `database.sqlite` será criado automaticamente em `backend/`.

### "A porta 3001 já está em uso"
No arquivo `backend\.env`, mude:
```
PORT=3002
```

E no arquivo `src\services\api.js`, mude:
```javascript
baseURL: 'http://localhost:3002/api'
```

---

## 📚 Arquivos de Documentação

- **COMO_INICIAR.md** - Guia completo de instalação
- **backend/README.md** - Documentação do backend
- **backend/API_TESTS.md** - Exemplos de requisições
- **backend/DATABASE.md** - Estrutura do banco de dados

---

## 🎉 Pronto!

Agora você tem:
- ✅ Backend rodando com Node.js + Express + SQLite
- ✅ Autenticação JWT
- ✅ CRUD completo de transações, contas e categorias
- ✅ Frontend React conectado ao backend
- ✅ Banco de dados estruturado e portátil

**Próximos passos:**
- Explore a aplicação
- Adicione suas transações
- Veja os relatórios no Dashboard
- Personalize as categorias
- Gerencie suas contas

Boa sorte! 🚀
