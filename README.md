# CronGoal - The open source goal tracking application, designed by/for you!

**Backend:**
![Node.js](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Passport.js](https://img.shields.io/badge/Passport-34E27A?style=for-the-badge&logo=passport&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-000000?style=for-the-badge&logo=zod&logoColor=3068B7)

**Frontend:**
![Next.js](https://img.shields.io/badge/next%20js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)

> [!NOTE]
> This README is particularly focused on documenting the **Backend API** built natively with Express.js.

## Summary
- [Introduction](#introduction)
- [Core Features](#core-features)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Project Structure](#project-structure)
- [API Routes](#api-routes)
- [Roadmap](#roadmap)

## Introduction
Have you ever wanted to take control of your routine tasks, but never found a simple and intuitive way to do it? If your answer is _Yes_, you're exactly in the right place!
Welcome to CronGoal, the open-source goal-tracking application designed with simplicity in mind!

If you're tired of cluttered applications that demand more time configuring the tool than actually managing your goals, give this project a chance. This API powers the entire CronGoal ecosystem, ensuring blazing fast requests, solid security, and an incredibly strict yet decoupled backend architecture.

## Core Features
- **Intuitive Kanban Board System:** Manage your active goals with a flexible column structure mapped effectively via API.
- **Time-Boxed Periods & Routines:** Set goals for specific timeframes and maintain daily routine registers.
- **Gamification & Rewards:** Deep point-based system and reward redeem history to boost daily consistency and habit building.
- **Secure Authentication:** Rock-solid security integrating Google OAuth 2.0 (Passport.js), traditional local login, JSON Web Tokens (JWT), and precise Role-Based Access Control (RBAC).
- **Clean Architecture:** Fully scalable Service-Controller-Router layers eliminating monolithic handlers entirely.

## Architecture & Tech Stack
This backend was intentionally migrated from NestJS to a custom, highly decoupled **Express.js + TypeScript** setup. The goal was to maximize structural control, maintain modern code organization, and wipe out unnecessary boilerplate while keeping an enterprise-level MVC standard.

- **Routing Layer:** Express `Router` instances handling endpoint distribution with JWT protection boundaries.
- **Controllers Layer:** Clean intermediation layer ensuring safe HTTP response mappings and error delegation.
- **Services Layer:** Pure, unpolluted business logical rules and Prisma Database transactions.
- **Middlewares:** Automated JWT payload parsing (`req.user`), RBAC constraints (`requireAdmin`), generic Centralized Error Handler, Helmet web-security, and flexible API Rate Limiting.

## Project Structure

```
src/
├── config/                     # Environment and database configuration
│   └── prisma.ts               # Prisma Client singleton instance
├── controllers/                # HTTP request handlers (translate req/res)
│   ├── auth.controller.ts
│   ├── kanbanColumn.controller.ts
│   ├── project.controller.ts
│   ├── reward.controller.ts
│   ├── routine.controller.ts
│   ├── task.controller.ts
│   └── user.controller.ts
├── middlewares/                # Express middleware pipeline
│   ├── errorHandler.ts         # Global error handler (AppError, Prisma errors)
│   ├── requireAdmin.ts         # RBAC: blocks non-admin users
│   ├── requireJwt.ts           # JWT authentication guard
│   └── validateData.ts         # Zod schema validation middleware
├── routes/                     # Endpoint definitions and middleware chaining
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
├── utils/                      # Shared utility functions and helpers
│   ├── AppError.ts             # Custom error class with HTTP status codes
│   ├── cors.ts                 # CORS configuration
│   ├── jwt.ts                  # JWT token generation
│   ├── password.ts             # Bcrypt hashing utilities
│   └── rateLimiter.ts          # Rate limiting configuration
└── app.ts                      # Express application entry point
```

## API Routes

The API enforces strict `Bearer Token` authorization on all private module endpoints using customized JWT payloads.

| Feature Area | Base Route | Description |
| :--- | :--- | :--- |
| **Authentication** | `/api/auth` | Triggers Google OAuth authentication callback (`/google`) or Local Traditional Login/Register handling. |
| **User Profile** | `/api/user` | Manages the authenticated user's private state, profiles, and highly protected `/admin` endpoints. |
| **Projects** | `/api/project` | Full strict CRUD operations for Project entities that encapsulate their own kanban structure. |
| **Tasks** | `/api/task` | Manages recurrent and one-off tasks, processes daily completions, and handles drag-and-drop column movements. |
| **Kanban** | `/api/kanban` | Enables creation, ordering, and structure modification of custom columns inside projects. |
| **Rewards** | `/api/reward` | Controls gamification rules, creation of personal rewards, and the user's spending/redeeming history. |
| **Routines** | `/api/routine` | Handles aggregation of repetitive tasks into automated routine blueprints. |
| **Health** | `/api/health` | Root check verification to quickly validate server status and uptime. |

## Roadmap
- [x] **Phase 1:** Project scaffolding, Express + TypeScript setup, and `src/` directory architecture
- [x] **Phase 2:** PostgreSQL database modeling with Prisma ORM (entities, enums, relationships, cascades)
- [x] **Phase 3:** Authentication system (Google OAuth 2.0 via Passport.js, local login/register, JWT generation)
- [x] **Phase 4:** Full REST API implementation (Services, Controllers, and Routes for all entities)
- [x] **Phase 5:** Zod schema validation on all mutation/param endpoints
- [x] **Phase 6:** Security hardening (Helmet, CORS, Rate Limiting, RBAC admin middleware)
- [x] **Phase 7:** Centralized error handling with AppError class and Prisma error differentiation
- [ ] **Phase 8:** E2E testing
- [ ] **Phase 9:** Pagination (`skip`/`take`)
- [ ] **Phase 10:** Structured logging (Winston/Morgan)

---
**If you like what you see here, give it a ⭐️ and follow me for future updates and projects!**
