#!/usr/bin/env bash
# Push QuBrite env vars to Cloudflare Pages (GA + GitHub CMS OAuth).
# Requires: CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_PAGES_PROJECT (default: qubrite)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ -f .env ]]; then
  set -a
  # shellcheck source=/dev/null
  source .env
  set +a
fi
if [[ -f automation/.env.cloudflare ]]; then
  set -a
  # shellcheck source=/dev/null
  source automation/.env.cloudflare
  set +a
fi

: "${CLOUDFLARE_API_TOKEN:?Set CLOUDFLARE_API_TOKEN (Pages Edit)}"
: "${CLOUDFLARE_ACCOUNT_ID:?Set CLOUDFLARE_ACCOUNT_ID}"
CLOUDFLARE_PAGES_PROJECT="${CLOUDFLARE_PAGES_PROJECT:-qubrite}"

GA_ID="${PUBLIC_GA_MEASUREMENT_ID:-G-XX3Z7TZP3Y}"
: "${GITHUB_CLIENT_ID:?Set GITHUB_CLIENT_ID from GitHub OAuth App}"
: "${GITHUB_CLIENT_SECRET:?Set GITHUB_CLIENT_SECRET from GitHub OAuth App}"

API="https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/pages/projects/${CLOUDFLARE_PAGES_PROJECT}"

patch_env() {
  local env_name="$1"  # production | preview
  local payload="$2"
  curl -sf -X PATCH "${API}" \
    -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
    -H "Content-Type: application/json" \
    --data "${payload}" >/dev/null
  echo "Updated ${env_name} environment variables on ${CLOUDFLARE_PAGES_PROJECT}"
}

for env_name in production preview; do
  patch_env "${env_name}" "$(jq -n \
    --arg ga "${GA_ID}" \
    --arg cid "${GITHUB_CLIENT_ID}" \
    --arg csec "${GITHUB_CLIENT_SECRET}" \
    --arg env "${env_name}" \
    '{
      deployment_configs: {
        (env): {
          env_vars: {
            PUBLIC_GA_MEASUREMENT_ID: { value: $ga },
            GITHUB_CLIENT_ID: { value: $cid },
            GITHUB_CLIENT_SECRET: { value: $csec, type: "secret_text" }
          }
        }
      }
    }')"
done

echo "Trigger a redeploy in Cloudflare (Deployments → Retry) so GA and Functions pick up changes."
