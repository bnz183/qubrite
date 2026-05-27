/**
 * Build-time thin-tag detection for sitemap filtering.
 * Avoids importing astro:content from astro.config.mjs (not available there).
 */
import { readdirSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const blogDir = join(__dirname, '../src/content/blog')

/** Match src/utils/sluglify.ts */
function sluglify(text) {
	return text
		.toString()
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/&/g, '')
		.replace(/[^\w\-]+/g, '')
		.replace(/\-\-+/g, '-')
		.replace(/^-+/, '')
		.replace(/-+$/, '')
}

function parseTagsFromFrontmatter(fm) {
	const tags = []

	const inline = fm.match(/tags:\s*\[([^\]]+)\]/)
	if (inline) {
		for (const part of inline[1].split(',')) {
			const tag = part.trim().replace(/^['"]|['"]$/g, '')
			if (tag) tags.push(tag)
		}
		return tags
	}

	const block = fm.match(/tags:\s*\n((?:[ \t]+-\s+.+\n?)+)/)
	if (block) {
		for (const m of block[1].matchAll(/-\s+(.+)/g)) {
			const tag = m[1].trim().replace(/^['"]|['"]$/g, '')
			if (tag) tags.push(tag)
		}
	}

	return tags
}

function isDraft(fm) {
	return /^draft:\s*true\s*$/m.test(fm) || /\ndraft:\s*true\s*$/m.test(fm)
}

/** @param {number} minPosts */
export function getThinTagSlugsSync(minPosts = 3) {
	const counts = new Map()

	for (const file of readdirSync(blogDir)) {
		if (!/\.mdx?$/.test(file) || file.startsWith('_')) continue

		const raw = readFileSync(join(blogDir, file), 'utf8')
		const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
		if (!fmMatch) continue

		const fm = fmMatch[1]
		if (isDraft(fm)) continue

		for (const tag of parseTagsFromFrontmatter(fm)) {
			const slug = sluglify(tag)
			counts.set(slug, (counts.get(slug) ?? 0) + 1)
		}
	}

	return [...counts.entries()]
		.filter(([, count]) => count < minPosts)
		.map(([slug]) => slug)
}
