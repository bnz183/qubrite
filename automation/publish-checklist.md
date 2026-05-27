# Publish checklist

Use before merging `draft: false` to `main` (Decap CMS or direct MDX).

## Pre-publish

- [ ] **Title** ≤ 60 characters (SERP display)
- [ ] **Description** 150–160 characters, unique, no clickbait
- [ ] **Category** matches enum in `src/data/categories.ts`
- [ ] **Tags** 3–6 specific tags (avoid one-off thin tags unless cluster planned)
- [ ] **Hero image** real asset in `src/assets/images/`, path correct in frontmatter
- [ ] **pubDate** UTC ISO (`YYYY-MM-DDTHH:mm:ssZ`)
- [ ] **updatedDate** set only if materially revising an existing post
- [ ] **draft: false** only when ready for production
- [ ] **≥ 3 internal links** to related live posts (see [`content-backlog.md`](./content-backlog.md))
- [ ] External claims cite primary sources where load-bearing
- [ ] MDX components render (`KeyTakeaways`, `Callout`, etc.) — preview with `pnpm build`

## Post-publish

- [ ] Confirm post at `/post/{slug}/` after Cloudflare deploy
- [ ] Optional: GSC URL inspection for flagship pieces
- [ ] If new pillar topic: update internal links in older posts (backlog table)
- [ ] RSS reader spot-check (`/rss.xml`)

## Template

Copy [`automation/article-template.mdx`](./article-template.mdx) into `src/content/blog/{slug}.mdx` — do not commit the template itself to the blog folder.

## CMS authors

Decap admin: https://qubrite.com/admin/ — see [`cms-admin.md`](./cms-admin.md).
