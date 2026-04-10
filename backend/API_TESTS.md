# Coleção de Testes da API - Gestão Financeira

Este arquivo contém exemplos de requisições para testar a API.
Use uma ferramenta como Postman, Insomnia ou Thunder Client (extensão do VS Code).

## Variáveis

```
BASE_URL = http://localhost:3001/api
TOKEN = (será obtido após login)
```

---

## 1. AUTENTICAÇÃO

### 1.1 Registrar Usuário

```http
POST {{BASE_URL}}/auth/register
Content-Type: application/json

{
  "name": "Maria Silva",
  "email": "maria@email.com",
  "password": "senha123"
}
```

### 1.2 Login

```http
POST {{BASE_URL}}/auth/login
Content-Type: application/json

{
  "email": "maria@email.com",
  "password": "senha123"
}
```

**Resposta:** Guarde o `token` retornado para usar nas próximas requisições.

### 1.3 Obter Dados do Usuário Logado

```http
GET {{BASE_URL}}/auth/me
Authorization: Bearer {{TOKEN}}
```

---

## 2. CATEGORIAS

### 2.1 Listar Todas as Categorias

```http
GET {{BASE_URL}}/categories
Authorization: Bearer {{TOKEN}}
```

### 2.2 Listar Categorias de Receita

```http
GET {{BASE_URL}}/categories?type=income
Authorization: Bearer {{TOKEN}}
```

### 2.3 Listar Categorias de Despesa

```http
GET {{BASE_URL}}/categories?type=expense
Authorization: Bearer {{TOKEN}}
```

### 2.4 Criar Nova Categoria

```http
POST {{BASE_URL}}/categories
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
  "name": "Investimentos Cripto",
  "type": "income",
  "color": "#FF9800",
  "icon": "currency_bitcoin"
}
```

### 2.5 Atualizar Categoria

```http
PUT {{BASE_URL}}/categories/1
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
  "name": "Salário Atualizado",
  "color": "#00FF00"
}
```

### 2.6 Excluir Categoria

```http
DELETE {{BASE_URL}}/categories/13
Authorization: Bearer {{TOKEN}}
```

---

## 3. CONTAS

### 3.1 Listar Todas as Contas

```http
GET {{BASE_URL}}/accounts
Authorization: Bearer {{TOKEN}}
```

### 3.2 Buscar Conta por ID

```http
GET {{BASE_URL}}/accounts/1
Authorization: Bearer {{TOKEN}}
```

### 3.3 Criar Nova Conta

```http
POST {{BASE_URL}}/accounts
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
  "name": "Cartão de Crédito",
  "type": "Crédito",
  "balance": -1500.00,
  "currency": "BRL"
}
```

### 3.4 Atualizar Conta

```http
PUT {{BASE_URL}}/accounts/1
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
  "name": "Conta Corrente Itaú",
  "balance": 3500.00
}
```

### 3.5 Excluir Conta

```http
DELETE {{BASE_URL}}/accounts/3
Authorization: Bearer {{TOKEN}}
```

---

## 4. TRANSAÇÕES

### 4.1 Listar Todas as Transações

```http
GET {{BASE_URL}}/transactions
Authorization: Bearer {{TOKEN}}
```

### 4.2 Filtrar Transações por Tipo (Receitas)

```http
GET {{BASE_URL}}/transactions?type=income
Authorization: Bearer {{TOKEN}}
```

### 4.3 Filtrar Transações por Período

```http
GET {{BASE_URL}}/transactions?startDate=2026-02-01&endDate=2026-02-28
Authorization: Bearer {{TOKEN}}
```

### 4.4 Filtrar por Categoria e Conta

```http
GET {{BASE_URL}}/transactions?categoryId=5&accountId=1
Authorization: Bearer {{TOKEN}}
```

### 4.5 Buscar Transação por ID

```http
GET {{BASE_URL}}/transactions/1
Authorization: Bearer {{TOKEN}}
```

### 4.6 Criar Nova Transação (Despesa)

```http
POST {{BASE_URL}}/transactions
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
  "type": "expense",
  "amount": 250.00,
  "description": "Compras no shopping",
  "category_id": 11,
  "account_id": 1,
  "date": "2026-02-09",
  "notes": "Compras de roupas e eletrônicos"
}
```

### 4.7 Criar Nova Transação (Receita)

```http
POST {{BASE_URL}}/transactions
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
  "type": "income",
  "amount": 1500.00,
  "description": "Projeto freelance",
  "category_id": 2,
  "account_id": 2,
  "date": "2026-02-10"
}
```

### 4.8 Atualizar Transação

```http
PUT {{BASE_URL}}/transactions/1
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
  "amount": 280.00,
  "description": "Compras no shopping (atualizado)",
  "notes": "Incluindo taxa de estacionamento"
}
```

### 4.9 Excluir Transação

```http
DELETE {{BASE_URL}}/transactions/5
Authorization: Bearer {{TOKEN}}
```

### 4.10 Obter Estatísticas

```http
GET {{BASE_URL}}/transactions/stats?startDate=2026-02-01&endDate=2026-02-28
Authorization: Bearer {{TOKEN}}
```

---

## 5. PERFIL DO USUÁRIO

### 5.1 Obter Perfil

```http
GET {{BASE_URL}}/users/profile
Authorization: Bearer {{TOKEN}}
```

### 5.2 Atualizar Perfil

```http
PUT {{BASE_URL}}/users/profile
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
  "name": "Maria Silva Santos",
  "email": "maria.santos@email.com"
}
```

### 5.3 Alterar Senha

```http
PUT {{BASE_URL}}/users/profile
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
  "password": "novaSenha123"
}
```

---

## 6. HEALTH CHECK

### 6.1 Verificar Status da API

```http
GET {{BASE_URL}}/health
```

---

## Códigos de Status HTTP

- `200 OK` - Requisição bem-sucedida
- `201 Created` - Recurso criado com sucesso
- `400 Bad Request` - Dados inválidos
- `401 Unauthorized` - Não autenticado ou token inválido
- `404 Not Found` - Recurso não encontrado
- `409 Conflict` - Conflito (ex: email já cadastrado)
- `500 Internal Server Error` - Erro no servidor

---

## Dicas

1. **Token expirado?** Faça login novamente para obter um novo token
2. **Erro 401?** Verifique se o token está correto no header Authorization
3. **Erro de validação?** Verifique os campos obrigatórios no modelo
4. **Use o VS Code?** Instale a extensão "REST Client" para testar direto no editor

---

## Testando com PowerShell

### Login
```powershell
$response = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method Post -Body (@{email="teste@email.com"; password="123456"} | ConvertTo-Json) -ContentType "application/json"
$token = $response.data.token
```

### Listar Transações
```powershell
$headers = @{ Authorization = "Bearer $token" }
Invoke-RestMethod -Uri "http://localhost:3001/api/transactions" -Headers $headers
```

### Criar Transação
```powershell
$body = @{
  type = "expense"
  amount = 100.00
  description = "Test"
  category_id = 5
  account_id = 1
  date = (Get-Date -Format "yyyy-MM-dd")
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/api/transactions" -Method Post -Headers $headers -Body $body -ContentType "application/json"
```
