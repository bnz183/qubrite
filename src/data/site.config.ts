interface SiteConfig {
	site: string
	/** Legacy byline / Organization name in footer. */
	author: string
	authorName: string
	authorUrl: string
	authorBio: string
	title: string
	description: string
	lang: string
	ogLocale: string
	shareMessage: string
	paginationSize: number
	/** GA4 measurement ID — injected on every page via BaseLayout. */
	gaMeasurementId: string
	/** Buttondown username for newsletter embed (PUBLIC_BUTTONDOWN_USERNAME). */
	buttondownUsername: string
}

export const siteConfig: SiteConfig = {
	site: 'https://qubrite.com/',
	gaMeasurementId: 'G-XX3Z7TZP3Y',
	author: 'QuBrite Editorial',
	authorName: 'QuBrite Editorial',
	authorUrl: 'https://qubrite.com/about/',
	authorBio: 'Operator-focused analysis. Reviewed and edited by the QuBrite desk.',
	title: 'QuBrite',
	description:
		'QuBrite is a premium technical publication covering AI web building, automation systems, cyber labs, privacy tech, hardware, and business systems.',
	lang: 'en-GB',
	ogLocale: 'en_GB',
	shareMessage: 'Share this post',
	paginationSize: 6,
	buttondownUsername: import.meta.env.PUBLIC_BUTTONDOWN_USERNAME ?? '',
}
