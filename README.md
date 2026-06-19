> 🇺🇸 [View in English](README-en.md) · 🔗 [Ver Frontend](https://github.com/matbdev/dpa-crongoal-frontend)

# CronGoal — Aplicação open source de acompanhamento de metas, feita por e para você!

![Node.js](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Passport.js](https://img.shields.io/badge/Passport-34E27A?style=for-the-badge&logo=passport&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-000000?style=for-the-badge&logo=zod&logoColor=3068B7)

> API backend completa que alimenta o ecossistema CronGoal — construída nativamente com Express.js + TypeScript, focada em performance, segurança e arquitetura desacoplada.

---

## O que é

O CronGoal é uma aplicação de produtividade pessoal gamificada que ajuda o usuário a organizar tarefas, rotinas e projetos de forma visual e intuitiva. A API deste repositório é o coração do sistema: ela gerencia toda a lógica de negócio, autenticação, persistência de dados e integração com serviços externos.

Se você já tentou tomar controle da sua rotina mas nunca encontrou uma ferramenta simples o suficiente para isso, esse projeto foi feito pra você. A proposta é eliminar a complexidade desnecessária e entregar uma experiência direta — sem ficar mais tempo configurando a ferramenta do que realmente gerenciando suas metas.

## Por que existe

Esse projeto nasceu dentro da disciplina de **Desenvolvimento de Aplicações para a Internet (DAI)** na **UNIVATES**, mas vai além de uma entrega acadêmica. A motivação real veio da frustração com ferramentas de produtividade que ou são simples demais e não sustentam uso real, ou são tão complexas que viram um obstáculo a mais.

O CronGoal preenche esse espaço: é robusto o bastante para acompanhar projetos com Kanban, rotinas periódicas e um sistema de recompensas gamificado — mas sem exigir do usuário uma curva de aprendizado absurda. A ideia é que ele funcione como um aliado no dia a dia, não como mais uma obrigação.

## Como funciona

- **Linguagem principal:** TypeScript
- **Framework / Runtime:** Express.js 5 sobre Node.js
- **Banco de dados:** PostgreSQL 16 (via Docker) com Prisma ORM e Supabase como solução de Bucket de armazenamento
- **Autenticação:** Google OAuth 2.0 (Passport.js) + login local com bcrypt + JWT
- **Validação:** Zod para todos os endpoints de mutação
- **Segurança:** Helmet, CORS configurável, Rate Limiting, RBAC (admin middleware)
- **Arquitetura:** Camadas Service → Controller → Router totalmente desacopladas, sem handlers monolíticos

### Estrutura do projeto

```
src/
├── config/                     # Configuração de ambiente e banco
│   └── prisma.ts               # Instância singleton do Prisma Client
├── controllers/                # Handlers HTTP (traduzem req/res)
│   ├── auth.controller.ts
│   ├── kanbanColumn.controller.ts
│   ├── project.controller.ts
│   ├── reward.controller.ts
│   ├── routine.controller.ts
│   ├── task.controller.ts
│   └── user.controller.ts
├── middlewares/                # Pipeline de middlewares Express
│   ├── errorHandler.ts         # Handler global de erros (AppError, Prisma)
│   ├── requireAdmin.ts         # RBAC: bloqueia não-admins
│   ├── requireJwt.ts           # Guard de autenticação JWT
│   └── validateData.ts         # Middleware de validação Zod
├── routes/                     # Definição de endpoints e encadeamento
│   ├── auth.route.ts
│   ├── health.route.ts
│   ├── kanbanColumn.route.ts
│   ├── project.route.ts
│   ├── reward.route.ts
│   ├── routine.route.ts
│   ├── task.route.ts
│   └── user.route.ts
├── schemas/                    # Schemas de validação Zod (DTOs)
│   ├── auth.schema.ts
│   ├── kanban.schema.ts
│   ├── project.schema.ts
│   ├── reward.schema.ts
│   ├── routine.schema.ts
│   ├── task.schema.ts
│   └── user.schema.ts
├── services/                   # Regras de negócio e queries Prisma
│   ├── auth.service.ts
│   ├── kanbanColumn.service.ts
│   ├── project.service.ts
│   ├── reward.service.ts
│   ├── routine.service.ts
│   ├── task.service.ts
│   └── user.service.ts
├── strategies/                 # Estratégias de autenticação Passport.js
│   ├── google.ts               # Estratégia Google OAuth 2.0
│   ├── jwt.ts                  # Estratégia JWT Bearer
│   └── passport.ts             # Registro de estratégias
├── types/                      # Definições de tipos TypeScript
│   └── jwtPayload.ts
├── utils/                      # Funções utilitárias compartilhadas
│   ├── AppError.ts             # Classe de erro customizada com HTTP status
│   ├── cors.ts                 # Configuração CORS
│   ├── jwt.ts                  # Geração de tokens JWT
│   ├── password.ts             # Utilitários de hashing bcrypt
│   └── rateLimiter.ts          # Configuração de Rate Limiting
└── app.ts                      # Entry point da aplicação Express
```

## Como rodar localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18+
- [Docker](https://www.docker.com/) (para subir o PostgreSQL em container)
- Um projeto no [Google Cloud Console](https://console.cloud.google.com/) com credenciais OAuth 2.0 (para login via Google)

### Passos

```bash
# 1. Clonar o repositório
git clone https://github.com/matbdev/dpa-crongoal-backend.git
cd dpa-crongoal-backend

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.template .env
# Edite o .env com suas credenciais reais

# 4. Subir o banco de dados via Docker
docker compose up -d

# 5. Gerar o Prisma Client e rodar migrações
npx prisma generate
npx prisma migrate dev

# 6. Iniciar o servidor de desenvolvimento
npm run dev
```

Depois abre `http://localhost:5000/api/health` no navegador ou via cURL para verificar que está rodando.

## Demonstração

Como este repositório contém apenas a API backend, as demonstrações visuais (screenshots, GIFs e vídeos) estão disponíveis no README do frontend:

👉 [**Ver demonstração no repositório do Frontend**](https://github.com/matbdev/dpa-crongoal-frontend#demonstra%C3%A7%C3%A3o)

## Decisões técnicas

- **Express.js custom em vez de NestJS:** O backend foi intencionalmente migrado de NestJS para um setup Express.js + TypeScript altamente desacoplado. A motivação foi ter controle total sobre a estrutura, manter a organização moderna sem boilerplate desnecessário, e preservar um padrão MVC enterprise-level. O NestJS resolve muito, mas quando você quer entender e controlar cada camada, construir na mão compensa.

- **Zod em vez de class-validator:** A escolha pelo Zod veio da integração natural com TypeScript (inferência de tipos) e da capacidade de validar schemas complexos com composição. Cada endpoint de mutação tem seu schema próprio, centralizado na pasta `schemas/`.

- **Prisma ORM:** Facilita as migrações e a tipagem automática dos modelos. O schema declarativo (`schema.prisma`) funciona como documentação viva do banco de dados. Também é uma medida de segurança, pois previne erros de digitação, SQL Injection e garante a integridade dos dados.

- **Gamificação como feature de primeira classe:** O sistema de pontos e recompensas não foi um "nice to have" — foi projetado desde o início como parte central da experiência. Cada tarefa concluída gera pontos; cada recompensa resgatada deduz pontos. O histórico de resgates é rastreado por completo.

- **Separação rígida de camadas:** Routes só encadeiam middlewares. Controllers só traduzem HTTP. Services contêm toda a lógica de negócio e transações Prisma. Isso facilita testes, manutenção e futuras migrações.

## Próximos passos

- [ ] Testes E2E para todos os fluxos críticos
- [ ] Paginação (`skip`/`take`) em listagens
- [ ] Logging estruturado
- [ ] Deploy em produção com CI/CD

## Sobre

Feito por **Mateus Carniel Brambilla** ([@matbdev](https://github.com/matbdev))
durante a disciplina de Desenvolvimento de Aplicações para a Internet (DAI) na UNIVATES.

Submetido ao [`git show 2026`](https://jeferson-scheibler.github.io/git-show-dati/),
iniciativa do Diretório Acadêmico de Tecnologia da Informação (DATI)
da UNIVATES.

[![git show 2026](https://img.shields.io/badge/git_show-2026-79f2c5?style=flat-square&labelColor=000000)](https://jeferson-scheibler.github.io/git-show-dati/)
