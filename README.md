# ISO 27001 Assessment Backend

NestJS + Prisma + PostgreSQL backend for an ISO 27001:2022 self-assessment app.

## Stack
- NestJS 10
- Prisma 5 (PostgreSQL)
- class-validator / class-transformer

## Getting started

```bash
cp .env.example .env
docker compose up -d
npm install
npm run prisma:migrate -- --name init
npm run prisma:seed
npm run start:dev
```

API: `http://localhost:3001/api`
DB: `postgresql://iso27001:iso27001@localhost:5432/iso27001`

## Modules
- `companies` — CRUD of empresas evaluadas
- `assessments` — evaluaciones por empresa (`status`: `draft` | `completed` | `analyzed`)
- `questions` — read-only listing of the 93 ISO 27001:2022 Annex A controls
- `answers` — respuestas por evaluación (`yes` | `partial` | `no` | `na`)
- `ai` — stub for AI report generation

## Endpoints (selected)
- `POST /api/companies`
- `GET /api/companies/:id`
- `POST /api/assessments` `{ companyId }`
- `GET /api/assessments/:id`
- `PUT /api/assessments/:id/answers` `{ questionId, value, notes? }`
- `POST /api/assessments/:id/answers/bulk` `{ answers: [...] }`
- `POST /api/assessments/:id/analyze` → `{ status: "pending" }` (stub)
- `GET /api/questions?domain=...`

## Seed
Loads all 93 Annex A controls of ISO/IEC 27001:2022 with `controlRef`,
`controlName`, `domain`, `criticality` (`alta` | `media` | `baja`)
and `questionText` in Spanish. Re-runnable (idempotent upsert).
