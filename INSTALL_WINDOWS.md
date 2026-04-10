# 🔧 INSTALAÇÃO - Problema com better-sqlite3 no Windows

## O Problema

O `better-sqlite3` precisa ser compilado no Windows quando não há binários pré-compilados para sua versão do Node.js.

**Você tem 3 opções:**

---

## ✅ OPÇÃO 1: Instalar Build Tools (MAS SIMPLES A LONGO PRAZO)

Instale as ferramentas de compilação necessárias:

```powershell
# Executar como Administrador
npm install --global windows-build-tools
```

OU instale manualmente:
1. Baixe Visual Studio Build Tools: https://visualstudio.microsoft.com/visual-cpp-build-tools/
2. Execute o instalador
3. Selecione "Desktop development with C++"
4. Instale (leva cerca de 10 minutos)

Depois disso:
```bash
cd backend
npm install
```

---

## ⚡ OPÇÃO 2: Usar SQL Server (Opção Original)

Se quiser começar AGORA sem instalar ferramentas extras:

### 1. Voltar para SQL Server

Ative os arquivos do SQL Server que já estão no projeto:

```bash
cd backend
git checkout HEAD -- package.json config/database.js models/
```

### 2. Instalar SQL Server Express

**Opção A - SQL Server Express (Grátis):**
1. Baixe: https://www.microsoft.com/pt-br/sql-server/sql-server-downloads
2. Escolha "Express" → Download → Instalação "Básico"
3. Aceite os termos e instale

**Opção B - Docker:**
```bash
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=SuaSenhaForte123!" -p 1433:1433 --name sqlserver -d mcr.microsoft.com/mssql/server:2019-latest
```

### 3. Configurar e iniciar

```bash
cd backend

# Edite o .env se necessário (usuário/senha SQL Server)
notepad .env

# Instalar dependências
npm install

# Criar banco
npm run migrate

# Dados de exemplo
npm run seed

# Iniciar
npm run dev
```

---

## 🚀 OPÇÃO 3: Usar Node.js LTS (Versão Estável)

Binários pré-compilados do `better-sqlite3` existem para Node.js LTS (v20.x):

1. Desinstale Node.js atual
2. Instale Node.js LTS: https://nodejs.org/ (versão 20.x)
3. Depois:
   ```bash
   cd backend
   npm install
   npm run migrate
   npm run dev
   ```

---

## 🤔 Qual Escolher?

| Opção | Tempo de setup | Simplicidade | Melhor para |
|-------|----------------|--------------|-------------|
| **Build Tools** | 10-15 min | Requer Admin | Uso permanente do SQLite |
| **SQL Server** | 5-10 min | Fácil | Começar agora mesmo |
| **Node LTS** | 5 min | Muito fácil | Quer trocar versão Node |

---

## 💡 Recomendação

- **Se é para estudar/testar**: Use SQL Server agora (Opção 2)
- **Se vai usar em produção**: Instale Build Tools (Opção 1) ou use Node LTS (Opção 3)

---

## 📝 Notas

- Todos os arquivos SQLite estão prontos no projeto
- A conversão SQL Server ↔ SQLite já está feita
- Ambas as soluções funcionam perfeitamente
- Escolha a que melhor se adequa ao seu tempo/necessidade agora

---

## 🆘 Precisa de Ajuda?

Se escolher SQL Server, siga: [QUICK_START.md](QUICK_START.md)
Se tiver Build Tools instalados: `cd backend && npm install && npm run migrate`

