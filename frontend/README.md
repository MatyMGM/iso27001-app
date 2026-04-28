# ISO 27001 Assessment — Frontend

Next.js 14 (App Router) + Tailwind + shadcn/ui. Conecta al backend NestJS en `localhost:3001`.

## Stack
- Next.js 14 + React 18
- Tailwind CSS + shadcn/ui (primitives en `components/ui/`)
- Recharts (radar chart) + SVG custom (gauge)
- Sonner (toasts)
- Lucide icons

## Setup

```bash
cp .env.local.example .env.local
npm install
npm run dev
```

Frontend: `http://localhost:3000`
Backend esperado: `http://localhost:3001/api` (configurable vía `NEXT_PUBLIC_API_URL`).

## Flujos

1. **`/register`** — formulario de empresa → `POST /companies` + `POST /assessments` → redirige al wizard.
2. **`/assessment/[id]`** — wizard de 4 pasos por dominio (A.5 / A.6 / A.7 / A.8). Auto-guardado con debounce de 800 ms vía `POST /assessments/:id/answers/bulk`. El último paso marca `status=completed`, dispara `/analyze` y redirige al reporte.
3. **`/report/[id]`** — hace polling cada 2s sobre `GET /assessments/:id` esperando `status === "analyzed"`. Después de 6s cae a un cómputo local del reporte (gauge global, radar por dominio, tabla de brechas, hoja de ruta). El botón "Descargar PDF" está deshabilitado por ahora.

## Tema
Esquema oscuro azul marino + acento azul. Tokens HSL en `app/globals.css`. UI en español.
