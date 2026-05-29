#!/usr/bin/env bash
#
# Safe production deploy for the ff-careers Expo web app -> Vercel (app.ffcareers.app).
#
# Why this script exists:
#   Deploying from ff-careers/ ships a STALE dist/ (its vercel.json has no build
#   command). That's how the old www.ffcareers.app URL kept getting redeployed.
#   This script always rebuilds from source, then deploys from the repo root so
#   the root vercel.json build command is the single source of truth.
#
# Usage:
#   ./scripts/deploy-web.sh            # production deploy (--prod)
#   ./scripts/deploy-web.sh --preview  # preview deploy (no --prod)

set -euo pipefail

# Resolve repo root from this script's location, regardless of where it's called.
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP_DIR="$ROOT/ff-careers"

PROD_FLAG="--prod"
if [[ "${1:-}" == "--preview" ]]; then
  PROD_FLAG=""
  echo "==> Mode: PREVIEW deploy"
else
  echo "==> Mode: PRODUCTION deploy"
fi

echo "==> Removing stale build: $APP_DIR/dist"
rm -rf "$APP_DIR/dist"

echo "==> Building fresh web bundle (expo export)"
( cd "$APP_DIR" && npm install && npx expo export --platform web )

# Fail loudly if the bundle still points at the old origin instead of the backend.
echo "==> Verifying bundle targets the backend (ff-careers.fly.dev)"
ENTRY_JS=$(find "$APP_DIR/dist/_expo/static/js/web" -name 'entry-*.js' | head -1)
if [[ -z "$ENTRY_JS" ]]; then
  echo "ERROR: no entry-*.js found in dist; build likely failed." >&2
  exit 1
fi
if grep -q "www.ffcareers.app" "$ENTRY_JS"; then
  echo "ERROR: bundle still references www.ffcareers.app (stale/wrong BASE)." >&2
  echo "       Check ff-careers/services/api.ts before deploying." >&2
  exit 1
fi
if ! grep -q "ff-careers.fly.dev" "$ENTRY_JS"; then
  echo "ERROR: bundle does not reference ff-careers.fly.dev." >&2
  echo "       Check ff-careers/services/api.ts before deploying." >&2
  exit 1
fi
echo "    OK: bundle targets ff-careers.fly.dev"

echo "==> Deploying from repo root via Vercel"
( cd "$ROOT" && npx vercel $PROD_FLAG )

echo "==> Done."
