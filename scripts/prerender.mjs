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
import { POSTS, SOLUTIONS, VOICE, CAPABILITIES, PROCESS, FAQS, DEMOS } from '../src/data.js'

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
  html = setMeta(html, 'name', 'robots', route.noindex ? 'noindex, follow' : `${head.robots}, max-image-preview:large`)

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

/* Everyone may crawl, including the AI crawlers that feed answers in
   assistants and search. Listed explicitly so a future blanket rule
   cannot silently exclude them. */
const AI_CRAWLERS = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-User', 'Claude-SearchBot', 'anthropic-ai',
  'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Googlebot', 'Bingbot', 'Applebot', 'Applebot-Extended',
  'DuckAssistBot', 'CCBot', 'Amazonbot', 'meta-externalagent', 'cohere-ai', 'YouBot',
]
writeFileSync(
  join(DIST, 'robots.txt'),
  `User-agent: *\nAllow: /\nDisallow: /404\n\n` +
    AI_CRAWLERS.map((ua) => `User-agent: ${ua}\nAllow: /\n`).join('\n') +
    `\nSitemap: ${SITE}/sitemap.xml\n\n# Plain-text summaries for language models\n# ${SITE}/llms.txt\n# ${SITE}/llms-full.txt\n`
)

/* ———— llms.txt: a short, linkable summary for language models ———— */

const md = (s) => String(s).replace(/\s+/g, ' ').trim()

const llms =
  `# ForgeQubit\n\n` +
  `> ForgeQubit is a UK-registered, engineer-led studio that builds AI systems that answer customers and move work forward: voice and WhatsApp agents for reception and lead handling, workflow automation and integrations across business tools, and custom AI products. Clients are in the United Kingdom, Europe and the United States. Contact: info@forgequbit.com.\n\n` +
  `Every scenario, transcript and figure on the site is labelled illustrative; ForgeQubit publishes client results only with written permission, a baseline, a measurement period and a metric definition.\n\n` +
  `## Solutions\n\n` +
  SOLUTIONS.map((s) => `- [${s.name}](${SITE}${s.path}): ${md(s.short)}`).join('\n') +
  `\n- [${VOICE.name}](${SITE}${VOICE.path}): ${md(VOICE.short)}\n` +
  CAPABILITIES.map((c) => `- ${c.name} (specialist, ${SITE}/services#${c.id}): ${md(c.short)}`).join('\n') +
  `\n\n## How a project runs\n\n` +
  PROCESS.map((p) => `- ${p.t}: ${md(p.d)} Deliverable: ${md(p.out)}`).join('\n') +
  `\n\n## Pages\n\n` +
  `- [Home](${SITE}/)\n- [Solutions overview](${SITE}/services)\n- [Worked examples](${SITE}/case-studies)\n- [About](${SITE}/about)\n- [Contact](${SITE}/contact)\n- [Blog](${SITE}/blog)\n` +
  POSTS.map((p) => `- [${p.title}](${SITE}/blog/${p.slug}): ${md(p.excerpt)}`).join('\n') +
  `\n\n## Optional\n\n- [Privacy](${SITE}/privacy)\n- [Terms](${SITE}/terms)\n- [Full text](${SITE}/llms-full.txt)\n`

writeFileSync(join(DIST, 'llms.txt'), llms)

/* ———— llms-full.txt: the substantive content of every page in one file ———— */

const section = (title, body) => `\n\n## ${title}\n\n${body}`
const list = (items) => items.map((i) => `- ${md(i)}`).join('\n')

let full = `# ForgeQubit: full site text\n\nCanonical site: ${SITE}\nContact: info@forgequbit.com\nRegistered in the United Kingdom; works remotely with clients in the UK, Europe and the United States.\n\nAll examples, transcripts and figures below are illustrative unless explicitly stated otherwise.`

for (const s of SOLUTIONS) {
  full += section(`${s.name} (${SITE}${s.path})`,
    `${md(s.short)}\n\nProblem: ${md(s.problem)}\n\nWhat we build: ${md(s.build)}\n\nIntended outcome: ${md(s.outcome)}\n\n### Who it helps\n${list(s.who)}\n\n### Problems it addresses\n${list(s.problems)}\n\n### What the engagement includes\n${list(s.includes)}\n\n### Example (illustrative)\n${md(s.example.title)}\n` +
    (s.example.steps ? s.example.steps.map((t) => `- ${t.who}: ${md(t.text)}`).join('\n') : s.example.flow.map((n) => `- ${n.label} (${n.kind})`).join('\n')) +
    `\n${md(s.example.note)}\n\n### Supported integrations\n${list(s.integrations)}\n\n### Delivery and cost drivers\n${md(s.delivery.expectation)}\nCost drivers:\n${list(s.delivery.drivers)}\nOngoing costs: ${md(s.delivery.running)}\n\n### Ongoing support\n${md(s.support)}\n\n### Questions\n` +
    s.faqs.map((f) => `- Q: ${md(f.q)}\n  A: ${md(f.a)}`).join('\n'))
}
full += section(`${VOICE.name} (${SITE}${VOICE.path})`,
  `${md(VOICE.short)}\n\n### Who it helps\n${list(VOICE.who)}\n\n### What the agent handles\n${list(VOICE.handles)}\n\n### What it hands to a person\n${list(VOICE.handsOff)}\n\n### Integrations\n${list(VOICE.integrations)}\n\n### Questions\n` +
  VOICE.faqs.map((f) => `- Q: ${md(f.q)}\n  A: ${md(f.a)}`).join('\n'))
full += section('Specialist capabilities', CAPABILITIES.map((c) => `- ${c.name}: ${md(c.short)}`).join('\n'))
full += section('How a project runs', PROCESS.map((p) => `- ${p.t}: ${md(p.d)} You: ${md(p.you)} We: ${md(p.we)} Deliverable: ${md(p.out)}`).join('\n'))
full += section('Frequently asked questions', FAQS.map((f) => `- Q: ${md(f.q)}\n  A: ${md(f.a)}`).join('\n'))
full += section(`Worked examples, illustrative (${SITE}/case-studies)`, DEMOS.map((d) => `### ${d.title} (${d.field})\nContext: ${md(d.context)}\nScope:\n${list(d.scope)}\nHow it would be measured:\n${list(d.measures)}`).join('\n\n'))
for (const p of POSTS) {
  full += section(`Blog: ${p.title} (${SITE}/blog/${p.slug}, ${p.iso})`, `${md(p.excerpt)}\n\n` + p.body.map((b) => (b.h ? `### ${b.h}\n` : '') + md(b.p)).join('\n\n'))
}
writeFileSync(join(DIST, 'llms-full.txt'), full + '\n')

rmSync(SSR, { recursive: true, force: true })

writeFileSync(join(DIST, 'routes.json'), JSON.stringify(ROUTES.map((r) => r.path), null, 2))

console.log(`prerendered ${ROUTES.length} routes, ${POSTS.length} feed items`)
