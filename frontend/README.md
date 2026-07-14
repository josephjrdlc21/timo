# Timo Frontend

pnpm monorepo containing two apps and shared packages, all wired with Vite, React 19,
TypeScript, TanStack Query/Table, React Router, React Hook Form, Axios, Tailwind CSS v4,
Vitest, ESLint and Prettier.

## Layout

```
frontend/
├── pnpm-workspace.yaml     # workspace globs + catalog (single source of dependency versions)
├── package.json            # root scripts + shared lint/test/format tooling
├── tsconfig.base.json      # shared compiler options
├── eslint.config.mjs       # shared flat ESLint config
├── prettier.config.mjs
├── vitest.config.ts        # aggregates app test projects
├── packages/
│   ├── common/   → @timo/common    (axios client, QueryClient factory, shared types)
│   ├── ui/       → @timo/ui        (Tailwind React components + RHF field wrappers)
│   └── features/ → @timo/features  (cross-app feature modules, e.g. DataTable)
├── client-spa/   → @timo/client-spa
└── iam-admin/    → @timo/iam-admin
```

## Requirements

- Node `>= 22.12` (see `.nvmrc` → `22.14.0`)
- pnpm `>= 9.5` (uses the workspace `catalog:` feature)

## Install (one command, wires the whole workspace)

```bash
pnpm install
```

## How dependencies are shared

- **Versions** are declared **once** in the `catalog:` block of `pnpm-workspace.yaml`.
  Every `package.json` references them as `"react": "catalog:"`. Bump a version in one
  place and all packages pick it up.
- **Code** is shared via internal `@timo/*` packages consumed with `workspace:*`.
  They export TypeScript source directly (no build step); Vite/Vitest transpile them.
  `react`/`react-dom` are peer deps in the packages so there is a single React instance.

## Scripts (run from `frontend/`)

| Command                | What it does                              |
| ---------------------- | ----------------------------------------- |
| `pnpm dev:client`      | Start `client-spa` dev server (port 5173) |
| `pnpm dev:iam`         | Start `iam-admin` dev server (port 5174)  |
| `pnpm build`           | Type-check + production build both apps   |
| `pnpm build:staging`\* | Build with `--mode staging` (per app)     |
| `pnpm lint`            | ESLint across the whole workspace         |
| `pnpm format`          | Prettier write                            |
| `pnpm typecheck`       | `tsc --noEmit` in every package           |
| `pnpm test`            | Run all Vitest suites (jsdom)             |
| `pnpm test:cov`        | Tests with V8 coverage                    |

\* `build:staging` is defined per app; run e.g. `pnpm --filter @timo/client-spa build:staging`.

## Environments

Each app has `.env.dev`, `.env.staging`, `.env.prod`. The scripts select them via Vite mode
(`--mode dev|staging|prod`). Add variables prefixed with `VITE_` to expose them to the client
(e.g. `VITE_API_URL`).

## Adding a dependency everywhere

1. Add the version to the `catalog:` block in `pnpm-workspace.yaml`.
2. Reference `"<pkg>": "catalog:"` in each `package.json` that needs it.
3. `pnpm install`.
