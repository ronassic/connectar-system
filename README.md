# 🛡️ Connectar System - API e Painel de Gerenciamento de Usuários

Um monorepositório completo contendo uma API RESTful em NestJS para gerenciamento de usuários e um painel de administração em React para interagir com a API.

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232A.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
---

## 🖼️ Visão Geral
![Preview do Painel de Gerenciamento de Usuários](https://github.com/user-attachments/assets/4ea3f4fc-1bcc-4581-8e30-4030cd39c967)

---

## ✨ Principais Funcionalidades

- **Autenticação Segura:** Login de usuários com JWT (JSON Web Tokens) e Passport.js.
- **Controle de Acesso por Perfil (RBAC):** Rotas protegidas com Guards que restringem o acesso com base nos perfis `admin` e `user`.
- **CRUD Completo de Usuários:** Administradores podem criar, ler, atualizar e excluir qualquer usuário.
- **Listas Dinâmicas com Filtros e Ordenação:**
  - Filtre usuários por perfil (`admin` ou `user`).
  - Ordene a lista por nome, e-mail ou data.
- **Listagem de Usuários Inativos:**
  - Tela dedicada para listar usuários que não fazem login há mais de 30 dias (ou nunca logaram).
- **Edição de Perfil:** Um usuário pode editar seus próprios dados, e um administrador pode alterar o perfil (role) de outros usuários.
- **Documentação de API Interativa:** Geração automática da documentação com Swagger.

---

## 📦 Tecnologias Utilizadas

- **Backend:** NestJS, TypeORM, PostgreSQL, JWT (Passport.js), Swagger, Bcrypt, Class Validator.
- **Frontend:** React, Vite, TypeScript, TailwindCSS, Axios, React Hot Toast.
- **Testes:** Jest com mocks para testes unitários no backend.
- **Banco de Dados:** PostgreSQL.

---

## 🔧 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (v18 ou superior recomendado)
- [PostgreSQL](https://www.postgresql.org/)
- [Git](https://git-scm.com/)

---

## ▶️ Como Executar o Projeto

Este projeto é um monorepositório. Você precisará de **dois terminais** abertos, um para o backend e um para o frontend.

#### 1. Preparação Inicial

```bash
# Clone o repositório
git clone https://github.com/ronassic/connectar-system.git

# Entre na pasta principal
cd connectar-system
```

#### 2. Configurando e Rodando o Backend (Terminal 1)

```bash
# Navegue até a pasta do backend
cd backend

# Copie o arquivo de ambiente de exemplo
# Linux/macOS
cp .env.example .env
:: Windows
copy .env.example .env

# ⚠️ IMPORTANTE: Edite o arquivo .env com os dados do seu banco PostgreSQL.

# Instale as dependências
npm install

# Rode as migrações (se houver) e inicie o servidor
npm run start:dev
```
> O backend estará rodando em `http://localhost:3000`.

#### 3. Configurando e Rodando o Frontend (Terminal 2)

```bash
# Navegue até a pasta do frontend (a partir da raiz do projeto)
cd frontend

# Copie o arquivo de ambiente de exemplo
# Linux/macOS: 
cp .env.example .env
# Windows: 
copy .env.example .env
# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```
> O frontend estará acessível em `http://localhost:5173`.

---

## 📚 Documentação da API (Swagger)
Com o backend em execução, acesse a documentação interativa da API, onde você pode visualizar e testar todos os endpoints:

🔗 **[http://localhost:3000/docs](http://localhost:3000/docs)**

---

## 🧠 Arquitetura e Decisões de Design

- **NestJS:** Escolhido por sua estrutura modular e escalável, com suporte nativo a conceitos como interceptadores, pipes, guards e decorators, o que acelera o desenvolvimento e mantém o código organizado.
- **JWT + Passport:** Autenticação stateless, segura e flexível, ideal para APIs RESTful.
- **RBAC com Guards:** O controle de acesso granular usando o decorator `@Roles()` e um `RolesGuard` customizado permite uma gestão de permissões clara e centralizada.
- **TypeORM com PostgreSQL:** Uma combinação robusta para o ORM, com forte integração ao ecossistema NestJS.
- **Swagger:** A documentação é gerada automaticamente a partir dos decorators nos DTOs e controllers, garantindo que ela esteja sempre atualizada com o código.

---

## 🚀 Deploy com Render

Este projeto já está configurado para deploy automático na plataforma [Render](https://render.com/), com três serviços independentes, mas funcionando em conjunto:

- **connectar-db** (PostgreSQL 16)  
- **connectar-backend** (API NestJS)  
- **connectar-frontend** (Aplicação React estática)

![Tela dos_projetos_no_Render](https://github.com/user-attachments/assets/b61eeffd-cbd5-4cd5-a568-c026e99615e2)


### 🔹 Backend (NestJS)

- **Root Directory**: `backend`  
- **Build Command**:  
  `npm install && npm run build`  
- **Start Command**:  
  `npm run start`  
- **Auto Deploy**: habilitado na branch `master`  
- **Variáveis de ambiente**: configure no painel do Render as mesmas variáveis do `.env`, como:  
  - `DATABASE_URL`  
  - `JWT_SECRET`  
  - Outras conforme necessário

📎 **URL pública da API**: https://connectar-backend.onrender.com

---

### 🔹 Frontend (React)

- **Root Directory**: `frontend`  
- **Build Command**:  
  `npm install; npm run build`  
- **Publish Directory**: `frontend/dist`  
- **Auto Deploy**: habilitado na branch `master`

📎 **URL pública do painel**: https://connectar-system.onrender.com

---

### 🔹 Banco de Dados (PostgreSQL)

- **Plano gratuito com 1 GB**  
- **Região**: Oregon (US)  
- **Uso atual**: aproximadamente 6,5%  
- O Render fornece o **endereço de conexão** automaticamente ao criar o serviço

---

### 📌 Observações

- O deploy é feito automaticamente a cada push na branch `master`.  
- Nunca exponha dados reais em arquivos públicos.  
- Certifique-se de configurar corretamente todas as variáveis de ambiente.  
- Para ambientes de staging, use uma nova branch ou clone os serviços no Render.

---

## ✅ Testes Automatizados
O backend inclui testes unitários para as lógicas de serviço mais críticas.

```bash
# Entre na pasta do backend
cd backend

# Execute os testes
npm run test
```
---

## 💻 Recomendação de Editor

Recomendamos o uso do [Visual Studio Code](https://code.visualstudio.com/) para editar o projeto, devido ao seu excelente suporte para:

- **TypeScript**, **NestJS**, **React**
- Extensões como:
  - ESLint & Prettier (formatação e qualidade de código)
  - Tailwind CSS IntelliSense
  - REST Client ou Thunder Client (para testar APIs)
  - GitLens (histórico e insights do Git)

> 💡 Se você abrir o projeto pela raiz com o VS Code (`code .`), ele já reconhecerá a estrutura de monorepositório com backend e frontend.

---

## 🔐 Observações de Segurança
* ⚠️ Nunca suba o arquivo `.env` com dados reais para repositórios públicos. Ele já está no `.gitignore`.
* As senhas são armazenadas no banco de dados com hash forte usando **bcrypt**.
* O campo `lastLogin` é atualizado automaticamente a cada login bem-sucedido.


---

## ⚠️ This project is licensed under CC BY-NC 4.0. 
Commercial use is strictly prohibited without written permission. My e-mail: ronassic@gmail.com
