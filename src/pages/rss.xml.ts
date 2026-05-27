import rss from '@astrojs/rss'
import { siteConfig } from '@/site-config'
import { getPosts } from '@/utils'

export async function GET(context: { site: string }) {
	const posts = await getPosts()
	return rss({
		title: siteConfig.title,
		description: siteConfig.description,
		site: context.site,
		items: posts.map((post) => ({
			...post.data,
			link: `post/${post.id}/`,
		})),
	})
}
