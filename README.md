# Croma App

Aplicacao web para treino e educacao sobre daltonismo, com percursos por mundos, quizzes, jogos, progresso por nivel, XP e painel administrativo.

## 1. Stack e arquitetura

- Front-end: HTML, CSS, JavaScript (ES Modules)
- Persistencia de dados: json-server com bd.json
- Organizacao de codigo: padrao MVC por paginas
- Dados de autenticacao: users e sessions em json-server
- Conteudo de jogo:
	- Utilizadores e progresso: bd.json
	- Quizzes e jogos (conteudo administravel): localStorage (overrides do admin)

## 2. Requisitos

- Node.js
- npm

## 3. Instalacao

Executar na raiz do projeto:

		npm install

## 4. Executar o backend local

Iniciar json-server:

		npm start

Isto sobe a API em:

- http://localhost:3000/users
- http://localhost:3000/sessions

## 5. Executar o front-end

Abrir o projeto com um servidor estatico (por exemplo Live Server no VS Code) e usar:

- index.html para entrar na app
- html/Home.html como pagina principal autenticada

## 6. Contas e acesso

Conta admin principal:

- Email: demo@croma.app
- Password: demo123

Regras de admin:

- O item Admin na navbar aparece apenas quando o utilizador autenticado e demo@croma.app
- A pagina html/Admin.html valida sessao e email
- Se o utilizador nao for admin, o acesso e negado e existe redirecionamento para Home

## 7. Funcionalidades principais

### 7.1 Treino por mundos

- Mundos: transito, roupa, comida, desporto
- Cada mundo tem 5 niveis
- Niveis quiz usam 5 perguntas por nivel
- Niveis game usam logica interativa (sorting, drag_drop, memory, speed)

### 7.2 Progressao

- Nivel 1 desbloqueado por defeito em cada mundo desbloqueado
- Para desbloquear o nivel seguinte, o nivel anterior precisa de pelo menos 1 estrela
- Ao completar um mundo, o seguinte desbloqueia automaticamente

### 7.3 XP e estrelas

- Estrelas calculadas por percentagem de respostas certas
- XP calculado por nivel, total de perguntas e acertos
- O sistema evita farm infinito no mesmo nivel (ganho considera melhoria)

### 7.4 Modo aleatorio

- Seleciona nivel jogavel aleatorio entre mundos desbloqueados
- Navega diretamente para o mundo e abre o nivel via hash na URL

## 8. Painel Admin

Pagina:

- html/Admin.html
- js/services/admin.js

Recursos:

- Gestao de utilizadores (listar, criar, editar, remover)
- Gestao de quizzes por mundo e nivel
- Gestao de jogos por mundo e nivel
- Logout direto no painel admin
- Guardar overrides de conteudo e aplicar no runtime
- Repor conteudo padrao

Persistencia do Admin:

- Utilizadores: json-server (bd.json)
- Conteudo quizzes/jogos: localStorage

Nota importante:

- Como o conteudo de quizzes e jogos do Admin usa localStorage, as alteracoes ficam no browser atual.

## 9. Estrutura de pastas

- bd.json: base de dados para json-server
- index.html: entrada publica
- html: paginas da aplicacao
- css: folhas de estilo
- js/services: comunicacao e autenticacao
- js/model: estado e regras de progresso/utilizador
- js/view: renderizacao por pagina
- js/controller: logica de interacao por pagina
- js/logic: regras dos quizzes, jogos e mundos

## 10. Dicas de desenvolvimento

- Manter json-server ativo durante os testes
- Se mudares dados em bd.json com o servidor ligado, o json-server atualiza automaticamente
- Se precisares limpar alteracoes feitas no conteudo do Admin, usar botao Repor Conteudo Padrao na pagina admin
