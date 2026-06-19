> 🇧🇷 [Ver em Português](README.md) · 🔗 [View Frontend](https://github.com/matbdev/dai-crongoal-frontend/blob/main/README-en.md)

# CronGoal — Open source goal tracking application, designed by/for you!

![Node.js](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Passport.js](https://img.shields.io/badge/Passport-34E27A?style=for-the-badge&logo=passport&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-000000?style=for-the-badge&logo=zod&logoColor=3068B7)

> Complete backend API that powers the CronGoal ecosystem — built natively with Express.js + TypeScript, focused on performance, security, and decoupled architecture.

---

## What it is

CronGoal is a gamified personal productivity application that helps users organize tasks, routines, and projects in a visual and intuitive way. The API in this repository is the heart of the system: it manages all business logic, authentication, data persistence, and integration with external services.

If you've ever tried to take control of your routine but never found a tool simple enough for it, this project was made for you. The goal is to eliminate unnecessary complexity and deliver a straightforward experience — without spending more time configuring the tool than actually managing your goals.

## Why it exists

This project was born within the **Desenvolvimento de Aplicações para a Internet (DAI)** course at **UNIVATES**, but it goes beyond an academic assignment. The real motivation came from frustration with productivity tools that are either too simple to sustain real use, or so complex they become yet another obstacle.

CronGoal fills that gap: it's robust enough to track projects with Kanban, periodic routines, and a gamified rewards system — without demanding an absurd learning curve from the user. The idea is for it to work as a daily ally, not as yet another obligation.

## How it works

- **Main language:** TypeScript
- **Framework / Runtime:** Express.js 5 on Node.js
- **Database:** PostgreSQL 16 (via Docker) with Prisma ORM and Supabase as a storage Bucket solution
- **Authentication:** Google OAuth 2.0 (Passport.js) + local login with bcrypt + JWT
- **Validation:** Zod for all mutation endpoints
- **Security:** Helmet, configurable CORS, Rate Limiting, RBAC (admin middleware)
- **Architecture:** Fully decoupled Service → Controller → Router layers, no monolithic handlers

### Project structure

```
src/
├── config/                     # Environment and database configuration
│   └── prisma.ts               # Prisma Client singleton instance
├── controllers/                # HTTP handlers (translate req/res)
│   ├── auth.controller.ts
│   ├── kanbanColumn.controller.ts
│   ├── project.controller.ts
│   ├── reward.controller.ts
│   ├── routine.controller.ts
│   ├── task.controller.ts
│   └── user.controller.ts
├── middlewares/                # Express middleware pipeline
│   ├── errorHandler.ts         # Global error handler (AppError, Prisma)
│   ├── requireAdmin.ts         # RBAC: blocks non-admin users
│   ├── requireJwt.ts           # JWT authentication guard
│   └── validateData.ts         # Zod validation middleware
├── routes/                     # Endpoint definitions and chaining
│   ├── auth.route.ts
│   ├── health.route.ts
│   ├── kanbanColumn.route.ts
│   ├── project.route.ts
│   ├── reward.route.ts
│   ├── routine.route.ts
│   ├── task.route.ts
│   └── user.route.ts
├── schemas/                    # Zod validation schemas (DTOs)
│   ├── auth.schema.ts
│   ├── kanban.schema.ts
│   ├── project.schema.ts
│   ├── reward.schema.ts
│   ├── routine.schema.ts
│   ├── task.schema.ts
│   └── user.schema.ts
├── services/                   # Business logic and Prisma queries
│   ├── auth.service.ts
│   ├── kanbanColumn.service.ts
│   ├── project.service.ts
│   ├── reward.service.ts
│   ├── routine.service.ts
│   ├── task.service.ts
│   └── user.service.ts
├── strategies/                 # Passport.js authentication strategies
│   ├── google.ts               # Google OAuth 2.0 strategy
│   ├── jwt.ts                  # JWT Bearer strategy
│   └── passport.ts             # Strategy registration
├── types/                      # Custom TypeScript type definitions
│   └── jwtPayload.ts
├── utils/                      # Shared utility functions
│   ├── AppError.ts             # Custom error class with HTTP status codes
│   ├── cors.ts                 # CORS configuration
│   ├── jwt.ts                  # JWT token generation
│   ├── password.ts             # Bcrypt hashing utilities
│   └── rateLimiter.ts          # Rate Limiting configuration
└── app.ts                      # Express application entry point
```

## How to run locally

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Docker](https://www.docker.com/) (to run PostgreSQL in a container)
- A [Google Cloud Console](https://console.cloud.google.com/) project with OAuth 2.0 credentials (for Google login)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/matbdev/dai-crongoal-backend.git
cd dai-crongoal-backend

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.template .env
# Edit .env with your actual credentials

# 4. Start the database via Docker
docker compose up -d

# 5. Generate the Prisma Client and run migrations
npx prisma generate
npx prisma migrate dev

# 6. Start the development server
npm run dev
```

Then open `http://localhost:5000/api/health` in your browser or via cURL to verify it's running.

## Demo

Since this repository contains only the backend API, visual demos (screenshots, GIFs, and videos) are available in the frontend README:

👉 [**View demo in the Frontend repository**](https://github.com/matbdev/dai-crongoal-frontend/blob/main/README-en.md#demo)

## Technical decisions

- **Custom Express.js instead of NestJS:** The backend was intentionally migrated from NestJS to a highly decoupled Express.js + TypeScript setup. The motivation was to have full control over the structure, maintain modern code organization without unnecessary boilerplate, and preserve an enterprise-level MVC standard. NestJS solves a lot, but when you want to understand and control every layer, building from scratch pays off.

- **Zod instead of class-validator:** The choice for Zod came from its natural TypeScript integration (type inference) and its ability to validate complex schemas with composition. Every mutation endpoint has its own schema, centralized in the `schemas/` folder.

- **Prisma ORM:** Makes migrations and automatic model typing much easier. The declarative schema (`schema.prisma`) works as living documentation for the database. It's also a security measure, as it prevents typos, SQL Injection, and ensures data integrity.

- **Gamification as a first-class feature:** The points and rewards system wasn't a "nice to have" — it was designed from the start as a core part of the experience. Each completed task generates points; each redeemed reward deducts points. The redemption history is fully tracked.

- **Strict layer separation:** Routes only chain middlewares. Controllers only translate HTTP. Services contain all business logic and Prisma transactions. This makes testing, maintenance, and future migrations easier.

## Next steps

- [ ] E2E tests for all critical flows
- [ ] Pagination (`skip`/`take`) on listings
- [ ] Structured logging
- [ ] Production deployment with CI/CD

## About

Made by **Mateus Carniel Brambilla** ([@matbdev](https://github.com/matbdev))
during the Desenvolvimento de Aplicações para a Internet (DAI) course at UNIVATES.

Submitted to [`git show 2026`](https://jeferson-scheibler.github.io/git-show-dati/),
an initiative by the Diretório Acadêmico de Tecnologia da Informação (DATI)
at UNIVATES.

[![git show 2026](https://img.shields.io/badge/git_show-2026-79f2c5?style=flat-square&labelColor=000000)](https://jeferson-scheibler.github.io/git-show-dati/)
