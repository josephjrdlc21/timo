# TIMO Jira Ticket Guide

This file defines how Claude should draft Jira-style tickets for TIMO (personal
finance tracker project). Follow this structure and these conventions every
time, unless told otherwise for a specific request.

**Stack reference:** Node.js, Express.js, TypeScript, Prisma, MySQL (native
install, no Docker), Zod, JWT, React, Vite, Tailwind CSS, TanStack Query,
TanStack Table, React Hook Form, pnpm, Vitest (not Jest).

---

## 1. Ticket Key & Title

- **Key format:** `TIMO-XXX` (use `TIMO-TBD` if not yet assigned).
- **Title format:** `[Area] Short, action-oriented summary`

Examples:

- `[Backend] Add Zod validation to transaction create endpoint`
- `[Frontend] Build TanStack Table view for transaction history`
- `[Auth] Implement JWT refresh token rotation`
- `[Prisma] Add Budget model and migration`

---

## 2. Ticket Type

- **Bug** — something is broken or produces incorrect behavior
- **Task** — chore/config/tooling/docs (Prisma schema updates, env config,
  pnpm scripts, documentation, refactors, investigation/research spikes)
- **Story** — new user-facing functionality
- **Epic** — a group/container of related tickets (Bugs, Tasks, Stories)
  tracking a larger body of work; used to organize and link child tickets
  rather than to describe implementation details itself

> **Note on Epics:** Epic tickets skip most sections below. Use just
> **Summary**, **Background/Context**, and a **Child Tickets** checklist (linking
> out to the Bug/Task/Story tickets underneath it). Acceptance Criteria,
> Technical Notes, and Testing Notes belong on the child tickets, not the
> Epic itself.

---

## 3. Summary (1–2 sentences)

Plain-language description of what's being done and why.

---

## 4. Background / Context

- Which layer this touches: Express API route, Prisma schema/migration,
  React component/page, shared validation (Zod schema), auth middleware, etc.
- Why it's needed (new feature, bug report, follow-up to another ticket)
- Reference related tickets if applicable (e.g. "depends on TIMO-004")

---

## 5. Acceptance Criteria

```
- [ ] Given <context>, when <action>, then <expected result>
- [ ] ...
```

Keep each item independently testable — avoid vague criteria like "works
correctly."

---

## 6. Technical Notes

Check these standing conventions before writing this section:

- **Validation:** all request bodies/params validated with Zod schemas
  before hitting business logic.
- **Auth:** JWT-based; note if a route needs to be protected/unprotected,
  and what role/permission level applies.
- **Database:** any schema change goes through Prisma migrations — note the
  model(s) affected and whether a migration file needs generating.
- **Data fetching (frontend):** use TanStack Query for server state; don't
  reach for local `useState`/`useEffect` fetch patterns.
- **Tables:** list/grid views use TanStack Table, not hand-rolled tables.
- **Forms:** use React Hook Form (+ Zod resolver) for form state/validation.
- **No Docker** — setup/testing instructions should assume native MySQL
  Installer on Windows, not containers.
- **Testing:** Vitest only, not Jest.

---

## 7. Affected Files / Modules

```
- server/src/routes/transactions.ts
- server/prisma/schema.prisma
- client/src/pages/TransactionHistory.tsx
```

If unknown, write "TBD — to be identified during implementation."

---

## 8. Testing Notes

- Unit tests (Vitest) for validation logic, utility functions
- Integration tests for API routes where relevant
- Manual QA notes (e.g. edge cases: negative amounts, empty categories,
  expired tokens)

---

## 9. Out of Scope

State explicitly what this ticket does **not** cover, to prevent scope creep.

---

## 10. Labels (optional)

Suggested: `backend`, `frontend`, `auth`, `prisma`, `validation`, `ui`,
`tooling`, `bug`, `feature`
