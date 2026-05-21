# QuBrite Decap CMS admin

Lightweight staff editing portal for blog posts. Decap CMS commits changes directly to GitHub; Cloudflare Pages rebuilds the static site on each push.

**Stack:** Astro + MDX + Decap CMS 3.8 (CDN) + GitHub backend + Cloudflare Pages Functions for OAuth.

---

## Open the admin

| Environment | URL |
|-------------|-----|
| Production | https://qubrite.com/admin/ |
| Local | http://localhost:4321/admin/ |

Files: `public/admin/index.html`, `public/admin/config.yml`.  
`/admin/` is `noindex` in `robots.txt` and in the admin HTML meta tag.

---

## Why production login failed before

Decap CMS 3.8 **`github` backend does not support browser-only PKCE**. That flow exists only for the **GitLab** backend. The GitHub login button always uses an OAuth **server** — by default Netlify’s broker at `api.netlify.com`.

On **Cloudflare Pages**, Netlify rejects auth unless `qubrite.com` is registered as a Netlify site. Earlier configs that used:

- `git-gateway` — requires **Netlify Identity** (wrong host)
- `auth_type: pkce` + `app_id` — **silently ignored** by the GitHub backend in 3.8.0

**What works on Cloudflare:** OAuth handlers on **your own domain** via Cloudflare Pages Functions (`functions/api/`), with `base_url` + `auth_endpoint` in `config.yml`. This repo includes those handlers.

Official reference: [Decap — Using GitHub with an OAuth Proxy](https://decapcms.org/docs/backends-overview/).

---

## Production setup (one-time)

### 1. GitHub OAuth App

Create at https://github.com/settings/developers → **OAuth Apps** → **New OAuth App**:

| Field | Value |
|-------|--------|
| Application name | QuBrite CMS (or similar) |
| Homepage URL | `https://qubrite.com` |
| Authorization callback URL | `https://qubrite.com/api/callback` |

Copy **Client ID** and generate a **Client secret**.

The OAuth app must have access to commit to `bnz183/qubrite` (your GitHub user needs push access; collaborators need push too).

### 2. Cloudflare Pages secrets (fixes “Missing GITHUB_CLIENT_ID”)

The OAuth functions read **`context.env`** — variables must live on the **Pages project**, not a random Worker.

1. https://dash.cloudflare.com/ → **Workers & Pages**
2. Open the **Pages** project that builds `bnz183/qubrite` (production domain `qubrite.com`)
3. **Settings** → **Environment variables** → **Add variable**

| Variable name | Value | Type | Environments |
|---------------|--------|------|----------------|
| `GITHUB_CLIENT_ID` | Paste Client ID from GitHub OAuth App | Plain text | **Production** ✓ and **Preview** ✓ |
| `GITHUB_CLIENT_SECRET` | Paste Client secret | **Encrypt** (secret) | **Production** ✓ and **Preview** ✓ |

Names must match **exactly** (case-sensitive): `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`.

4. **Save**
5. **Redeploy** — new variables are not applied to old deployments. Use **Deployments** → **Retry deployment** on latest, or push any commit to `main`.

Until both are set and redeployed, `/api/auth` returns **503** with setup instructions (not a code bug).

### 3. Verify after deploy

1. Open https://qubrite.com/admin/
2. Click **Login with GitHub** — popup should go to GitHub, then return via `/api/callback`
3. Create a test post with **Draft: true**, publish, confirm a commit on `main` and a Cloudflare build

If login fails:

- Callback URL in GitHub must match **exactly** `https://qubrite.com/api/callback`
- Secrets must be set on the **same** Cloudflare project that serves `qubrite.com`
- Check **Functions** logs in Cloudflare for `/api/auth` and `/api/callback`

---

## Local dev (no GitHub OAuth needed)

`local_backend: true` makes Decap use a **local proxy** on port 8081 when you open `/admin/` on localhost.

**Terminal 1:**

```bash
pnpm dev
```

**Terminal 2:**

```bash
pnpm cms:local
# same as: npx decap-server
```

Open http://localhost:4321/admin/. Edits write to `src/content/blog/` on disk — **no GitHub commit**. Use git yourself when ready.

Do not point local `base_url` at production OAuth; localhost uses the local backend automatically.

---

## Alternative: Netlify OAuth broker (no Functions)

If you prefer not to use Pages Functions:

1. Create a free Netlify site and attach custom domain `qubrite.com` (DNS can still point to Cloudflare for the main site — this is only for OAuth registration; see Netlify docs).
2. Configure GitHub provider in Netlify **Access control → OAuth**.
3. In `config.yml`, remove `base_url` / `auth_endpoint` and set only:

```yaml
backend:
  name: github
  repo: bnz183/qubrite
  branch: main
  site_domain: qubrite.com
```

GitHub OAuth callback for Netlify: `https://api.netlify.com/auth/done`

This repo’s **default** is Cloudflare Functions (same domain, no Netlify site required).

---

## Create a post

1. Open `/admin` and log in with GitHub (production) or use local backend (dev).
2. **Blog Posts** → **New Blog Post**.
3. Required fields (must match `src/content.config.ts`):

| Field | Notes |
|-------|--------|
| Title | Max 80 characters |
| Description | SEO / card summary |
| Publish Date | UTC ISO, e.g. `2026-05-21T13:30:00Z` |
| Hero Image | e.g. `../../assets/images/default-cover.png` |
| Category | One of the six enum values (see below) |
| Tags | One tag per list entry |
| Draft | `true` while editing; `false` to publish |
| Body | Markdown (MDX body) |

**Categories (exact strings):**

- AI & Web Development
- Automation
- Cyber Labs
- Privacy Tech
- Hardware
- Business & Finance

4. **Publish** (production) commits `src/content/blog/<slug>.mdx` to `main`.

---

## Draft vs publish

| `draft` | Site behavior |
|---------|----------------|
| `true` | Hidden from routes, RSS, homepage, categories |
| `false` | Live after Cloudflare build completes |

---

## Hero images

Use **`src/assets/images/`** — not `public/uploads/`.

- Frontmatter: `../../assets/images/your-file.jpg`
- Astro `image()` in `content.config.ts` resolves these paths
- CMS: `media_folder: src/assets/images`, `public_folder: ../../assets/images`

---

## Files

| Path | Role |
|------|------|
| `public/admin/index.html` | Loads Decap CMS 3.8 from unpkg |
| `public/admin/config.yml` | Backend, collections, media |
| `functions/api/auth.js` | Starts GitHub OAuth (production) |
| `functions/api/callback.js` | Completes OAuth, returns token to Decap |
| `src/content/blog/*.mdx` | Posts |
| `automation/cms-admin.md` | This guide |

---

## What Decap does not change

- No database, no WordPress
- RSS, sitemap, Pagefind, categories, and static deploy unchanged
- No Astro or pnpm dependency updates required for CMS
