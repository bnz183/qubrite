# QuBrite Decap CMS admin

Lightweight staff editing portal for blog posts. Decap CMS commits changes directly to GitHub; Cloudflare Pages rebuilds the static site on each push.

## Open the admin

**Production:** [https://qubrite.com/admin/](https://qubrite.com/admin/)

**Local (after `pnpm dev` or `pnpm preview`):** [http://localhost:4321/admin/](http://localhost:4321/admin/)

The UI loads from `public/admin/index.html` and reads `public/admin/config.yml`.

## Create a post

1. Sign in with GitHub when prompted (see [Auth setup](#auth-setup) below).
2. Open **Blog Posts** → **New Blog Post**.
3. Set **URL Slug** (filename stem, e.g. `my-new-article` → `/post/my-new-article/`).
4. Fill **Title**, **Description**, **Publish Date** (UTC ISO, e.g. `2026-05-17T09:20:00Z`), **Hero Image**, **Category**, and **Tags**.
5. Leave **Draft** checked (`true`) while you are still editing.
6. Write the article in **Body** (Markdown; same as MDX body content).
7. Click **Publish** (or **Save**) — Decap creates or updates `src/content/blog/<slug>.mdx` on the `main` branch.

## Draft vs publish

| `draft` value | Site behavior |
|---------------|---------------|
| `true` (default for new posts) | Hidden from homepage, categories, RSS, and post routes (`getPosts` filters drafts). |
| `false` | Built and listed like existing published articles. |

Workflow: keep **Draft** on while writing → set **Draft** off when ready → save/publish again.

## How changes reach GitHub

- **Backend:** `github` in `public/admin/config.yml` (`repo: bnz183/qubrite`, `branch: main`, `auth_type: pkce`).
- **Publish mode:** `simple` — saves commit directly to `main` (no editorial workflow PR queue).
- Each save creates a Git commit on GitHub with the updated `.mdx` file (and any uploaded images).

Update `repo` in `config.yml` if your GitHub remote is not `bnz183/qubrite`.

## How Cloudflare deploys

1. You publish from `/admin`.
2. Decap pushes a commit to GitHub `main`.
3. Cloudflare Pages (connected to the repo) runs `pnpm build` and deploys `dist/`.
4. After the deploy finishes, the live site reflects the change (draft posts still excluded until `draft: false`).

## Hero images and uploads

**Use `src/assets/images` (configured in Decap).** Do not use `public/uploads` for hero images.

- Existing posts reference heroes as `../../assets/images/filename.jpg` relative to each MDX file.
- Astro’s content schema uses `image()` and resolves those paths from `src/assets/images`.
- Decap is configured with:
  - `media_folder: src/assets/images`
  - `public_folder: ../../assets/images`

Uploaded heroes are committed under `src/assets/images/` and frontmatter keeps the same relative path shape as current articles. `public/uploads` would not match the Astro `heroImage` schema without changing every post and `content.config.ts`.

## Auth setup

Decap does **not** ship GitHub credentials in the repo. You must complete this once:

### 1. GitHub OAuth App (for PKCE)

1. GitHub → **Settings** → **Developer settings** → **OAuth Apps** → **New OAuth App**.
2. **Application name:** e.g. `QuBrite Decap CMS`
3. **Homepage URL:** `https://qubrite.com` (or your Pages URL)
4. **Authorization callback URL:** `https://qubrite.com/admin/`  
   For local testing, GitHub allows multiple callback URLs in some setups; otherwise use production URL only.
5. Create the app (no client secret required for PKCE in the browser flow Decap uses).

### 2. Repository access

- The GitHub account you use to log in must have **write** access to `bnz183/qubrite` (or whatever `repo` is set to in `config.yml`).

### 3. Cloudflare / admin route

- `/admin` is static HTML in `public/admin/` — no server required.
- Ensure Cloudflare Pages does not block `/admin` (default static hosting serves it).

### Optional: local backend

To edit against the filesystem without committing:

```bash
npx decap-server
```

Uncomment `local_backend: true` in `public/admin/config.yml` while developing, then comment it out again before production use.

## Files in this setup

| Path | Role |
|------|------|
| `public/admin/index.html` | Loads Decap CMS |
| `public/admin/config.yml` | Collection schema, GitHub backend, media paths |
| `src/content/blog/*.mdx` | Posts edited by the CMS |
| `src/assets/images/` | Hero and media uploads |

## What this does not change

- No database, no WordPress, no custom CMS UI beyond Decap.
- Existing MDX frontmatter fields and routes stay the same.
- RSS, sitemap, Pagefind, and category routing are unchanged (draft posts remain excluded until published).
