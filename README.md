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

#### **Arquivo `.env.local`** (para Next.js e Express):
```env
# API URL apontando para servidor Express
NEXT_PUBLIC_API_URL=http://localhost:3001/api

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

#### **Opção 1: Rodar Frontend e Backend Separadamente**
```bash
# Terminal 1 - Servidor Express (Backend)
npm run server:dev

# Terminal 2 - Next.js (Frontend)
npm run dev
```

#### **Opção 2: Rodar Tudo Junto (Recomendado)**
```bash
# Roda frontend e backend simultaneamente
npm run dev:all
```

**URLs de Acesso:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api
- Health Check: http://localhost:3001/health

### 6️⃣ **Build para Produção**
```bash
# Build do frontend
npm run build

# Build do backend Express
npm run server:build

# Executar em produção
npm run server:start & npm start
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
├── .env                    # Variáveis Prisma
├── .env.local              # Variáveis Next.js e Express
└── package.json
```

## 🧪 Testando a API

### **1. Health Check**
```bash
curl http://localhost:3001/health
```

### **2. Registro de Usuário**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "teste@exemplo.com", "password": "123456", "name": "Teste"}'
```

### **3. Login**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "teste@exemplo.com", "password": "123456"}'
```

### **4. Criar Tarefa** (com token)
```bash
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -d '{"title": "Minha primeira tarefa", "description": "Descrição da tarefa"}'
```

## 🚀 Deploy

### **Vercel (Frontend) + Heroku/Railway (Backend)**
1. **Frontend (Vercel):**
   - Conecte seu repositório GitHub
   - Configure: `NEXT_PUBLIC_API_URL=https://seu-backend.herokuapp.com/api`
   
2. **Backend (Heroku/Railway):**
   - Configure as variáveis: `DATABASE_URL`, `JWT_SECRET`
   - Deploy do servidor Express

### **Deploy Completo (Mesmo Servidor)**
- **Railway, Render, DigitalOcean**
- Configure todas as variáveis de ambiente
- Use `npm run dev:all` para produção

## 🔄 Próximos Passos / Melhorias

- [ ] Testes unitários e de integração (Jest + Supertest)
- [ ] Rate limiting e throttling
- [ ] Logs estruturados (Winston)
- [ ] Docker e Docker Compose
- [ ] CI/CD Pipeline
- [ ] Monitoramento (Prometheus + Grafana)
- [ ] Cache Redis
- [ ] WebSockets para updates em tempo real
- [ ] API Documentation (Swagger)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma feature branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

Desenvolvido com ❤️ para Silva's Artesanatos

---

**Versão:** 2.0.0 (Migrado para Express)  
**Última atualização:** Janeiro 2025

