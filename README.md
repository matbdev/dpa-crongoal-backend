# CronGoal - The open source goal tracking application, designed by/for you!

![Node.js](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Passport.js](https://img.shields.io/badge/Passport-34E27A?style=for-the-badge&logo=passport&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-000000?style=for-the-badge&logo=zod&logoColor=3068B7)

> [!NOTE]
> This README is particularly focused on documenting the **Backend API** built natively with Express.js.

## Summary
- [Introduction](#introduction)
- [Core Features](#core-features)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
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

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [PostgreSQL](https://www.postgresql.org/) running locally or via [Docker](https://www.docker.com/)
- A [Google Cloud Console](https://console.cloud.google.com/) project with OAuth 2.0 credentials (for Google login)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/dpa-crongoal-backend.git
cd dpa-crongoal-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/crongoal"

# JWT
JWT_SECRET="your-secret-key-here"

# Google OAuth 2.0
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:5000/api/auth/google/callback"

# Frontend URL (for CORS)
FE_BASE_URL="http://localhost:3000"

# Backend URL
BE_BASE_URL="http://localhost:5000"

# Server
PORT=5000
```

### 4. Setup the database
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev
```

### 5. Run the development server
```bash
npm run dev
```

The API will be available at `http://localhost:5000`. You can verify it by hitting the health endpoint:
```
GET http://localhost:5000/api/health
```

## API Reference

> All routes (except Auth and Health) require a JWT Bearer token: `Authorization: Bearer <token>`

<details>
<summary><strong>Auth</strong> — <code>/api/auth</code> (Public)</summary>

| Method | Endpoint | Description | Body |
|:--|:--|:--|:--|
| `GET` | `/google` | Redirects to Google OAuth consent screen | — |
| `GET` | `/google/callback` | Google callback, returns JWT | — |
| `POST` | `/login` | Local login | `{ email, password }` |
| `POST` | `/register` | Create account | `{ email, password (min 8, no sequential numbers, no name parts), fullName }` |

</details>

<details>
<summary><strong>User</strong> — <code>/api/user</code></summary>

| Method | Endpoint | Description | Body |
|:--|:--|:--|:--|
| `GET` | `/` | Get authenticated user's profile | — |
| `PUT` | `/` | Update profile | `{ displayName?, picUrl?, theme? (DARK/LIGHT) }` |
| `DELETE` | `/` | Delete account (cascade) | — |
| `GET` | `/admin/all` | List all users (**ADMIN only**) | — |

</details>

<details>
<summary><strong>Project</strong> — <code>/api/project</code></summary>

| Method | Endpoint | Description | Body |
|:--|:--|:--|:--|
| `GET` | `/` | List user's projects | — |
| `GET` | `/count` | Get total number of projects | — |
| `POST` | `/` | Create project | `{ title (min 3), description?, limitDate (future) }` |
| `GET` | `/:id` | Get project by ID | — |
| `PUT` | `/:id` | Update project (all fields optional) | Same as create |
| `DELETE` | `/:id` | Delete project (cascade) | — |

</details>

<details>
<summary><strong>Task</strong> — <code>/api/task</code></summary>

| Method | Endpoint | Description | Body |
|:--|:--|:--|:--|
| `GET` | `/` | List user's tasks | — |
| `GET` | `/count` | Get total number of tasks | — |
| `GET` | `/daily` | List daily completion registers | — |
| `POST` | `/` | Create task | `{ title, description?, type (UNIQUE/RECURRENT), generatedPoints (int ≥1), columnId? }` |
| `POST` | `/daily` | Register daily completion | `{ taskId, isDone?, obs? }` |
| `PUT` | `/move` | Move task to column | `{ id (task), newColumnId }` |
| `GET` | `/:id` | Get task by ID | — |
| `PUT` | `/:id` | Update task (all fields optional) | Same as create |
| `DELETE` | `/:id` | Delete task | — |

</details>

<details>
<summary><strong>Kanban</strong> — <code>/api/kanban</code></summary>

| Method | Endpoint | Description | Body |
|:--|:--|:--|:--|
| `GET` | `/project/:projectId` | List columns by project | — |
| `POST` | `/` | Create column | `{ name, order (≥0), projectId, color? }` |
| `GET` | `/:id` | Get column by ID | — |
| `PUT` | `/:id` | Update column (all fields optional) | Same as create |
| `DELETE` | `/:id` | Delete column | — |

</details>

<details>
<summary><strong>Reward</strong> — <code>/api/reward</code></summary>

| Method | Endpoint | Description | Body |
|:--|:--|:--|:--|
| `GET` | `/` | List user's rewards | — |
| `GET` | `/count` | Get total number of rewards | — |
| `GET` | `/redeems` | List all user's redeem history | — |
| `POST` | `/` | Create reward | `{ title (min 3), description?, pointsToGet (int ≥1), icon? }` |
| `GET` | `/:id` | Get reward by ID (includes redeems) | — |
| `GET` | `/:id/redeems` | List redeems for a reward | — |
| `POST` | `/:id/redeem` | Redeem reward (deducts points) | `{ spentPoints (int ≥1) }` |
| `PUT` | `/:id` | Update reward (all fields optional) | Same as create |
| `DELETE` | `/:id` | Delete reward | — |

</details>

<details>
<summary><strong>Routine</strong> — <code>/api/routine</code></summary>

| Method | Endpoint | Description | Body |
|:--|:--|:--|:--|
| `GET` | `/` | List user's routines | — |
| `GET` | `/count` | Get total number of routines | — |
| `POST` | `/` | Create routine | `{ name (min 3), description? }` |
| `GET` | `/:id` | Get routine by ID (includes tasks) | — |
| `PUT` | `/:id` | Update routine (all fields optional) | Same as create |
| `POST` | `/task` | Add task to routine | `{ taskId }` + params `{ id (routine) }` |
| `DELETE` | `/task` | Remove task from routine | `{ taskId }` + params `{ id (routine) }` |
| `DELETE` | `/:id` | Delete routine | — |

</details>

<details>
<summary><strong>Health</strong> — <code>/api/health</code> (Public)</summary>

| Method | Endpoint | Description |
|:--|:--|:--|
| `GET` | `/` | Returns `{ status, message, timestamp }` |

</details>

### Error Responses

| Status | When |
|:--|:--|
| `400` | Invalid data, foreign key constraint, or insufficient points |
| `401` | Missing or invalid JWT |
| `403` | Requires ADMIN role |
| `404` | Resource not found |
| `409` | Duplicate record (unique constraint) |
| `500` | Internal server error |

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
