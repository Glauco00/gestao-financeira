require('dotenv').config();
const { testConnection, dbPath } = require('../config/database');

async function test() {
  console.log('🔍 Testando conexão com SQLite...\n');
  console.log('Configurações:');
  console.log(`  Arquivo: ${dbPath}\n`);

  try {
    console.log('⏳ Conectando...');
    testConnection();
    console.log('✓ Conectado com sucesso!\n');

    console.log('✓ Teste completado com sucesso!');
    console.log('\n💡 Dica: Execute "npm run migrate" para criar as tabelas.');
  } catch (error) {
    console.error('\n✗ Erro ao conectar:');
    console.error(`  ${error.message}\n`);

    console.log('💡 Dicas:');
    console.log('  1. Verifique o caminho do arquivo no .env');
    console.log('  2. Certifique-se de ter permissão de escrita no diretório');

    process.exit(1);
  }
}

test();
