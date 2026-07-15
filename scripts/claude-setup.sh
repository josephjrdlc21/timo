#!/usr/bin/env bash
#
# TIMO dev setup: get a fresh clone to a runnable state.
#
# Usage:  ./scripts/claude-setup.sh
#
# Safe to re-run — every step is idempotent and no existing file is
# overwritten. Windows users: run this from Git Bash (or WSL), not
# PowerShell or cmd.
#
set -euo pipefail

# Run from the repo root regardless of where the script was invoked from.
cd "$(git rev-parse --show-toplevel)"

step() { printf '\n\033[1m==> %s\033[0m\n' "$1"; }
info() { printf '    %s\n' "$1"; }
warn() { printf '    \033[33mwarning:\033[0m %s\n' "$1"; }

# ---------------------------------------------------------------------------
step "Checking prerequisites"
# ---------------------------------------------------------------------------
missing=0
for cmd in node pnpm git; do
  if command -v "$cmd" >/dev/null 2>&1; then
    info "$cmd $(command -v "$cmd" >/dev/null && "$cmd" --version 2>/dev/null | head -1)"
  else
    warn "missing required command: $cmd"
    missing=1
  fi
done
if [ "$missing" -ne 0 ]; then
  echo
  echo "Install the missing tools above, then re-run this script."
  echo "Node >=22.12.0 and pnpm >=9.5.0 are required (see package.json engines)."
  exit 1
fi

# claude is optional — only the plugin step needs it.
has_claude=0
if command -v claude >/dev/null 2>&1; then
  has_claude=1
else
  warn "claude CLI not found — the plugin step will be skipped"
fi

# ---------------------------------------------------------------------------
step "Installing dependencies"
# ---------------------------------------------------------------------------
# Root install wires up husky hooks via 'prepare'; the backend's 'postinstall'
# runs 'prisma generate'.
pnpm install
pnpm install:all

# ---------------------------------------------------------------------------
step "Scaffolding environment files"
# ---------------------------------------------------------------------------
# Only the backend needs this: its .env.* files are gitignored, so a fresh
# clone has none. The frontend apps ship their .env.dev/.staging/.prod in git.
if [ -f backend/.env.dev ]; then
  info "backend/.env.dev already exists — leaving it untouched"
else
  cp backend/.env.example backend/.env.dev
  info "created backend/.env.dev from .env.example"
  warn "set DATABASE_URL and JWT_SECRET in backend/.env.dev before running the API"
fi

# ---------------------------------------------------------------------------
step "Installing Claude Code plugins"
# ---------------------------------------------------------------------------
if [ "$has_claude" -eq 1 ]; then
  # Both commands are no-ops if the marketplace/plugin is already present.
  claude plugin marketplace add VoltAgent/awesome-claude-code-subagents >/dev/null 2>&1 \
    || info "marketplace already registered"
  for plugin in voltagent-core-dev voltagent-lang; do
    if claude plugin install "${plugin}@voltagent-subagents" >/dev/null 2>&1; then
      info "installed ${plugin}"
    else
      info "${plugin} already installed"
    fi
  done
else
  info "skipped (no claude CLI on PATH)"
fi

# ---------------------------------------------------------------------------
step "Verifying"
# ---------------------------------------------------------------------------
pnpm check

# ---------------------------------------------------------------------------
cat <<'DONE'

Setup complete.

Next steps:
  1. Install MySQL natively (no Docker) and create the TIMO database.
  2. Set DATABASE_URL and JWT_SECRET in backend/.env.dev.
  3. Start the API:       pnpm -C backend dev
     Start the client:    pnpm -C frontend dev:client
     Start the IAM admin: pnpm -C frontend dev:iam

Conventions: docs/github/git-github-guide.md
DONE
