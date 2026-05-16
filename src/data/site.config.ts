interface SiteConfig {
  site: string
  author: string
  title: string
  description: string
  lang: string
  ogLocale: string
  shareMessage: string
  paginationSize: number
}

export const siteConfig: SiteConfig = {
  site: 'https://tech-publication.pages.dev/',
  author: 'Editorial Desk',
  title: 'System Signal',
  description: 'A serious technical publication covering AI building, automation systems, cyber labs, privacy tech, hardware, and business systems.',
  lang: 'en-GB',
  ogLocale: 'en_GB',
  shareMessage: 'Share this post',
  paginationSize: 6
}
