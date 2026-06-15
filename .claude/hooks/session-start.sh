#!/bin/bash
# SessionStart hook — prépare l'environnement des sessions Claude Code (web).
# Installe les dépendances Node pour que `npm run build` / `npm run check`
# fonctionnent immédiatement. Idempotent (sans danger à relancer).
set -euo pipefail

# Ne s'exécute que dans l'environnement distant (Claude Code on the web).
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-.}"

# Installe les dépendances (npm install profite du cache du conteneur).
npm install --no-audit --no-fund
