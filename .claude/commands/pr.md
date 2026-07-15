---
description: Open a pull request for the current branch following the TIMO Git guide
allowed-tools: Bash(git status:*), Bash(git log:*), Bash(git diff:*), Bash(git branch:*), Bash(git push:*), Bash(gh pr create:*), Bash(gh pr view:*), Bash(pnpm run check:*), Read, Grep
---

Open a pull request for the current branch.

## Context

- Current branch: !`git rev-parse --abbrev-ref HEAD`
- Status: !`git status --short`
- Commits not on develop: !`git log develop..HEAD --oneline`
- Files changed vs develop: !`git diff develop...HEAD --stat`

## Instructions

Read `docs/github/git-github-guide.md` first — it is the source of truth for
branch, commit, and PR conventions. Follow it over anything restated here.

Then:

1. **Check preconditions.** Do not open a PR if any of these fail — report the
   problem and stop:
   - There is at least one commit on this branch that is not on `develop`.
   - The working tree is clean. Uncommitted changes mean the PR would not
     contain the work; tell the user rather than committing on their behalf.
   - The branch is not `develop` or `main` itself.

2. **Identify the ticket.** Take the `TIMO-XXX` key from the branch name
   (format: `<type>/<TIMO-XXX>-<slug>`). If the branch has no ticket key, ask
   the user for it rather than guessing.

3. **Run `pnpm check`** (format, lint, typecheck). If it fails, report the
   failure and stop — do not open a PR on a red branch.

4. **Push the branch** with upstream tracking if it has no remote yet.

5. **Build the PR body from `.github/pull_request_template.md`.** Read that
   file and fill every section:
   - Replace `TIMO-XXX` with the real key in both the text and the link.
   - Summary: why the change was made, not a restatement of the diff.
   - Changes: tick only the layers the diff actually touches (check it against
     `git diff develop...HEAD --stat` rather than assuming), replace each
     comment hint with what changed there, and delete the untouched rows.
   - Acceptance Criteria: pull the real AC from the Jira ticket via the
     Atlassian MCP (cloudId `ba7b35d9-327c-4778-ad60-0e9059d273a9`) and restate
     them as a checklist. Leave them unchecked — they are for the reviewer.
   - How to verify: concrete steps someone else can run.
   - Checklist: tick only what you actually confirmed. Leave the rest unticked
     rather than assuming.
   - Notes for reviewer: tradeoffs, out-of-scope items, follow-up tickets. Omit
     the section if there is genuinely nothing to say.

6. **Create the PR** with `gh pr create --base develop`, titled
   `TIMO-XXX: <summary>` per the guide. Base it on `develop`, never `main`.

7. **Report** the PR URL back to the user.

## Notes

- If the user passed arguments ($ARGUMENTS), treat them as a steer on the PR
  title or emphasis for the summary.
- Do not mark checklist items as done that you did not verify. An inaccurate
  checklist is worse than an empty one.
- If the ticket's scope and the actual diff disagree, say so in the PR body
  rather than quietly papering over it.
