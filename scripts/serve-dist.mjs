/* Serves dist/ the way Vercel would, using vercel.json as the source of
   truth: clean URLs, permanent redirects, response headers (including
   the Content-Security-Policy) and a real 404 status for unknown paths.

     node scripts/serve-dist.mjs [port]

   Used for Lighthouse runs and for checking that the CSP does not break
   analytics or the contact form. Not used in production. */

import { createServer } from 'node:http'
import { readFileSync, existsSync, statSync } from 'node:fs'
import { join, extname, dirname, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'
import { gzipSync } from 'node:zlib'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(ROOT, 'dist')
const PORT = Number(process.argv[2] || 4180)
const cfg = JSON.parse(readFileSync(join(ROOT, 'vercel.json'), 'utf8'))

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
}

/* vercel.json header sources are path-to-regexp patterns; the subset
   used here is "/prefix/(.*)" and "/(a|b|c)" style, which converts to a
   RegExp directly. */
const headerRules = cfg.headers.map((h) => ({
  re: new RegExp('^' + h.source.replace(/\(\.\*\)/g, '.*') + '$'),
  headers: h.headers,
}))

const redirects = new Map(cfg.redirects.map((r) => [r.source, { to: r.destination, status: r.permanent ? 308 : 307 }]))

function headersFor(path) {
  const out = {}
  for (const rule of headerRules) if (rule.re.test(path)) for (const h of rule.headers) out[h.key] = h.value
  return out
}

function resolve(path) {
  const clean = normalize(decodeURIComponent(path)).replace(/\\/g, '/')
  if (clean.includes('..')) return null
  const candidates = [
    join(DIST, clean),
    join(DIST, clean + '.html'),
    join(DIST, clean, 'index.html'),
  ]
  for (const c of candidates) if (existsSync(c) && statSync(c).isFile()) return c
  return null
}

createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`)
  let path = url.pathname

  const redirect = redirects.get(path)
  if (redirect) {
    res.writeHead(redirect.status, { Location: redirect.to })
    return res.end()
  }

  // trailingSlash: false
  if (path.length > 1 && path.endsWith('/')) {
    res.writeHead(308, { Location: path.slice(0, -1) + url.search })
    return res.end()
  }

  let file = resolve(path)
  let status = 200
  if (!file) {
    file = join(DIST, '404.html')
    status = 404
    path = '/404'
  }

  const type = TYPES[extname(file)] || 'application/octet-stream'
  const body = readFileSync(file)
  const gzip = /gzip/.test(req.headers['accept-encoding'] || '') && /text|javascript|json|svg|xml/.test(type)
  const headers = { 'Content-Type': type, ...headersFor(path) }
  if (gzip) headers['Content-Encoding'] = 'gzip'
  res.writeHead(status, headers)
  res.end(gzip ? gzipSync(body) : body)
}).listen(PORT, () => console.log(`serving dist/ at http://localhost:${PORT}`))
