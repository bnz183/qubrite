import { getCollection, type CollectionEntry } from 'astro:content'
import { CATEGORIES } from '@/data/categories'
import { sluglify } from './sluglify'

/** URL segment for `/post/[slug]/` (glob loader entries use `id`, not `slug`). */
export const getPostSlug = (post: Pick<CollectionEntry<'blog'>, 'id'>) => post.id

export const getCategories = async () => {
	const posts = await getCollection('blog')
	const categories = new Set(
		posts.filter((post) => !post.data.draft).map((post) => post.data.category)
	)
	return Array.from(categories).sort((a, b) =>
		CATEGORIES.indexOf(a) < CATEGORIES.indexOf(b) ? -1 : 1
	)
}

export const getPosts = async (max?: number) => {
	return (await getCollection('blog'))
		.filter((post) => !post.data.draft)
		.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
		.slice(0, max)
}

/**
 * Build the canonical tag taxonomy from published posts.
 * Each tag is keyed by its sluglified form so duplicates with different
 * capitalizations (e.g. "GrapheneOS" / "grapheneos") collapse to one entry.
 * The display label is the first-seen author casing.
 */
export const getTags = async (): Promise<Array<{ slug: string; label: string }>> => {
	const posts = await getCollection('blog')
	const map = new Map<string, string>()
	posts
		.filter((post) => !post.data.draft)
		.forEach((post) => {
			post.data.tags.forEach((tag) => {
				const trimmed = tag.trim()
				if (!trimmed) return
				const slug = sluglify(trimmed)
				if (!map.has(slug)) map.set(slug, trimmed)
			})
		})
	return Array.from(map.entries())
		.map(([slug, label]) => ({ slug, label }))
		.sort((a, b) => a.label.localeCompare(b.label))
}

export const getPostByTag = async (slug: string) => {
	const target = slug.toLowerCase()
	const posts = await getPosts()
	return posts
		.filter((post) => !post.data.draft)
		.filter((post) => post.data.tags.some((t) => sluglify(t) === target))
}

export const filterPostsByCategory = async (category: string) => {
	const posts = await getPosts()
	return posts
		.filter((post) => !post.data.draft)
		.filter((post) => post.data.category.toLowerCase() === category)
}
