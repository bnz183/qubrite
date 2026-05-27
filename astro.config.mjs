import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import tailwind from '@astrojs/tailwind'
import sitemap from '@astrojs/sitemap'
import { remarkReadingTime } from './src/utils/readTime.ts'
import { siteConfig } from './src/data/site.config'
import { getThinTagSlugsSync } from './scripts/thin-tags.mjs'

const thinTagSlugs = getThinTagSlugsSync()

/** @param {string} page Full page URL from @astrojs/sitemap */
function isThinTagPage(page) {
	return thinTagSlugs.some(
		(slug) => page.includes(`/tags/${slug}/`) || page.endsWith(`/tags/${slug}`),
	)
}

// https://astro.build/config
export default defineConfig({
	site: siteConfig.site,
	markdown: {
		remarkPlugins: [remarkReadingTime],
		drafts: true,
		shikiConfig: {
			theme: 'material-theme-palenight',
			wrap: true,
		},
	},
	integrations: [
		mdx({
			syntaxHighlight: 'shiki',
			shikiConfig: {
				experimentalThemes: {
					light: 'vitesse-light',
					dark: 'material-theme-palenight',
				},
				wrap: true,
			},
			drafts: true,
		}),
		tailwind(),
		sitemap({
			filter: (page) => {
				if (page.includes('/admin')) return false
				if (isThinTagPage(page)) return false
				return true
			},
		}),
	],
	vite: {
		build: {
			sourcemap: false,
		},
	},
})
