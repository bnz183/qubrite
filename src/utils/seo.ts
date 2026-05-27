import { getPostByTag, getTags } from './post'

/** Minimum published posts before a tag page is indexed and listed in the sitemap. */
export const THIN_TAG_MIN_POSTS = 3

/** Tag slugs with fewer than THIN_TAG_MIN_POSTS published posts (sitemap + noindex). */
export async function getThinTagSlugs(): Promise<string[]> {
	const tags = await getTags()
	const thin: string[] = []
	for (const { slug } of tags) {
		const posts = await getPostByTag(slug)
		if (posts.length < THIN_TAG_MIN_POSTS) thin.push(slug)
	}
	return thin
}

export function isThinTag(slug: string, thinSlugs: string[]): boolean {
	return thinSlugs.includes(slug)
}
