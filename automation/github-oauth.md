# GitHub OAuth App for Decap CMS

Create once at: https://github.com/settings/applications/new

| Field | Value |
|-------|--------|
| Application name | QuBrite CMS |
| Homepage URL | `https://qubrite.com` |
| Authorization callback URL | `https://qubrite.com/api/callback` |

After creation, copy **Client ID** and **Client secret** into:

- Cloudflare Pages → Settings → Environment variables, or
- `automation/.env.cloudflare` and run `./automation/sync-cloudflare-env.sh`

The OAuth app owner must have **push** access to `bnz183/qubrite`.
