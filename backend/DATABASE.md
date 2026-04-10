# 📊 Estrutura do Banco de Dados

## Diagrama de Relacionamentos (ERD)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         GESTÃO FINANCEIRA                           │
│                          SQLite Database                            │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│       users          │
├──────────────────────┤
│ id (PK) INTEGER      │
│ name TEXT            │
│ email TEXT           │ UNIQUE
│ password TEXT        │
│ created_at DATETIME  │
│ updated_at DATETIME  │
└──────────┬───────────┘
           │
           │ 1
           │
           │ *
    ┌──────┴────────────────────────────────────┐
    │                                            │
    │                                            │
┌───┴──────────────┐     ┌──────────────────┐   │   ┌─────────────────┐
│   categories     │     │    accounts      │   │   │  transactions   │
├──────────────────┤     ├──────────────────┤   │   ├─────────────────┤
│ id (PK) INTEGER  │     │ id (PK) INTEGER  │   │   │ id (PK) INTEGER │
│ user_id (FK) INT │*──1─┤ user_id (FK) INT │*──┘   │ user_id (FK)    │
│ name TEXT        │     │ name TEXT        │       │ account_id (FK) │
│ type TEXT        │     │ type TEXT        │       │ category_id (FK)│
│ color TEXT       │     │ balance REAL     │       │ type TEXT       │
│ icon TEXT        │     │ currency TEXT    │       │ amount REAL     │
│ created_at       │     │ created_at       │       │ description     │
└────────┬─────────┘     │ updated_at       │       │ date TEXT       │
         │               └────────┬─────────┘       │ notes TEXT      │
         │ 0..1                   │ 0..1            │ created_at      │
         │                        │                 │ updated_at      │
         │      *                 │              *  │                 │
         └────────────────────────┴─────────────────┤                 │
                                                    └─────────────────┘

CONSTRAINTS:
  - users.email: UNIQUE
  - transactions.type: CHECK IN ('income', 'expense')
  - categories.type: CHECK IN ('income', 'expense')
  - ON DELETE CASCADE: users -> transactions, categories, accounts
  - ON DELETE SET NULL: accounts, categories -> transactions

INDEXES:
  - idx_transactions_user_id
  - idx_transactions_date
  - idx_transactions_type
  - idx_categories_user_id
  - idx_accounts_user_id
```

---

## Descrição das Tabelas

### 📋 users
Armazena os usuários do sistema.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INTEGER (PK) | Identificador único |
| name | TEXT | Nome completo |
| email | TEXT | Email (único) |
| password | TEXT | Senha criptografada (bcrypt) |
| created_at | TEXT | Data de criação (ISO 8601) |
| updated_at | TEXT | Data de atualização (ISO 8601) |

**Relacionamentos:**
- 1 usuário pode ter * transações
- 1 usuário pode ter * contas
- 1 usuário pode ter * categorias

---

### 📊 categories
Categorias de receitas e despesas.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INTEGER (PK) | Identificador único |
| user_id | INTEGER (FK) | ID do usuário (0 = categoria padrão) |
| name | TEXT | Nome da categoria |
| type | TEXT | Tipo: 'income' ou 'expense' |
| color | TEXT | Cor em hexadecimal |
| icon | TEXT | Nome do ícone |
| created_at | TEXT | Data de criação (ISO 8601) |

**Categorias Padrão (user_id = 0):**

*Receitas (income):*
1. Salário
2. Freelance
3. Investimentos
4. Outros

*Despesas (expense):*
5. Alimentação
6. Transporte
7. Moradia
8. Saúde
9. Educação
10. Lazer
11. Compras
12. Contas

---

### 💰 accounts
Contas bancárias, carteiras, etc.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INTEGER (PK) | Identificador único |
| user_id | INTEGER (FK) | ID do usuário |
| name | TEXT | Nome da conta |
| type | TEXT | Tipo (Corrente, Poupança, etc) |
| balance | REAL | Saldo atual |
| currency | TEXT | Moeda (BRL, USD, etc) |
| created_at | TEXT | Data de criação (ISO 8601) |
| updated_at | TEXT | Data de atualização (ISO 8601) |

**Atualização de Saldo:**
O saldo é atualizado automaticamente quando transações são criadas, atualizadas ou excluídas.

---

### 💸 transactions
Transações financeiras (receitas e despesas).

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INTEGER (PK) | Identificador único |
| user_id | INTEGER (FK) | ID do usuário |
| account_id | INTEGER (FK) | ID da conta (opcional) |
| category_id | INTEGER (FK) | ID da categoria (opcional) |
| type | TEXT | Tipo: 'income' ou 'expense' |
| amount | REAL | Valor |
| description | TEXT | Descrição |
| date | TEXT | Data da transação (ISO 8601) |
| notes | TEXT | Observações |
| created_at | TEXT | Data de criação (ISO 8601) |
| updated_at | TEXT | Data de atualização (ISO 8601) |

---

## Queries Importantes

### Saldo Total por Conta
```sql
SELECT 
  a.id,
  a.name,
  a.balance,
  COUNT(t.id) as transaction_count
