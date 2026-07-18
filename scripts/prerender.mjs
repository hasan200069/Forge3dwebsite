/* Post-build prerender: stamps a copy of dist/index.html for every route
   with that route's own title, description, canonical and social tags.
   Crawlers (and Search Console's URL inspection) then see unique,
   correct metadata on every URL with zero JavaScript — and deep links
   work on any static host because each route is a real file. */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { POSTS } from '../src/data.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const SITE = 'https://forgequbit.co.uk'

/* keep titles/descriptions in sync with the <Seo> tags in src/pages */
const ROUTES = [
  {
    path: '/services',
    title: 'AI Services — WhatsApp Automation, Voice Agents & AI SaaS | ForgeQubit',
    desc: 'Six crafts, one obsession: WhatsApp automation, voice agents, avatar agents, custom AI agents, AI-powered SaaS and AI × blockchain — designed, built and shipped by ForgeQubit.',
  },
  {
    path: '/case-studies',
    title: 'AI Case Studies — Measured Results | ForgeQubit',
    desc: 'Real numbers from real builds: 3.4× more qualified leads with WhatsApp automation, 82% of calls handled by a voice agent, an AI SaaS shipped in six weeks.',
  },
  {
    path: '/about',
    title: 'About ForgeQubit — The AI Agency That Ships Working Agents',
    desc: 'ForgeQubit is an AI agency built by engineers, not account managers. Learn how we forge WhatsApp agents, voice agents and AI products — weekly demos, fixed scope, measurable results.',
  },
  {
    path: '/blog',
    title: 'AI Agents Blog — Notes from the Forge | ForgeQubit',
    desc: 'Practical writing on WhatsApp automation, voice agents and shipping AI SaaS — for founders and operators, not researchers.',
  },
  ...POSTS.map((p) => ({
    path: `/blog/${p.slug}`,
    title: `${p.title} | ForgeQubit`,
    desc: p.excerpt,
    type: 'article',
  })),
  {
    path: '/contact',
    title: 'Contact ForgeQubit — Start Your AI Project',
    desc: 'Tell us the raw idea — WhatsApp automation, a voice agent, a custom AI build or a full SaaS. We reply within 24 hours with a fixed-scope plan.',
  },
  {
    path: '/privacy',
    title: 'Privacy Policy | ForgeQubit',
    desc: 'How ForgeQubit collects, uses and protects your information when you visit our site or contact us about a project.',
  },
  {
    path: '/terms',
    title: 'Terms of Service | ForgeQubit',
    desc: 'The terms that govern use of the ForgeQubit website and engagement of our AI development services.',
  },
  {
    path: '/404',
    file: '404.html',
    title: 'Page Not Found | ForgeQubit',
    desc: 'This page never made it out of the forge.',
    robots: 'noindex, follow',
  },
]

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')

const swapAttr = (html, re, value) => html.replace(re, (_, pre, post) => pre + value + post)

const template = readFileSync(join(dist, 'index.html'), 'utf8')

for (const r of ROUTES) {
  const url = SITE + r.path
  const title = esc(r.title)
  const desc = esc(r.desc)
  let html = template.replace(/<title>[\s\S]*?<\/title>/, () => `<title>${title}</title>`)
  html = swapAttr(html, /(<meta name="description" content=")[^"]*(")/, desc)
  html = swapAttr(html, /(<link rel="canonical" href=")[^"]*(")/, url)
  html = swapAttr(html, /(<link rel="alternate" hreflang="en" href=")[^"]*(")/, url)
  html = swapAttr(html, /(<link rel="alternate" hreflang="x-default" href=")[^"]*(")/, url)
  html = swapAttr(html, /(<meta property="og:title" content=")[^"]*(")/, title)
  html = swapAttr(html, /(<meta property="og:description" content=")[^"]*(")/, desc)
  html = swapAttr(html, /(<meta property="og:url" content=")[^"]*(")/, url)
  html = swapAttr(html, /(<meta name="twitter:title" content=")[^"]*(")/, title)
  html = swapAttr(html, /(<meta name="twitter:description" content=")[^"]*(")/, desc)
  if (r.type) html = swapAttr(html, /(<meta property="og:type" content=")[^"]*(")/, r.type)
  if (r.robots) html = swapAttr(html, /(<meta name="robots" content=")[^"]*(")/, r.robots)

  const out = r.file ? join(dist, r.file) : join(dist, r.path.slice(1), 'index.html')
  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, html)
}

console.log(`prerendered ${ROUTES.length} routes into dist/`)
