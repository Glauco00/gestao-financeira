# Gestão Financeira Vite React

Este projeto é uma aplicação web de gestão financeira desenvolvida com Vite e React. O objetivo é fornecer uma interface intuitiva para gerenciar transações financeiras, contas e configurações do usuário.

## Estrutura do Projeto

- **index.html**: Ponto de entrada do aplicativo, contendo a estrutura básica do HTML.
- **package.json**: Configuração do npm, listando dependências e scripts do projeto.
- **vite.config.js**: Configurações do Vite, incluindo plugins e opções de build.
- **.gitignore**: Arquivo que especifica quais arquivos ou pastas devem ser ignorados pelo Git.
- **public/robots.txt**: Instruções para motores de busca sobre quais páginas devem ser indexadas.
- **src/**: Contém todos os arquivos fonte da aplicação.
  - **main.jsx**: Ponto de entrada do React, onde o componente App é renderizado.
  - **App.jsx**: Componente principal que gerencia as rotas e a estrutura geral.
  - **pages/**: Contém os componentes de página.
    - **Dashboard.jsx**: Exibe um resumo financeiro e gráficos.
    - **Transacoes.jsx**: Lista e gerencia transações financeiras.
    - **Contas.jsx**: Permite gerenciar contas financeiras.
    - **Configuracoes.jsx**: Ajusta preferências do usuário.
  - **components/**: Contém componentes reutilizáveis.
    - **Layout.jsx**: Define o layout geral da aplicação.
    - **Header.jsx**: Exibe o título e a navegação.
    - **Sidebar.jsx**: Fornece links de navegação.
    - **TransactionList.jsx**: Exibe uma lista de transações.
    - **TransactionForm.jsx**: Permite adicionar ou editar transações.
    - **charts/**: Contém componentes de gráficos.
      - **BalanceChart.jsx**: Exibe um gráfico de saldo.
  - **hooks/**: Contém hooks personalizados.
    - **useTransactions.js**: Gerencia transações.
  - **services/**: Contém funções para interagir com a API.
    - **api.js**: Busca e envia dados de transações.
  - **stores/**: Gerencia o estado das transações.
    - **transactionStore.js**: Abordagem de gerenciamento de estado.
  - **routes/**: Define as rotas da aplicação.
    - **index.jsx**: Roteador para navegar entre páginas.
  - **styles/**: Contém estilos da aplicação.
    - **index.css**: Estilos globais.
    - **variables.css**: Variáveis de estilo reutilizáveis.
  - **utils/**: Contém funções utilitárias.
    - **format.js**: Funções para formatar dados.
- **tests/**: Contém testes para a aplicação.
  - **App.test.jsx**: Testes para o componente App.
  - **setupTests.js**: Configuração do ambiente de testes.
- **.eslintrc.js**: Configurações do ESLint.
- **.prettierrc**: Configurações do Prettier.

## Instalação

1. Clone o repositório:
   ```
   git clone <URL_DO_REPOSITORIO>
   ```
2. Navegue até o diretório do projeto:
   ```
   cd gestao-financeira-vite-react
   ```
3. Instale as dependências:
   ```
   npm install
   ```
4. Inicie o servidor de desenvolvimento:
   ```
   npm run dev
   ```

## Uso

Acesse a aplicação em seu navegador através do endereço `http://localhost:3000`. Você poderá gerenciar suas transações financeiras, contas e configurações de forma simples e eficiente.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## Licença

Este projeto está licenciado sob a MIT License.