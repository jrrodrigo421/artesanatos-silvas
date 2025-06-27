# 📋 Silva's Artesanatos - ToDo App

Uma aplicação completa de controle de tarefas (ToDo) desenvolvida com **Next.js 15**, **TypeScript**, **Express**, **Prisma** e **PostgreSQL**. O projeto inclui autenticação JWT, CRUD completo de tarefas e interface moderna com **Tailwind CSS v4**.

## 🚀 Tecnologias Utilizadas

### Frontend
- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS v4** - Estilização moderna
- **React Hooks** - Gerenciamento de estado
- **Axios** - Cliente HTTP

### Backend
- **Express.js** - Framework web Node.js
- **TypeScript** - Tipagem estática
- **Prisma ORM** - Gerenciamento de banco de dados
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação e autorização
- **bcryptjs** - Hash de senhas
- **CORS, Helmet, Morgan** - Middlewares de segurança e logging

### DevOps
- **Docker & Docker Compose** - Containerização
- **PostgreSQL Container** - Banco de dados local

## ✨ Funcionalidades Implementadas

### 🔐 Autenticação
- [x] Registro de usuários
- [x] Login com JWT
- [x] Proteção de rotas
- [x] Logout
- [x] Validação de email e senha

### 📋 Gerenciamento de Tarefas
- [x] Criar tarefas
- [x] Listar tarefas do usuário
- [x] Atualizar tarefas
- [x] Deletar tarefas
- [x] Filtrar por status (Pendente, Em Andamento, Concluída)
- [x] Data de criação e conclusão automática

### 🎨 Interface
- [x] Dashboard responsivo
- [x] Formulários de login/registro
- [x] Modal para criar/editar tarefas
- [x] Filtros visuais por status
- [x] Contadores de tarefas
- [x] Design moderno com Tailwind CSS v4

## 📊 Estrutura do Banco de Dados

```sql
Users:
- id (String, PK)
- email (String, unique)
- password (String, hash)
- name (String, opcional)
- createdAt, updatedAt (DateTime)

Tasks:
- id (String, PK)
- title (String)
- description (String, opcional)
- status (PENDENTE | EM_ANDAMENTO | CONCLUIDA)
- userId (String, FK)
- createdAt, updatedAt, completedAt (DateTime)
```

## 🛠️ Como Rodar o Projeto Localmente

### 🎯 **Opção 1: Docker Compose (Recomendado para Desenvolvimento)**

A forma mais rápida e fácil de rodar o projeto com PostgreSQL local.

#### **Pré-requisitos**
- **Docker** e **Docker Compose** instalados
- **Git** para clonar o repositório

#### **Passos**
```bash
# 1. Clonar o repositório
git clone <url-do-repositorio>
cd artesanatos-silvas

# 2. Instalar dependências do frontend
npm install

# 3. Subir API + PostgreSQL
docker-compose up -d

# 4. Ver logs (opcional)
docker-compose logs -f

# 5. Rodar frontend Next.js
npm run dev
```

**✅ Pronto!** Acesse:
- **Frontend**: http://localhost:3000
- **API**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/health

#### **Comandos Úteis Docker Compose**
```bash
# Parar ambiente
docker-compose down

# Rebuild da API
docker-compose build api && docker-compose up -d api

# Ver logs específicos
docker-compose logs -f api      # API
docker-compose logs -f postgres # PostgreSQL

# Resetar banco (⚠️ apaga dados)
docker-compose down -v
```

---

### 🔧 **Opção 2: Instalação Manual**

Para quem prefere rodar sem Docker ou fazer desenvolvimento do backend.

#### **Pré-requisitos**
- **Node.js 20+** instalado
- **PostgreSQL** instalado e rodando
- **Git** para clonar o repositório

#### **Passos**

**1. Clonar e Instalar**
```bash
git clone <url-do-repositorio>
cd artesanatos-silvas
npm install
```

**2. Configurar Variáveis de Ambiente**

Crie o arquivo **`.env`**:
```env
# Database URL - PostgreSQL
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_banco"
```

Crie o arquivo **`.env.local`**:
```env
# API URL para o frontend
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# JWT Secret Key
JWT_SECRET=silva-artesanatos-super-secret-key-2025
```

