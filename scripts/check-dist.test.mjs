/* Build integrity checks. Run after `npm run build`:

     node --test scripts/check-dist.test.mjs

   · every route the prerenderer declares exists as a real HTML file
   · every internal link and asset in the prerendered pages resolves to
     a prerendered route, a redirect, or a file in dist/
   · every page carries a unique title, description and canonical
   · the old forge/fire vocabulary is gone from public copy
   · the contact form's validation and interest resolution behave
   · redirects never point at a missing destination */

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(ROOT, 'dist')
const SITE = 'https://www.forgequbit.co.uk'

const routes = JSON.parse(readFileSync(join(DIST, 'routes.json'), 'utf8'))
const vercel = JSON.parse(readFileSync(join(ROOT, 'vercel.json'), 'utf8'))
const redirects = new Map(vercel.redirects.map((r) => [r.source, r.destination]))

const fileFor = (route) =>
  route === '/' ? join(DIST, 'index.html') : route === '/404' ? join(DIST, '404.html') : join(DIST, route.slice(1), 'index.html')

const pages = routes.map((r) => ({ route: r, html: readFileSync(fileFor(r), 'utf8') }))

function walk(dir, out = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f)
    statSync(p).isDirectory() ? walk(p, out) : out.push(p)
  }
  return out
}
const distFiles = new Set(walk(DIST).map((p) => '/' + p.slice(DIST.length + 1).replace(/\\/g, '/')))

const resolvable = (href) => {
  const path = href.split('#')[0].split('?')[0]
  if (path === '') return true
  if (routes.includes(path)) return true
  if (redirects.has(path)) return true
  if (distFiles.has(path)) return true
  return false
}

test('every declared route is prerendered', () => {
  for (const r of routes) assert.ok(existsSync(fileFor(r)), `${r} missing`)
  for (const must of ['/', '/services', '/services/ai-reception', '/services/workflow-automation', '/services/custom-ai-products', '/services/voice-agents', '/case-studies', '/about', '/contact', '/blog', '/privacy', '/terms', '/404'])
    assert.ok(routes.includes(must), `${must} not in routes`)
})

test('internal links and assets resolve', () => {
  const bad = []
  for (const { route, html } of pages) {
    const hrefs = [...html.matchAll(/\b(?:href|src)="([^"]+)"/g)].map((m) => m[1])
    for (const h of hrefs) {
      if (/^(https?:|mailto:|tel:|data:|#)/.test(h)) continue
      if (!resolvable(h)) bad.push(`${route} → ${h}`)
    }
  }
  assert.deepEqual(bad, [], `unresolved links:\n${bad.join('\n')}`)
})

test('no placeholder link destinations', () => {
  for (const { route, html } of pages) {
    assert.ok(!/href="#"/.test(html), `${route} has an href="#"`)
    assert.ok(!/href="javascript:/.test(html), `${route} has a javascript: link`)
  }
})

test('titles, descriptions and canonicals are present and unique', () => {
  const titles = new Map()
  for (const { route, html } of pages) {
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1]
    const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1]
    const canon = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1]
    assert.ok(title && title.length > 10, `${route} has no title`)
    assert.ok(desc && desc.length > 50, `${route} has no description`)
    assert.ok(desc.length <= 165, `${route} description too long for search snippets (${desc.length})`)
    const plainTitle = title.replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/&quot;/g, '"')
    assert.ok(plainTitle.length <= 70, `${route} title too long for search results (${plainTitle.length}: ${plainTitle})`)
    if (route !== '/404') assert.match(html, /<meta name="robots" content="index, follow, max-image-preview:large"/, `${route} robots`)
    assert.match(html, /<meta property="og:image" content="https:\/\/www\.forgequbit\.co\.uk\/og(-[a-z-]+)?\.png"/, `${route} og:image`)
    assert.match(html, /<link rel="alternate" hreflang="en"/, `${route} hreflang`)
    const expected = route === '/404' ? `${SITE}/404` : route === '/' ? `${SITE}/` : SITE + route
    assert.equal(canon, expected, `${route} canonical`)
    assert.ok(!titles.has(title), `duplicate title "${title}" on ${route} and ${titles.get(title)}`)
    titles.set(title, route)
    assert.ok(/<h1[\s>]/.test(html), `${route} has no h1`)
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, `${route} has more than one h1`)
  }
})

