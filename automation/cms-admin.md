# QuBrite Decap CMS admin

Lightweight staff editing portal for blog posts. Decap CMS commits changes directly to GitHub; Cloudflare Pages rebuilds the static site on each push.

---

## Open the admin

**Production:** [https://qubrite.com/admin/](https://qubrite.com/admin/)

**Local dev** (requires local backend — see below): [http://localhost:4321/admin/](http://localhost:4321/admin/)

The UI loads from `public/admin/index.html` and reads `public/admin/config.yml`.

---

## Auth: what actually works

### Local dev — works today, no setup required

```bash
# Terminal 1 — Astro dev server
pnpm dev

# Terminal 2 — Decap local backend
npx decap-server
```

Open [http://localhost:4321/admin/](http://localhost:4321/admin/). Changes are written to local files only; no GitHub commit is created. `local_backend: true` in `config.yml` activates this automatically on localhost.

---

### Production — requires an OAuth proxy

**Why:** Decap CMS 3.x uses the `github` backend to authenticate via Netlify's OAuth service (`api.netlify.com`) by default. For a non-Netlify host like Cloudflare Pages, Netlify will reject the auth request because `qubrite.com` is not a registered Netlify site.

> **Note on `auth_type: pkce`:** This option exists in Decap's codebase but is only implemented for the **GitLab** backend. The GitHub backend silently ignores `auth_type` and `app_id` — browser-only PKCE for GitHub is not supported in Decap CMS 3.8.0.

You need one of the following to enable production login:

---

#### Option A — Netlify OAuth service (simplest, free)

Register the site with Netlify without hosting it there. Netlify's OAuth service becomes the intermediary.

1. Create a free Netlify account at [netlify.com](https://netlify.com).
2. **New site → Deploy manually** (upload any placeholder `index.html`).
3. In Netlify site settings → **Domain management** → set custom domain to `qubrite.com`.
4. Copy the **Site ID** from **Site settings → General** (looks like `abc123de-...`).
5. Create a **GitHub OAuth App** at [github.com/settings/developers](https://github.com/settings/developers):
   - **Homepage URL:** `https://qubrite.com`
   - **Authorization callback URL:** `https://api.netlify.com/auth/done`
6. In Netlify site settings → **Access control → OAuth** → add a **GitHub provider** using the OAuth App's Client ID and Client Secret.
7. In `public/admin/config.yml`, set `site_domain`:

```yaml
backend:
  name: github
  repo: bnz183/qubrite
  branch: main
  site_domain: qubrite.com   # must match the domain registered in Netlify
```

Commit and push. Cloudflare Pages redeploys. Login from `qubrite.com/admin` will now work via Netlify's OAuth broker.

---

#### Option B — self-hosted OAuth proxy (full control)

Deploy a small OAuth proxy. A ready-made Cloudflare Worker is available:

- [vencax/netlify-cms-github-oauth-provider](https://github.com/vencax/netlify-cms-github-oauth-provider) (Node, deployable to Cloudflare Workers, Heroku, Railway, etc.)

Steps:
1. Fork and deploy the proxy (e.g. `https://qubrite-oauth.workers.dev`).
2. Create a **GitHub OAuth App**:
   - **Authorization callback URL:** `https://qubrite-oauth.workers.dev/callback`
3. Set the proxy's `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` env vars.
4. In `public/admin/config.yml`:

```yaml
backend:
  name: github
  repo: bnz183/qubrite
  branch: main
  base_url: https://qubrite-oauth.workers.dev
```

---

## Create a post

1. Open `/admin` and log in with GitHub.
2. Click **Blog Posts** → **New Blog Post**.
3. Fill in all required fields:
   - **Title** — article headline
   - **Description** — short summary for cards, SEO, and RSS
   - **Publish Date** — UTC ISO timestamp (e.g. `2026-05-20T10:00:00Z`)
   - **Hero Image** — relative path: `../../assets/images/filename.jpg`
   - **Category** — select from the list
   - **Tags** — add one per entry
4. Leave **Draft** checked (`true`) while editing.
5. Write content in **Body** (Markdown).
6. Click **Publish** — Decap commits `src/content/blog/<slug>.mdx` to `main`.

---

## Draft vs publish

| `draft` | Behavior |
|---------|----------|
| `true` (default) | Hidden from homepage, categories, RSS, and all routes. |
| `false` | Visible and indexed like any published article. |

**Workflow:** keep Draft on while writing → set Draft off when ready → publish.

---

## How changes reach the live site

1. You save/publish from `/admin`.
2. Decap authenticates via GitHub (through the OAuth proxy) and commits the `.mdx` file to `bnz183/qubrite` on `main`.
3. Cloudflare Pages detects the push and runs `pnpm build`.
4. The live site is updated after the deploy finishes (usually under 1 minute).

---

## Hero images

**Store hero images in `src/assets/images/`.** Do not use `public/uploads/`.

- Existing posts use relative paths: `../../assets/images/filename.jpg`
- Astro's `content.config.ts` uses `heroImage: image()`, which resolves those relative paths
- Decap is configured with:
  - `media_folder: src/assets/images` — images uploaded via CMS are committed here
  - `public_folder: ../../assets/images` — path prefix written into frontmatter

The Hero Image field is a `string` widget. Type or paste the path manually. Upload support via the image widget would require changing to `public/uploads`, which would break the Astro image pipeline for existing posts.

---

## Files

| Path | Role |
|------|------|
| `public/admin/index.html` | Loads Decap CMS from CDN |
| `public/admin/config.yml` | Collection schema, backend, media paths |
| `src/content/blog/*.mdx` | Blog posts edited by the CMS |
| `src/assets/images/` | Hero and body images |
| `automation/cms-admin.md` | This document |

---

## What Decap does NOT change

- No database, no WordPress, no custom backend
- Existing MDX frontmatter fields and Astro routes are unchanged
- RSS, sitemap, Pagefind, category routing, and dark mode are unaffected
