#!/usr/bin/env bash
set -euo pipefail

SITE="${SITE:-https://qubrite.com}"
GA_EXPECT="${GA_EXPECT:-G-XX3Z7TZP3Y}"

echo "Checking ${SITE} for GA (${GA_EXPECT})..."
html="$(curl -sf "${SITE}/")"
if echo "${html}" | grep -q "googletagmanager.com/gtag/js?id=${GA_EXPECT}"; then
  echo "OK: gtag.js present with ${GA_EXPECT}"
else
  echo "FAIL: gtag snippet missing or wrong ID — set PUBLIC_GA_MEASUREMENT_ID on Cloudflare and redeploy"
  exit 1
fi

echo "Checking ${SITE}/api/auth ..."
status="$(curl -sI "${SITE}/api/auth" | head -1)"
if echo "${status}" | grep -q '302'; then
  echo "OK: OAuth redirects to GitHub"
elif echo "${status}" | grep -q '503'; then
  echo "FAIL: GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET missing on Cloudflare Pages"
  exit 1
else
  echo "WARN: unexpected response: ${status}"
  exit 1
fi

echo "All checks passed."
