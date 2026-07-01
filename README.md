# CollabNote

A full-stack real-time collaborative note-taking application. 

## 📁 Estrutura do Projeto

O projeto utiliza uma arquitetura monorepo com as seguintes pastas principais:

- `/backend`: API construída com Node.js, Express e TypeScript, lidando com autenticação e comunicação em tempo real (Socket.IO).
- `/frontend`: Aplicação SPA (Single Page Application) com interface para o usuário.

## 🚀 Como iniciar o projeto

### Pré-requisitos
- Node.js (v18 ou superior)
- npm ou yarn

### Backend
1. Entre na pasta do backend:
   ```bash
   cd backend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure o arquivo `.env` com base no `.env.example` (se houver).
4. Inicie o servidor:
   ```bash
   npm run dev
   ```

### Frontend
1. Entre na pasta do frontend:
   ```bash
   cd frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## 🛠 Tecnologias

- **Backend**: Node.js, Express, TypeScript, Socket.IO
- **Frontend**: React, TypeScript, Vite

## 📝 Licença

Este projeto está sob a licença MIT.
