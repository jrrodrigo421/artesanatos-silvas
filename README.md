# 📋 Silva's Artesanatos - ToDo App

Uma aplicação completa de controle de tarefas (ToDo) desenvolvida com **Next.js 15**, **TypeScript**, **Prisma** e **PostgreSQL**. O projeto inclui autenticação JWT, CRUD completo de tarefas e interface moderna com **Tailwind CSS v4**.

## 🚀 Tecnologias Utilizadas

### Frontend
- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS v4** - Estilização moderna
- **React Hooks** - Gerenciamento de estado
- **Axios** - Cliente HTTP

### Backend (API Routes)
- **Next.js API Routes** - Backend integrado
- **Prisma ORM** - Gerenciamento de banco de dados
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação e autorização
- **bcryptjs** - Hash de senhas

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

## 🛠️ Como Rodar o Projeto

### 1️⃣ **Pré-requisitos**
- **Node.js 20+** instalado
- **PostgreSQL** (local ou remoto)
- **Git** para clonar o repositório

### 2️⃣ **Clonar e Instalar Dependências**
```bash
# Clonar o repositório
git clone <url-do-repositorio>
cd artesanatos-silvas

# Instalar dependências
npm install
```

### 3️⃣ **Configurar Variáveis de Ambiente**

#### **Arquivo `.env`** (para Prisma):
```env
# Database URL - PostgreSQL
DATABASE_URL="postgresql://usuario:senha@host:porta/nome_banco?schema=public"
```

#### **Arquivo `.env.local`** (para Next.js):
```env
# Next.js API
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# JWT Secret Key
JWT_SECRET=silva-artesanatos-super-secret-key-2025
```

### 4️⃣ **Configurar Banco de Dados**
```bash
# Gerar cliente Prisma
npx prisma generate

# Executar migrações (criar tabelas)
npx prisma migrate dev --name init

# (Opcional) Visualizar banco de dados
npx prisma studio
```

### 5️⃣ **Executar a Aplicação**
```bash
# Modo desenvolvimento
npm run dev

# Acesse: http://localhost:3000
```

### 6️⃣ **Build para Produção**
```bash
# Gerar build otimizado
npm run build

# Executar em produção
npm start
```

## 🔗 Endpoints da API

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

## 📁 Estrutura do Projeto

```
artesanatos-silvas/
├── src/
│   ├── app/
│   │   ├── api/                 # API Routes (Backend)
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   └── me/
│   │   │   └── tasks/
│   │   │       └── [id]/
│   │   ├── dashboard/           # Página principal
│   │   ├── login/              # Página de login
│   │   ├── register/           # Página de registro
│   │   ├── globals.css         # Estilos globais (Tailwind)
│   │   └── layout.tsx          # Layout principal
│   ├── components/             # Componentes React
│   │   ├── ui/
│   │   ├── TaskCard.tsx
│   │   └── TaskForm.tsx
│   ├── contexts/               # Contextos React
│   │   └── AuthContext.tsx
│   ├── lib/                    # Utilitários
│   │   ├── prisma.ts          # Cliente Prisma
│   │   ├── auth.ts            # Funções JWT
│   │   └── api.ts             # Cliente HTTP
│   └── types/                  # Tipos TypeScript
├── prisma/
│   └── schema.prisma          # Schema do banco
├── .env                       # Variáveis Prisma
├── .env.local                 # Variáveis Next.js
└── package.json
```

