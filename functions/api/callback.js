/**
 * Decap CMS GitHub OAuth — exchange code for token and postMessage to /admin popup.
 * Deployed as a Cloudflare Pages Function at /api/callback
 */
import { cmsOAuthSetupError } from '../lib/cms-oauth-error.js'

function renderBody(status, content) {
	const html = `
<script>
const receiveMessage = (message) => {
	window.opener.postMessage(
		'authorization:github:${status}:' + JSON.stringify(content),
		message.origin
	);
	window.removeEventListener('message', receiveMessage, false);
};
window.addEventListener('message', receiveMessage, false);
window.opener.postMessage('authorizing:github', '*');
</script>`
	return new Blob([html], { type: 'text/html;charset=UTF-8' })
}

export async function onRequest(context) {
	const { request, env } = context
	const clientId = env.GITHUB_CLIENT_ID
	const clientSecret = env.GITHUB_CLIENT_SECRET

	if (!clientId || !clientSecret) {
		const missing = []
		if (!clientId) missing.push('GITHUB_CLIENT_ID')
		if (!clientSecret) missing.push('GITHUB_CLIENT_SECRET')
		return cmsOAuthSetupError(missing)
	}

	try {
		const url = new URL(request.url)
		const code = url.searchParams.get('code')
		if (!code) {
			return new Response('Missing authorization code.', { status: 400 })
		}

		const response = await fetch('https://github.com/login/oauth/access_token', {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
				accept: 'application/json',
				'user-agent': 'qubrite-decap-oauth',
			},
			body: JSON.stringify({
				client_id: clientId,
				client_secret: clientSecret,
				code,
			}),
		})

		const result = await response.json()
		if (result.error) {
			return new Response(renderBody('error', result), {
				headers: { 'content-type': 'text/html;charset=UTF-8' },
				status: 401,
			})
		}

		return new Response(
			renderBody('success', { token: result.access_token, provider: 'github' }),
			{
				headers: { 'content-type': 'text/html;charset=UTF-8' },
				status: 200,
			},
		)
	} catch (error) {
		console.error(error)
		return new Response(error.message, { status: 500 })
	}
}
