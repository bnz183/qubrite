/**
 * Decap CMS GitHub OAuth — start authorization.
 * Deployed as a Cloudflare Pages Function at /api/auth
 * @see https://decapcms.org/docs/backends-overview/
 * @see https://github.com/SubhenduX/decap-cms-cloudflare-pages
 */
import { cmsOAuthSetupError } from '../lib/cms-oauth-error.js'

export async function onRequest(context) {
	const { request, env } = context
	const clientId = env.GITHUB_CLIENT_ID

	if (!clientId) {
		return cmsOAuthSetupError(['GITHUB_CLIENT_ID'])
	}

	try {
		const url = new URL(request.url)
		const redirectUrl = new URL('https://github.com/login/oauth/authorize')
		redirectUrl.searchParams.set('client_id', clientId)
		redirectUrl.searchParams.set('redirect_uri', `${url.origin}/api/callback`)
		redirectUrl.searchParams.set('scope', 'repo user')
		redirectUrl.searchParams.set(
			'state',
			crypto.getRandomValues(new Uint8Array(12)).join(''),
		)
		return Response.redirect(redirectUrl.href, 302)
	} catch (error) {
		console.error(error)
		return new Response(error.message, { status: 500 })
	}
}
