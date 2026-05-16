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
  author: 'Qubrite Editorial',
  title: 'Qubrite',
  description: 'Technical reviews, guides, and analysis across AI, automation, security, privacy, software, hardware, and digital business.',
  lang: 'en-GB',
  ogLocale: 'en_GB',
  shareMessage: 'Share this post',
  paginationSize: 6
}
