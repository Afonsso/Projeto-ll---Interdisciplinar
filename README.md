# Projeto-ll---Interdisciplinar
Projeto front-end com `json-server` para simular persistência local de utilizadores e sessões.

## Requisitos

- Node.js instalado
- `npm`

## Instalar dependências

```bash
npm install
```

## Iniciar o servidor

O servidor de dados usa o ficheiro `bd.json` e fica disponível em `http://localhost:3000`.

```bash
npm start
```

Esse comando executa:

```bash
json-server --watch bd.json --port 3000
```

## Dados expostos

- `http://localhost:3000/users`
- `http://localhost:3000/sessions`

## Estrutura principal

- `bd.json`: base de dados local usada pelo servidor
- `index.html`: ponto de entrada da aplicação
- `html/`: páginas da aplicação
- `js/`: controllers, models e services
- `css/`: estilos

## Notas

- Mantém o terminal aberto enquanto o servidor estiver a correr.
- Se alterares `bd.json`, o `json-server` atualiza automaticamente os dados enquanto o comando estiver ativo.