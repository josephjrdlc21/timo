# CLAUDE.md — TIMO

## Jira ticket creation

Before creating **any** Jira ticket for this project, **read
`docs/jira/jira-ticket-template.md`** and follow its structure and
conventions. Draft the ticket in that format, confirm with the user if anything
is missing, then create it via the Atlassian MCP.

- Jira site (cloudId): `ba7b35d9-327c-4778-ad60-0e9059d273a9`
- Default project key: `TIMO`
- Default assignee: Joseph Dela Cruz Jr.

## Commands

Run from the repo root (a root `package.json` orchestrates both projects):

- `pnpm lint` — ESLint over backend **and** frontend
- `pnpm lint:fix` — same, with autofix
- `pnpm format` — Prettier `--write` over backend and frontend
- `pnpm format:check` — Prettier `--check` (no writes)
- `pnpm typecheck` — `tsc` over backend and frontend
- `pnpm check` — format:check + lint + typecheck for both
- `pnpm install:all` — install deps in both projects

Both projects use ESLint (flat config) + `typescript-eslint`, and Prettier for
formatting. Backend and frontend are pinned to **TypeScript 5.9.3** — do not
bump the backend to TS 7, as no released `typescript-eslint` supports it yet
(it hard-crashes).

**Formatting style:** double quotes (`singleQuote: false`), semicolons, trailing
commas, 100-char width, 2-space indent, LF line endings. Defined once in the
root `prettier.config.mjs` — both projects resolve it via Prettier's upward
config lookup, so there are no per-project Prettier configs. (Each project keeps
its own `.prettierignore`, since the backend must ignore its generated Prisma
client.) Prettier owns formatting; `eslint-config-prettier` disables conflicting
ESLint rules.

## Git & GitHub work

Before creating **any** branch, commit, or pull request for this project,
**read `docs/github/git-github-guide.md`** and follow its conventions (branch
naming, Conventional Commit format, PR titles, and the develop-based merge
flow).
