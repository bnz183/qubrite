interface SiteConfig {
	site: string
	author: string
	title: string
	description: string
	lang: string
	ogLocale: string
	shareMessage: string
	paginationSize: number
	/** GA4 measurement ID — injected on every page via BaseLayout. */
	gaMeasurementId: string
}

export const siteConfig: SiteConfig = {
	site: 'https://qubrite.com/',
	gaMeasurementId: 'G-XX3Z7TZP3Y',
	author: 'QuBrite Editorial',
	title: 'QuBrite',
	description:
		'QuBrite is a premium technical publication covering AI web building, automation systems, cyber labs, privacy tech, hardware, and business systems.',
	lang: 'en-GB',
	ogLocale: 'en_GB',
	shareMessage: 'Share this post',
	paginationSize: 6
}
