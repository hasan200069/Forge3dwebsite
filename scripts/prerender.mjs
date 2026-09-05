/* Post-build prerender.

   Renders every route with react-dom/server and writes it as a real
   HTML file, so a crawler that runs no JavaScript still sees the full
   page — headings, copy, links and structured data. The client then
   hydrates that markup rather than rebuilding it.

   The <head> for each route comes from the page's own <Seo> element
   (collected during the render), so titles and descriptions can't drift
   out of sync with a table kept here. Sitemap and RSS are generated
   from the same content module. */

import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { POSTS, SOLUTIONS, VOICE } from '../src/data.js'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(ROOT, 'dist')
const SSR = join(ROOT, '.ssr')
const SITE = 'https://www.forgequbit.co.uk'

const { render } = await import(pathToFileURL(join(SSR, 'entry-server.js')).href)

/* Routes to emit as files. Everything else falls back to the SPA shell
   via the host rewrite. */
const ROUTES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/services', changefreq: 'monthly', priority: '0.9' },
  ...SOLUTIONS.map((s) => ({ path: s.path, changefreq: 'monthly', priority: '0.9' })),
  { path: VOICE.path, changefreq: 'monthly', priority: '0.8' },
  { path: '/case-studies', changefreq: 'monthly', priority: '0.8' },
  { path: '/blog', changefreq: 'weekly', priority: '0.8' },
  ...POSTS.map((p) => ({ path: `/blog/${p.slug}`, lastmod: p.iso, changefreq: 'yearly', priority: '0.7' })),
  { path: '/about', changefreq: 'monthly', priority: '0.7' },
  { path: '/contact', changefreq: 'yearly', priority: '0.8' },
  { path: '/privacy', changefreq: 'yearly', priority: '0.3' },
  { path: '/terms', changefreq: 'yearly', priority: '0.3' },
  { path: '/404', file: '404.html', noindex: true },
]

const BUILD_DATE = new Date().toISOString().slice(0, 10)

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

let template = readFileSync(join(DIST, 'index.html'), 'utf8')

/* Inline the stylesheet. It is ~7 kB gzipped, and a <link> costs a full
   round trip before anything can paint; with every page prerendered the
   first paint then depends on the HTML alone. Client-side navigations
   never refetch CSS, so nothing is lost. */
template = template.replace(
  /<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/,
  (_, href) => `<style>${readFileSync(join(DIST, href), 'utf8').replace(/<\/style/g, '<\\/style')}</style>`
)

/* Replace an attribute value in place, or append the whole tag if the
   template doesn't carry it yet. */
function setMeta(html, attr, key, value) {
  const re = new RegExp(`(<meta ${attr}="${key}" content=")[^"]*(")`)
  if (re.test(html)) return html.replace(re, (_, a, b) => a + esc(value) + b)
  return html.replace('</head>', `  <meta ${attr}="${key}" content="${esc(value)}" />\n  </head>`)
}

function dropMeta(html, attr, key) {
  return html.replace(new RegExp(`\\s*<meta ${attr}="${key}" content="[^"]*"\\s*/?>`), '')
}

function setLink(html, re, value) {
  return html.replace(re, (_, a, b) => a + esc(value) + b)
}

for (const route of ROUTES) {
  const url = route.path === '/404' ? `${SITE}/404` : SITE + route.path
  const { html: body, head } = render(route.path)

  if (!head.title) throw new Error(`no <Seo> rendered for ${route.path}`)

  let html = template

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(head.title)}</title>`)
  html = setMeta(html, 'name', 'description', head.description)
  html = setMeta(html, 'name', 'robots', route.noindex ? 'noindex, follow' : head.robots)

  html = setMeta(html, 'property', 'og:title', head.title)
  html = setMeta(html, 'property', 'og:description', head.description)
  html = setMeta(html, 'property', 'og:url', url)
  html = setMeta(html, 'property', 'og:type', head.type)
  html = setMeta(html, 'property', 'og:image', head.image)
  html = setMeta(html, 'property', 'og:image:alt', head.imageAlt)
  html = setMeta(html, 'name', 'twitter:title', head.title)
  html = setMeta(html, 'name', 'twitter:description', head.description)
  html = setMeta(html, 'name', 'twitter:image', head.image)

  if (head.publishedTime) {
    html = setMeta(html, 'property', 'article:published_time', head.publishedTime)
    html = setMeta(html, 'property', 'article:modified_time', head.modifiedTime ?? head.publishedTime)
  } else {
    html = dropMeta(html, 'property', 'article:published_time')
    html = dropMeta(html, 'property', 'article:modified_time')
  }

  html = setLink(html, /(<link rel="canonical" href=")[^"]*(")/, url)
  html = setLink(html, /(<link rel="alternate" hreflang="en" href=")[^"]*(")/, url)
  html = setLink(html, /(<link rel="alternate" hreflang="x-default" href=")[^"]*(")/, url)

  if (head.jsonLd) {
    html = html.replace(
      '</head>',
      `  <script type="application/ld+json" id="route-jsonld">${head.jsonLd.replace(/</g, '\\u003c')}</script>\n  </head>`
    )
  }

  html = html.replace('<div id="root"></div>', `<div id="root">${body}</div>`)

  // '/' slices to '', so join lands back on dist/index.html — which is
  // what we want: the shell is replaced by the rendered home page
  const out = route.file ? join(DIST, route.file) : join(DIST, route.path.slice(1), 'index.html')
  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, html)
}

/* ———— sitemap ———— */

const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  ROUTES.filter((r) => !r.noindex)
    .map(
      (r) =>
        `  <url><loc>${SITE}${r.path === '/' ? '/' : r.path}</loc>` +
        `<lastmod>${r.lastmod ?? BUILD_DATE}</lastmod>` +
        `<changefreq>${r.changefreq}</changefreq>` +
        `<priority>${r.priority}</priority></url>`
    )
    .join('\n') +
  `\n</urlset>\n`

writeFileSync(join(DIST, 'sitemap.xml'), sitemap)

/* ———— rss ———— */

const rfc822 = (iso) => new Date(`${iso}T09:00:00Z`).toUTCString()

const rss =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n` +
  `<channel>\n` +
  `  <title>ForgeQubit blog</title>\n` +
  `  <link>${SITE}/blog</link>\n` +
  `  <description>Practical writing on AI reception, workflow automation and building AI products.</description>\n` +
  `  <language>en-gb</language>\n` +
  `  <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />\n` +
  POSTS.map(
    (p) =>
      `  <item>\n` +
      `    <title>${esc(p.title)}</title>\n` +
      `    <link>${SITE}/blog/${p.slug}</link>\n` +
      `    <guid isPermaLink="true">${SITE}/blog/${p.slug}</guid>\n` +
      `    <pubDate>${rfc822(p.iso)}</pubDate>\n` +
      `    <category>${esc(p.tag)}</category>\n` +
      `    <description>${esc(p.excerpt)}</description>\n` +
      `  </item>`
  ).join('\n') +
  `\n</channel>\n</rss>\n`

writeFileSync(join(DIST, 'rss.xml'), rss)

/* ———— robots ———— */

writeFileSync(
  join(DIST, 'robots.txt'),
  `User-agent: *\nAllow: /\n\n# no crawlable content behind these\nDisallow: /404\n\nSitemap: ${SITE}/sitemap.xml\n`
)

rmSync(SSR, { recursive: true, force: true })

writeFileSync(join(DIST, 'routes.json'), JSON.stringify(ROUTES.map((r) => r.path), null, 2))

console.log(`prerendered ${ROUTES.length} routes, ${POSTS.length} feed items`)
