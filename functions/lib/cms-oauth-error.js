/** HTML error page when CMS OAuth env vars are missing in Cloudflare Pages. */
export function cmsOAuthSetupError(missing) {
	const vars = missing.join(' and ')
	return new Response(
		`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>CMS OAuth not configured</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 42rem; margin: 2rem auto; padding: 0 1rem; line-height: 1.6; color: #1a1a1a; }
    h1 { font-size: 1.25rem; }
    code { background: #f4f4f5; padding: 0.1em 0.35em; border-radius: 3px; font-size: 0.9em; }
    ol { padding-left: 1.25rem; }
    li { margin: 0.5rem 0; }
    .note { color: #52525b; font-size: 0.9rem; margin-top: 1.5rem; }
  </style>
</head>
<body>
  <h1>Decap CMS: missing Cloudflare environment variable</h1>
  <p><strong>Missing:</strong> <code>${vars}</code></p>
  <p>Add these in the <strong>Cloudflare Pages</strong> project (not a separate Worker):</p>
  <ol>
    <li>Open <a href="https://dash.cloudflare.com/">Cloudflare dashboard</a> → <strong>Workers &amp; Pages</strong> → your <strong>qubrite</strong> Pages project.</li>
    <li><strong>Settings</strong> → <strong>Environment variables</strong>.</li>
    <li>Add <code>GITHUB_CLIENT_ID</code> (plain text) and <code>GITHUB_CLIENT_SECRET</code> (encrypt / secret).</li>
    <li>Enable both for <strong>Production</strong> and <strong>Preview</strong> if you use preview URLs.</li>
    <li><strong>Save</strong>, then trigger a new deploy (Deployments → Retry deployment, or push a commit).</li>
  </ol>
  <p>Create the GitHub OAuth App first: callback URL must be <code>https://qubrite.com/api/callback</code>.</p>
  <p class="note">Full steps: <code>automation/cms-admin.md</code> in the repo. Local editing does not need these vars — use <code>pnpm dev</code> and <code>pnpm cms:local</code>.</p>
</body>
</html>`,
		{
			status: 503,
			headers: { 'content-type': 'text/html;charset=UTF-8' },
		},
	)
}
