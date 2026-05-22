# Environment sync (GA + Cloudflare + GitHub CMS)

## Local

```bash
cp .env.example .env
# PUBLIC_GA_MEASUREMENT_ID is optional — defaults to G-XX3Z7TZP3Y in src/data/site.config.ts
```

## Cloudflare Pages (production)

Set on the **Pages project** that serves `qubrite.com` → **Settings** → **Environment variables**:

| Variable | Type | Environments |
|----------|------|--------------|
| `PUBLIC_GA_MEASUREMENT_ID` | Plain text (`G-XX3Z7TZP3Y`) | Production (+ Preview optional) |
| `GITHUB_CLIENT_ID` | Plain text | Production + Preview |
| `GITHUB_CLIENT_SECRET` | Encrypt | Production + Preview |

After changes: **Save** → **Retry deployment** (or push to `main`).

Or run (requires `CLOUDFLARE_API_TOKEN` with Pages edit permission):

```bash
./automation/sync-cloudflare-env.sh
```

## GitHub OAuth App (Decap CMS)

https://github.com/settings/developers → **OAuth Apps** → **New OAuth App**

| Field | Value |
|-------|--------|
| Homepage URL | `https://qubrite.com` |
| Authorization callback URL | `https://qubrite.com/api/callback` |

Copy Client ID and secret into Cloudflare as `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`.

Repo for CMS commits: `bnz183/qubrite` (see `public/admin/config.yml`).

## Verify

```bash
./automation/verify-env.sh
```

- GA: `curl -s https://qubrite.com/ | grep googletagmanager`
- OAuth: `curl -sI https://qubrite.com/api/auth` → `302` to GitHub (not `503`)
