# Buttondown newsletter setup

QuBrite uses [Buttondown](https://buttondown.com/) for the weekly dispatch. Forms are wired in code; you only need an account and one env var.

## 1. Create account

1. Sign up at https://buttondown.com/
2. Choose your publication username (e.g. `qubrite`) — this becomes the embed URL segment.

## 2. Configure environment

| Variable | Where | Value |
| --- | --- | --- |
| `PUBLIC_BUTTONDOWN_USERNAME` | Local `.env` + Cloudflare Pages | Your Buttondown username (no `@`, no URL) |

```bash
cp .env.example .env
# Add: PUBLIC_BUTTONDOWN_USERNAME=your_username
```

Cloudflare: **Settings → Environment variables → Production** (and Preview if you test previews).

Redeploy after saving — Astro inlines `import.meta.env.PUBLIC_*` at build time.

## 3. Where forms appear

- Homepage sidebar: **Weekly Dispatch** (`src/pages/index.astro`)
- In-article CTA: `src/components/NewsletterInline.astro` (MDX `<Newsletter />`)

When `PUBLIC_BUTTONDOWN_USERNAME` is unset, both show an RSS fallback instead of a broken submit button.

## 4. Test subscribe

1. `pnpm build && pnpm preview`
2. Submit a test email on `/` and on any post with `<Newsletter />`
3. Confirm the subscriber appears in Buttondown → Subscribers
4. Send a test issue from Buttondown to verify deliverability (SPF/DKIM if using custom domain)

## 5. Honeypot

Forms include Buttondown’s `hp` honeypot field (hidden). Do not remove it — it reduces bot signups.

## Related docs

- [env-sync.md](./env-sync.md) — all Cloudflare env vars
- [publish-checklist.md](./publish-checklist.md) — pre-publish QA
