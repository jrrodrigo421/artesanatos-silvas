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

## 🛠️ Como Rodar o Projeto Localmente

### 🎯 **Opção 1: Docker Compose (Recomendado para Desenvolvimento)**

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

🚀 Disponivel em: https://artesanatos-silvas.vercel.app/