@echo off
chcp 65001 >nul
cls
echo ═══════════════════════════════════════════════════════════
echo   🚀 INICIAR SERVIDORES - GESTÃO FINANCEIRA
echo ═══════════════════════════════════════════════════════════
echo.
echo Este script irá iniciar o backend e o frontend em
echo terminais separados.
echo.
echo Pressione qualquer tecla para continuar...
pause >nul

echo.
echo ⏳ Iniciando backend...
start "Backend - Gestão Financeira" cmd /k "cd backend && npm run dev"

timeout /t 3 >nul

echo ⏳ Iniciando frontend...
start "Frontend - Gestão Financeira" cmd /k "npm run dev"

echo.
echo ✅ Servidores iniciados!
echo.
echo 🌐 URLs:
echo    Backend:  http://localhost:3001
echo    Frontend: http://localhost:5173
echo.
echo As janelas dos terminais foram abertas.
echo Feche este terminal se desejar.
echo.
pause
