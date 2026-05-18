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
  site: 'https://qubrite.com/',
  author: 'QuBrite Editorial',
  title: 'QuBrite',
  description: 'QuBrite is a premium technical publication covering AI web building, automation systems, cyber labs, privacy tech, hardware, and business systems.',
  lang: 'en-GB',
  ogLocale: 'en_GB',
  shareMessage: 'Share this post',
  paginationSize: 6
}