test('404 is noindex, other pages are indexable', () => {
  for (const { route, html } of pages) {
    const robots = html.match(/<meta name="robots" content="([^"]*)"/)?.[1]
    if (route === '/404') assert.match(robots, /noindex/)
    else assert.match(robots, /index, follow/)
  }
})

test('structured data is valid JSON', () => {
  for (const { route, html } of pages) {
    const m = html.match(/<script type="application\/ld\+json" id="route-jsonld">([\s\S]*?)<\/script>/)
    if (!m) continue
    assert.doesNotThrow(() => JSON.parse(m[1].replace(/\\u003c/g, '<')), `${route} json-ld`)
  }
})

test('sitemap lists every indexable route and nothing else', () => {
  const sm = readFileSync(join(DIST, 'sitemap.xml'), 'utf8')
  const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(SITE, '') || '/')
  const indexable = routes.filter((r) => r !== '/404')
  assert.deepEqual(locs.sort(), indexable.sort())
  assert.ok(existsSync(join(DIST, 'robots.txt')))
  assert.ok(existsSync(join(DIST, 'rss.xml')))
})

test('forge and fire vocabulary is gone from public copy', () => {
  const banned = /\b(forge[sd]?|forging|quench\w*|raw ore|weapon|chamber|revolutionary|cutting-edge)\b/i
  for (const { route, html } of pages) {
    const text = html
      .replace(/<script[\s\S]*?<\/script>/g, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/Forge\s*Qubit/gi, ' ')
      .replace(/ForgeQubit/gi, ' ')
      .replace(/forgequbit\.co\.uk/gi, ' ')
      .replace(/forgequbit\.com/gi, ' ')
    const hit = text.match(banned)
    assert.ok(!hit, `${route} still says "${hit?.[0]}"`)
  }
})

test('redirect destinations exist', () => {
  for (const [src, dest] of redirects) {
    assert.ok(resolvable(dest), `${src} → ${dest} does not resolve`)
    assert.ok(!routes.includes(src), `${src} is both a route and a redirect`)
  }
})

