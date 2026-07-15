# TIMO Git & GitHub Guide

Conventions for branches, commits, pull requests, and merging on the TIMO
project. Follow these every time, unless told otherwise for a specific request.

---

## 1. Branch Naming

**Format:** `<type>/<TIMO-XXX>-<short-slug>`

- `type` matches the ticket type, lowercase:
  - `bug/TIMO-012-fix-negative-amount-validation`
  - `task/TIMO-015-add-budget-migration`
  - `story/TIMO-020-transaction-history-table`
- Epics don't get their own branch — work happens on the child tickets'
  branches, not the Epic itself.
- **Slug:** lowercase, hyphen-separated, 3–6 words max. Just enough to identify
  the branch at a glance in a branch list — no need to match the ticket
  title verbatim.
- Base branches off `develop` unless a ticket depends on another in-progress
  branch (in which case, note that dependency in the ticket).

---

## 2. Commit Messages

**Format:** `<type>(TIMO-XXX): <short summary, imperative mood>`

- `type` uses [Conventional Commits](https://www.conventionalcommits.org/)
  prefixes, mapped from ticket type:
  - **Bug** → `fix`
  - **Task** → `chore` (or `refactor` / `docs` if that's more specific to the
    change)
  - **Story** → `feat`

Examples:

- `fix(TIMO-012): reject negative transaction amounts in Zod schema`
- `chore(TIMO-015): add Budget model and Prisma migration`
- `refactor(TIMO-018): extract useTransactionForm hook`
- `docs(TIMO-022): document env setup for native MySQL install`
- `feat(TIMO-020): add TanStack Table view for transaction history`

Rules:

- Keep the summary line under ~72 characters, imperative mood ("add", not
  "added" or "adds").
- A body is **required** on every commit — focus on **why**, not just what.
  Wrap body text at ~72 characters.
- One logical change per commit. Don't bundle an unrelated fix into a
  feature commit, even if you noticed it along the way — split it out.

These rules are enforced automatically by a Husky `commit-msg` hook
(`validate-commit-msg.mjs`), and `pnpm check` runs on `pre-commit`.
See [Git hooks](#5-git-hooks-husky) below.

### Example with a body

```
fix(TIMO-012): reject negative transaction amounts in Zod schema

Users could submit a transaction with a negative amount, which threw
off balance calculations on the dashboard. Added a .positive() check
to the amount field so the API rejects it before it reaches the
database.
```

- Blank line between summary and body — required.
- Body is plain prose (or short bullet points if listing multiple related
  changes), not a restatement of the summary line.
- A body is required even for small commits — briefly state the reason for the
  change rather than leaving it empty.
- If the commit closes the ticket, add a footer line: `Closes TIMO-012`

---

## 3. Pull Request Titles

**Format:** `<TIMO-XXX>: <same summary as the branch/primary commit>`

- Example: `TIMO-020: Add TanStack Table view for transaction history`
- PR description should link back to the ticket and restate the Acceptance
  Criteria as a checklist, so review can be checked off against it directly.

---

## 4. Merging

- All `feature`/`bug`/`task` branches merge into `develop`, not `main`.
- `main` only receives merges from `develop` at release time.
- Squash-merge by default, so the final commit on `develop` reads as one
  clean Conventional Commit line per ticket.
- Delete the branch after merge.

---

## 5. Git hooks (Husky)

Husky is installed at the repo root and enforces the rules above on every
commit. Two hooks run:

- **`pre-commit`** → `pnpm check` (format:check + lint + typecheck across
  backend and frontend). A commit is blocked if any of these fail.
- **`commit-msg`** → `validate-commit-msg.mjs`, which rejects the
  commit unless the message:
  - matches `<type>(TIMO-XXX): <summary>` with a type of `feat`, `fix`,
    `chore`, `refactor`, or `docs`, and a `TIMO-<number>` scope;
  - has a header of at most 72 characters;
  - includes a body, separated from the header by a blank line.

Merge, revert, and fixup/squash messages skip `commit-msg` validation.

Hooks install automatically via the root `prepare` script on `pnpm install`.
In a genuine emergency a hook can be bypassed with `git commit --no-verify`,
but that defeats the point — prefer fixing the underlying issue.
