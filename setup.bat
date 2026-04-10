@echo off
chcp 65001 >nul
cls
echo ═══════════════════════════════════════════════════════════
echo   🚀 SETUP AUTOMÁTICO - GESTÃO FINANCEIRA
echo ═══════════════════════════════════════════════════════════
echo.

echo ⏳ Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js não encontrado!
    echo    Baixe em: https://nodejs.org
    pause
    exit /b 1
)
echo ✅ Node.js instalado
echo.

echo ═══════════════════════════════════════════════════════════
echo   📦 INSTALANDO DEPENDÊNCIAS DO BACKEND
echo ═══════════════════════════════════════════════════════════
echo.

cd backend
if errorlevel 1 (
    echo ❌ Pasta backend não encontrada
    pause
    exit /b 1
)

echo ⏳ Instalando dependências...
call npm install
if errorlevel 1 (
    echo ❌ Erro ao instalar dependências do backend
    pause
    exit /b 1
)
echo ✅ Dependências do backend instaladas
echo.

echo ═══════════════════════════════════════════════════════════
echo   🔧 CONFIGURAÇÃO DO BANCO DE DADOS
echo ═══════════════════════════════════════════════════════════
echo.
echo IMPORTANTE: Verifique se o arquivo .env está configurado
echo com as credenciais corretas do seu SQL Server!
echo.
echo Arquivo: backend\.env
echo.
pause

echo ⏳ Testando conexão com SQL Server...
call npm run test-db
if errorlevel 1 (
    echo.
    echo ❌ Falha ao conectar no SQL Server
    echo.
    echo 💡 Dicas:
    echo    1. Verifique se o SQL Server está rodando
    echo    2. Confirme as credenciais no arquivo backend\.env
    echo    3. Veja o arquivo QUICK_START.md para mais ajuda
    echo.
    pause
    exit /b 1
)
echo.

echo ═══════════════════════════════════════════════════════════
echo   🗄️ CRIANDO BANCO DE DADOS E TABELAS
echo ═══════════════════════════════════════════════════════════
echo.

echo ⏳ Executando migrações...
call npm run migrate
if errorlevel 1 (
    echo ❌ Erro ao criar banco de dados
    pause
    exit /b 1
)
echo.

echo ═══════════════════════════════════════════════════════════
echo   🌱 DADOS DE EXEMPLO
echo ═══════════════════════════════════════════════════════════
echo.
echo Deseja popular o banco com dados de exemplo?
echo (Usuário: teste@email.com / Senha: 123456)
echo.
choice /C SN /M "Popular com dados de exemplo"
if errorlevel 2 goto skip_seed
if errorlevel 1 goto do_seed

:do_seed
echo.
echo ⏳ Populando banco de dados...
call npm run seed
echo.
goto after_seed

:skip_seed
echo ⏭️ Pulando dados de exemplo
echo.

:after_seed

cd ..

echo ═══════════════════════════════════════════════════════════
echo   📦 INSTALANDO DEPENDÊNCIAS DO FRONTEND
echo ═══════════════════════════════════════════════════════════
echo.

echo ⏳ Instalando dependências...
call npm install
if errorlevel 1 (
    echo ❌ Erro ao instalar dependências do frontend
    pause
    exit /b 1
)
echo ✅ Dependências do frontend instaladas
echo.

echo ═══════════════════════════════════════════════════════════
echo   ✅ INSTALAÇÃO CONCLUÍDA!
echo ═══════════════════════════════════════════════════════════
echo.
echo 🎉 Tudo pronto para usar!
echo.
echo 📝 Para iniciar os servidores:
echo.
echo    Backend:
echo    cd backend
echo    npm run dev
echo.
echo    Frontend (em outro terminal):
echo    npm run dev
echo.
echo 🌐 URLs:
echo    Backend:  http://localhost:3001
echo    Frontend: http://localhost:5173
echo.
echo 📚 Documentação:
echo    - QUICK_START.md - Início rápido
echo    - COMO_INICIAR.md - Guia completo
echo    - backend\README.md - Documentação da API
echo    - backend\API_TESTS.md - Exemplos de uso
echo.
echo ═══════════════════════════════════════════════════════════
echo.
pause