test('theme colour and brand assets are cyan', () => {
  const html = pages[0].html
  assert.match(html, /<meta name="theme-color" content="#061017"/)
  const fav = readFileSync(join(ROOT, 'public', 'favicon.svg'), 'utf8')
  assert.match(fav, /#22D3EE/i)
  assert.doesNotMatch(fav, /#F5811F|#E2560F/i)
  const css = readFileSync(join(ROOT, 'src', 'styles.css'), 'utf8')
  assert.doesNotMatch(css, /#e2560f|#f5811f|#ffa84a|#5c2e7a/i, 'old palette left in stylesheet')
})

test('contact form validation and interest resolution', async () => {
  const { validate, resolveInterest, interpretResponse } = await import(join(ROOT, 'src', 'contact-logic.js'))
  assert.deepEqual(Object.keys(validate({ name: '', email: '', message: '' })).sort(), ['email', 'message', 'name'])
  assert.ok(validate({ name: 'A', email: 'not-an-email', message: 'x'.repeat(20) }).email)
  assert.ok(validate({ name: 'A', email: 'a@b.co', message: 'short' }).message)
  assert.deepEqual(validate({ name: 'A', email: 'a@b.co', message: 'x'.repeat(20) }), {})
  assert.equal(resolveInterest('Voice Agents'), 'Voice Agent')
  assert.equal(resolveInterest('WhatsApp Automation'), 'AI Reception & Lead Handling')
  assert.equal(resolveInterest('AI-Powered SaaS'), 'Custom AI Product Development')
  assert.equal(resolveInterest('nonsense'), 'AI Reception & Lead Handling')
  assert.equal(resolveInterest(null), 'AI Reception & Lead Handling')
  // success is only ever reported when the backend says so
  assert.equal(interpretResponse(true, { success: true }), null)
  assert.ok(interpretResponse(true, { success: false, message: 'Invalid key' }))
  assert.ok(interpretResponse(false, null))
  assert.ok(interpretResponse(true, null))
})

test('contact page markup preserves preselection support and uses stable field ids', () => {
  const html = pages.find((p) => p.route === '/contact').html
  assert.match(html, /<select[^>]*name="interest"/)
  assert.match(html, /name="botcheck"/)
  // literal ids: identical before and after hydration, so error
  // messages, labels and focus() always target the rendered element
  for (const k of ['name', 'email', 'interest', 'message', 'budget', 'timeline']) {
    assert.match(html, new RegExp(`<label for="cf-${k}"`), `label for cf-${k}`)
    assert.match(html, new RegExp(`id="cf-${k}"`), `field cf-${k}`)
  }
  assert.doesNotMatch(html, /id="[^"]*:r[0-9a-z]+:/, 'useId-generated ids must not appear in the form')
  // the form precedes the process steps in source order (mobile order)
  assert.ok(html.indexOf('class="contact-form"') < html.indexOf('class="contact-steps"'))
  assert.match(html, /href="#cf-name"/, 'jump-to-form link')
})

test('no placeholder people or company details are published', () => {
  const about = pages.find((p) => p.route === '/about').html
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<[^>]+>/g, ' ')
  assert.doesNotMatch(about, /lorem|placeholder|John Doe|Jane Smith|TODO|TBC/i)
  assert.doesNotMatch(about, /class="person"/, 'team cards render only when TEAM has entries')
})

test('security headers and hosting config', () => {
  const all = vercel.headers.find((h) => h.source === '/(.*)').headers
  const get = (k) => all.find((h) => h.key === k)?.value
  const csp = get('Content-Security-Policy')
  assert.ok(csp, 'CSP missing')
  assert.match(csp, /default-src 'self'/)
  assert.match(csp, /script-src 'self' https:\/\/va\.vercel-scripts\.com/)
  assert.doesNotMatch(csp.match(/script-src[^;]*/)[0], /unsafe-inline|unsafe-eval/, 'scripts must not allow inline/eval')
  assert.match(csp, /connect-src[^;]*https:\/\/api\.web3forms\.com/, 'the contact form endpoint must be allowed')
  assert.match(csp, /frame-ancestors 'self'/)
  assert.ok(get('Strict-Transport-Security'))
  assert.ok(get('X-Content-Type-Options'))
  assert.equal(vercel.rewrites, undefined, 'no SPA rewrite: unknown paths must return 404.html with a 404 status')
  assert.ok(existsSync(join(DIST, '404.html')))
})

test('stylesheet is inlined and page HTML has no external render-blocking CSS', () => {
  for (const { route, html } of pages) {
    assert.doesNotMatch(html, /<link rel="stylesheet"/, `${route} still links a stylesheet`)
    assert.match(html, /<style>[\s\S]*--cyan: #22d3ee[\s\S]*<\/style>/, `${route} has no inline stylesheet`)
    assert.doesNotMatch(html, /<script[^>]*src="https?:\/\//, `${route} loads a third-party script in the shell`)
  }
})

test('pages are split into chunks and only the shell script is in the HTML', () => {
  const chunks = [...distFiles].filter((f) => f.startsWith('/assets/') && f.endsWith('.js'))
  assert.ok(chunks.length >= 8, `expected route chunks, found ${chunks.length}`)
  for (const { route, html } of pages) {
    const scripts = [...html.matchAll(/<script type="module"[^>]*src="([^"]+)"/g)].map((m) => m[1])
    assert.equal(scripts.length, 1, `${route} should reference one module script`)
  }
})

test('no personal data fields are referenced in analytics props', () => {
  const src = readFileSync(join(ROOT, 'src', 'pages', 'Contact.jsx'), 'utf8')
  const calls = [...src.matchAll(/track\(([^)]*)\)/g)].map((m) => m[1])
  assert.ok(calls.length >= 3)
  for (const c of calls) assert.doesNotMatch(c, /values\.(name|email|message)/, `analytics call sends personal data: ${c}`)
})


/* ———— serve dist/ the way Vercel does and crawl it ———— */

import { spawn } from 'node:child_process'

test('every route and every internal link responds correctly through the server', async () => {
  const port = 4300 + Math.floor(Math.random() * 300)
  const srv = spawn(process.execPath, [join(ROOT, 'scripts', 'serve-dist.mjs'), String(port)], { stdio: 'ignore' })
  const base = `http://localhost:${port}`
  try {
    // wait for the server
    for (let i = 0; i < 50; i++) {
      try { await fetch(base + '/'); break } catch { await new Promise((r) => setTimeout(r, 100)) }
    }
    const status = async (p) => (await fetch(base + p, { redirect: 'manual' })).status
    for (const r of routes) assert.equal(await status(r), r === '/404' ? 200 : 200, `route ${r}`)
    assert.equal(await status('/definitely-not-a-page'), 404)
    assert.equal(await status('/blog/not-a-post'), 404)
    for (const [src, dest] of redirects) {
      const res = await fetch(base + src, { redirect: 'manual' })
      assert.equal(res.status, 308, `redirect ${src}`)
      assert.equal(res.headers.get('location'), dest, `redirect target ${src}`)
    }
    // every href on every page
    const seen = new Set()
    for (const { html } of pages) {
      for (const m of html.matchAll(/\bhref="(\/[^"#?]*)/g)) seen.add(m[1])
    }
    for (const h of seen) assert.equal(await status(h), 200, `link ${h}`)
    // chunks referenced by the shell exist
    for (const { route, html } of pages) {
      for (const m of html.matchAll(/src="(\/assets\/[^"]+)"/g)) assert.equal(await status(m[1]), 200, `${route} asset ${m[1]}`)
    }
    const csp = (await fetch(base + '/about')).headers.get('content-security-policy')
    assert.ok(csp && csp.includes("default-src 'self'"), 'CSP header served')
  } finally {
    srv.kill()
  }
})


test('machine-readable layers for search and AI crawlers', () => {
  const robots = readFileSync(join(DIST, 'robots.txt'), 'utf8')
  for (const ua of ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'Bingbot']) assert.match(robots, new RegExp(`User-agent: ${ua}\\nAllow: /`), ua)
  assert.match(robots, /Sitemap: https:\/\/www\.forgequbit\.co\.uk\/sitemap\.xml/)
  const llms = readFileSync(join(DIST, 'llms.txt'), 'utf8')
  assert.match(llms, /^# ForgeQubit/)
  for (const r of routes.filter((x) => !['/404', '/privacy', '/terms'].includes(x))) assert.ok(llms.includes(SITE + (r === '/' ? '/' : r)), `llms.txt links ${r}`)
  const full = readFileSync(join(DIST, 'llms-full.txt'), 'utf8')
  assert.ok(full.length > 15000, 'llms-full.txt carries the site text')
  assert.match(full, /illustrative/i)
})

test('every page has its own social card and it exists', () => {
  const seen = new Map()
  for (const { route, html } of pages) {
    const img = html.match(/<meta property="og:image" content="([^"]+)"/)[1]
    const path = img.replace(SITE, '')
    assert.ok(distFiles.has(path), `${route} og image ${path} missing from dist`)
    if (!route.startsWith('/blog/') && !['/privacy', '/terms', '/404'].includes(route)) {
      assert.ok(!seen.has(img), `${route} shares a social card with ${seen.get(img)}`)
      seen.set(img, route)
    }
    assert.match(html, /<meta property="og:image:alt" content="[^"]{10,}"/, `${route} og:image:alt`)
  }
})

test('home page carries FAQ structured data and blog posts link to a solution', () => {
  const home = pages.find((p) => p.route === '/').html
  assert.match(home, /"@type":"FAQPage"/)
  for (const { route, html } of pages.filter((p) => p.route.startsWith('/blog/'))) {
    assert.match(html, /href="\/services\/[a-z-]+"/, `${route} links to a solution page`)
  }
})