FROM accounts a
LEFT JOIN transactions t ON a.id = t.account_id
WHERE a.user_id = ?
GROUP BY a.id, a.name, a.balance
```

### Transações do Mês Atual
```sql
SELECT 
  t.*,
  c.name as category_name,
  c.color as category_color,
  a.name as account_name
FROM transactions t
LEFT JOIN categories c ON t.category_id = c.id
LEFT JOIN accounts a ON t.account_id = a.id
WHERE t.user_id = ?
  AND strftime('%Y-%m', t.date) = strftime('%Y-%m', 'now')
ORDER BY t.date DESC
```

### Resumo Financeiro (Receitas vs Despesas)
```sql
SELECT 
  type,
  SUM(amount) as total,
  COUNT(*) as count,
  AVG(amount) as average
FROM transactions
WHERE user_id = ?
  AND date BETWEEN ? AND ?
GROUP BY type
```

### Top 5 Categorias com Mais Gastos
```sql
SELECT
  c.name,
  c.color,
  SUM(t.amount) as total,
  COUNT(t.id) as count
FROM transactions t
INNER JOIN categories c ON t.category_id = c.id
WHERE t.user_id = ?
  AND t.type = 'expense'
  AND t.date BETWEEN ? AND ?
GROUP BY c.name, c.color
ORDER BY total DESC
LIMIT 5
```

### Evolução do Saldo no Tempo
```sql
SELECT 
  date,
  SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) 
    OVER (ORDER BY date) as balance
FROM transactions
WHERE user_id = ?
ORDER BY date
```

---

## Índices para Performance

```sql
-- Transações por usuário (muito utilizado)
CREATE INDEX idx_transactions_user_id ON transactions(user_id);

-- Filtro por data
CREATE INDEX idx_transactions_date ON transactions(date);

-- Filtro por tipo
CREATE INDEX idx_transactions_type ON transactions(type);

-- Categorias por usuário
CREATE INDEX idx_categories_user_id ON categories(user_id);

-- Contas por usuário
CREATE INDEX idx_accounts_user_id ON accounts(user_id);
```

---

## Regras de Negócio

1. **Categorias Padrão (user_id = 0):**
   - São compartilhadas por todos os usuários
   - Não podem ser editadas ou excluídas pelos usuários
   - Usuários podem criar categorias personalizadas

2. **Saldo das Contas:**
   - É atualizado automaticamente ao criar/editar/excluir transações
   - Receitas (income) aumentam o saldo
   - Despesas (expense) diminuem o saldo

3. **Exclusão de Registros:**
   - Excluir usuário: exclui todas as suas transações, contas e categorias
   - Excluir conta/categoria: as transações relacionadas ficam com NULL

4. **Validações:**
   - Email deve ser único
   - Tipo de transação deve ser 'income' ou 'expense'
   - Tipo de categoria deve ser 'income' ou 'expense'
   - Valores monetários devem ser positivos

---

## Backup e Manutenção

### Backup do Banco de Dados
O SQLite usa um arquivo único (`database.sqlite`), então o backup é simples:

**Linux/Mac:**
```bash
cp backend/database.sqlite backend/database.backup.sqlite
```

**Windows:**
```bash
copy backend\database.sqlite backend\database.backup.sqlite
```

Ou programe backups automáticos copiando o arquivo para outro local seguro.

### Verificar Integridade
```sql
PRAGMA integrity_check;
```

### Estatísticas de Tabelas
```sql
SELECT 
  name AS table_name,
  (SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name=m.name) as row_count
FROM sqlite_master m
WHERE type = 'table'
  AND name NOT LIKE 'sqlite_%'
ORDER BY name;
```

### Otimizar Banco de Dados
```sql
VACUUM;
ANALYZE;
```
