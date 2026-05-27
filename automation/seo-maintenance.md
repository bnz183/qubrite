# SEO maintenance

Operational checklist after the technical SEO implementation. Code handles RSS filtering, sitemap exclusions, thin-tag `noindex`, IndexNow pings, and schema.

## After each deploy (automatic)

1. **Cloudflare Pages** builds `pnpm build`
2. **Pagefind** indexes `dist/` (`postbuild`)
3. **IndexNow** pings Bing/Yandex when `INDEXNOW_KEY` or `public/indexnow-key.txt` is set (`scripts/indexnow.mjs`)

## IndexNow setup (one-time)

1. Generate a key: 32-character hex string (e.g. `openssl rand -hex 16`)
2. Either:
   - Set `INDEXNOW_KEY` in Cloudflare Pages env, **or**
   - Replace `REPLACE_WITH_INDEXNOW_KEY` in `public/indexnow-key.txt` with the key (file must contain **only** the key)
3. Redeploy — key must be live at `https://qubrite.com/indexnow-key.txt`
4. Register the key in [Bing Webmaster Tools](https://www.bing.com/webmasters) → IndexNow

## Search Console (manual, quarterly)

| Task | Frequency |
| --- | --- |
| Confirm sitemap `https://qubrite.com/sitemap-index.xml` submitted | Once, then after major URL changes |
| Inspect new high-priority post URL | Per major publish (optional) |
| Review Coverage / Pages report for soft 404s, thin content | Quarterly |
| Check Core Web Vitals field data | Quarterly |

## Bing Webmaster

1. Add site at https://www.bing.com/webmasters
2. Verify via DNS or file
3. Submit same sitemap URL as GSC

## Quarterly hygiene

- [ ] Run Lighthouse (Performance + SEO) on homepage + one long post
- [ ] [Rich Results Test](https://search.google.com/test/rich-results) on homepage + one article
- [ ] Confirm `/rss.xml` has no draft posts
- [ ] Spot-check a thin tag (`< 3` posts) returns `noindex, follow`
- [ ] Review [`content-backlog.md`](./content-backlog.md) — ship one pillar, add internal links
- [ ] Optional: 2–3 quality backlinks (guest posts, directories, community citations)

## Authority (ongoing, not code)

Organic growth depends on corpus size (~30+ indexed URLs), backlinks, and consistent publishing. Use Decap CMS or MDX + [`publish-checklist.md`](./publish-checklist.md); structure is already in place.
