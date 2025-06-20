# 🛡️ User Management API

Sistema completo de gerenciamento de usuários com autenticação via JWT, controle de acesso por roles, frontend com React + Vite e backend com NestJS.

---

## 📦 Tecnologias Utilizadas

- **Backend**: NestJS + TypeORM + PostgreSQL + JWT + Swagger
- **Frontend**: React + Vite + TailwindCSS
- **Testes**: Jest com mocks
- **Banco**: PostgreSQL

---

## 📚 Documentação da API (Swagger)

Acesse a documentação interativa em:

🔗 [http://localhost:3000/docs](http://localhost:3000/docs)

A API conta com autenticação, criação, atualização, exclusão e listagem de usuários, além de filtros por role e inatividade.

---

## 🧠 Decisões de Design e Arquitetura

- **NestJS**: estrutura modular e escalável, com suporte nativo a interceptadores, pipes, guards e decorators.
- **JWT + Passport**: autenticação stateless segura e flexível.
- **RBAC com Guards**: controle de acesso por `@Roles()` e `RolesGuard`.
- **TypeORM com PostgreSQL**: integração robusta com o NestJS.
- **Swagger**: documentação automática via decorators em DTOs.
- **Jest**: testes unitários nos serviços com cobertura básica.
- **React com Vite**: desenvolvimento rápido, rotas protegidas e fetch da API.
- **TailwindCSS**: estilização rápida e responsiva.

---

## 📁 Estrutura do Projeto

```
connectar-system/
│
├── backend/    ← Projeto NestJS com API RESTful
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── dto/
│   │   ├── guards/
│   │   └── strategies/
│   ├── test/ (opcional)
│   ├── jest.config.ts
│   └── .env
│
├── frontend/   ← Projeto React + Vite
│   ├── src/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── components/
│   │   └── App.tsx, main.tsx, etc
│   └── .env
```

---

## ▶️ Como Executar

### 1. Clonar e instalar dependências

```bash
git clone https://github.com/ronassic/connectar-system.git
cd connectar-system
```

### 2. Configurar o Backend

```bash
cd backend
cp .env.example .env
npm install
npm run build
npm run start:dev
```

> ⚠️ Verifique se o PostgreSQL está rodando e o banco `connectar_db` foi criado. A URL está no `.env`.

### 3. Configurar o Frontend

```bash
cd ../frontend
cp .env.example .env
npm install
npm run dev
```

> O frontend será servido em [http://localhost:5173](http://localhost:5173)

---

## ✅ Testes Automatizados

Execute os testes com:

```bash
cd backend
npm run test
```

> Inclui testes do serviço de usuário (`user.service.spec.ts`), cobrindo criação e busca.

---

## 🔐 Autenticação e Perfis

- Novos usuários são registrados via `/api/auth/register`
- O login retorna um token JWT
- Endpoints protegidos usam `@UseGuards(AuthGuard('jwt'))`
- Apenas `admin` pode acessar rotas de CRUD geral
- Qualquer usuário pode editar seu próprio perfil

---

## 🔗 Repositório

Este projeto é um monorepositório com as seguintes pastas:

- `backend/` — código do NestJS (API)
- `frontend/` — código do Vite + React (interface web)

---

## 📌 Observações

- ⚠️ Nunca subir `.env` com dados reais para repositórios públicos
- A senha é armazenada com hash (bcrypt)
- O campo `lastLogin` é atualizado automaticamente no login
- A tela de admin lista usuários inativos com base em `lastLogin`

---

