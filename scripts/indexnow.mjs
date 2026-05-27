#!/usr/bin/env node
/**
 * Ping IndexNow after production builds.
 * Set INDEXNOW_KEY in env, or place the key in public/indexnow-key.txt (deployed to /indexnow-key.txt).
 */
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const distDir = resolve(root, 'dist')
const siteHost = 'qubrite.com'

function loadKey() {
	if (process.env.INDEXNOW_KEY?.trim()) return process.env.INDEXNOW_KEY.trim()
	const keyPath = resolve(root, 'public/indexnow-key.txt')
	if (!existsSync(keyPath)) return null
	const raw = readFileSync(keyPath, 'utf8').trim()
	if (!raw || raw.startsWith('#') || raw.includes('REPLACE')) return null
	return raw
}

function loadUrls() {
	const sitemapPath = resolve(distDir, 'sitemap-0.xml')
	if (!existsSync(sitemapPath)) {
		console.warn('[indexnow] dist/sitemap-0.xml not found — skipping')
		return []
	}
	const xml = readFileSync(sitemapPath, 'utf8')
	const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
	return urls.filter((u) => !u.includes('/admin'))
}

const key = loadKey()
if (!key) {
	console.log('[indexnow] No INDEXNOW_KEY — skipping (set env or public/indexnow-key.txt)')
	process.exit(0)
}

const urlList = loadUrls()
if (urlList.length === 0) {
	console.log('[indexnow] No URLs in sitemap — skipping')
	process.exit(0)
}

const keyLocation = `https://${siteHost}/indexnow-key.txt`
const body = {
	host: siteHost,
	key,
	keyLocation,
	urlList,
}

const res = await fetch('https://api.indexnow.org/indexnow', {
	method: 'POST',
	headers: { 'Content-Type': 'application/json; charset=utf-8' },
	body: JSON.stringify(body),
})

if (res.ok) {
	console.log(`[indexnow] Submitted ${urlList.length} URL(s) — HTTP ${res.status}`)
} else {
	const text = await res.text().catch(() => '')
	console.warn(`[indexnow] HTTP ${res.status}${text ? `: ${text}` : ''}`)
}