**3. Configurar Banco de Dados**
```bash
# Gerar cliente Prisma
npx prisma generate

# Executar migrações
npx prisma migrate dev --name init

# (Opcional) Visualizar banco
npx prisma studio
```

**4. Executar Aplicação**

**Opção A: Tudo junto**
```bash
npm run dev:all
```

**Opção B: Separadamente**
```bash
# Terminal 1 - Backend Express
npm run server:dev

# Terminal 2 - Frontend Next.js
npm run dev
```

---

## 🗄️ **Configuração do Banco de Dados**

### **Com Docker Compose** (Automático)
- **Host**: localhost:5432
- **Usuário**: silva
- **Senha**: silva123
- **Database**: silvadb

### **PostgreSQL Manual**
Crie um banco local e configure a `DATABASE_URL` no `.env`:
```env
DATABASE_URL="postgresql://seu_usuario:sua_senha@localhost:5432/seu_banco"
```

## 🔗 Endpoints da API

**Base URL:** `http://localhost:3001/api`

### **Autenticação**
```
POST   /api/auth/login      # Login do usuário
POST   /api/auth/register   # Registro de usuário
GET    /api/auth/me         # Dados do usuário atual
```

### **Tarefas** (Rotas Protegidas)
```
GET    /api/tasks           # Listar tarefas (filtro: ?status=PENDENTE)
POST   /api/tasks           # Criar tarefa
GET    /api/tasks/[id]      # Obter tarefa específica
PUT    /api/tasks/[id]      # Atualizar tarefa
DELETE /api/tasks/[id]      # Deletar tarefa
```

### **Sistema**
```
GET    /health              # Health check do servidor
```

## 🚀 **Build e Deploy**

### **Frontend (Next.js)**
```bash
npm run build    # Build de produção
npm start        # Servir build
```

### **Backend (Express)**
```bash
npm run server:build  # Compilar TypeScript
npm run server:start  # Executar em produção
```

### **Docker Build**
```bash
# O projeto já possui Dockerfile para deploy
docker build -t silva-artesanatos .
docker run -p 3001:3001 silva-artesanatos
```

## 📁 Estrutura do Projeto

```
artesanatos-silvas/
├── src/                    # Frontend (Next.js)
│   ├── app/
│   │   ├── dashboard/      # Página principal
│   │   ├── login/          # Página de login
│   │   ├── register/       # Página de registro
│   │   ├── globals.css     # Estilos globais (Tailwind)
│   │   └── layout.tsx      # Layout principal
│   ├── components/         # Componentes React
│   │   ├── ui/
│   │   ├── TaskCard.tsx
│   │   └── TaskForm.tsx
│   ├── contexts/           # Contextos React
│   │   └── AuthContext.tsx
│   ├── lib/                # Utilitários
│   │   ├── prisma.ts       # Cliente Prisma
│   │   ├── auth.ts         # Funções JWT (Next.js)
│   │   ├── auth-express.ts # Funções JWT (Express)
│   │   └── api.ts          # Cliente HTTP
│   └── types/              # Tipos TypeScript
├── server/                 # Backend (Express)
│   ├── routes/
│   │   ├── auth.ts         # Rotas de autenticação
│   │   └── tasks.ts        # Rotas de tarefas
│   └── index.ts            # Servidor Express principal
├── prisma/
│   └── schema.prisma       # Schema do banco
├── docker-compose.yml      # Ambiente local completo
├── Dockerfile              # Build para produção
├── .env                    # Variáveis Prisma
├── .env.local              # Variáveis Next.js e Express
└── package.json
```

## 🛠️ **Scripts Disponíveis**

```bash
# Desenvolvimento
npm run dev              # Frontend Next.js
npm run server:dev       # Backend Express
npm run dev:all          # Frontend + Backend

# Build
npm run build            # Build Next.js
npm run server:build     # Build Express

# Produção
npm start                # Executar Next.js
npm run server:start     # Executar Express

# Banco de Dados
npm run db:migrate       # Executar migrações
npm run db:generate      # Gerar cliente Prisma
npm run db:studio        # Prisma Studio

# Docker
docker-compose up -d     # Subir ambiente completo
docker-compose down      # Parar ambiente
```