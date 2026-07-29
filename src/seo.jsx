import { useEffect } from 'react'

export const SITE_URL = 'https://forgequbit.co.uk'
export const SITE_NAME = 'ForgeQubit'
export const OG_IMAGE = `${SITE_URL}/og.png`
export const ORG_ID = `${SITE_URL}/#organization`
export const EMAIL = 'info@forgequbit.com'

/* During prerendering there is no document to mutate, so <Seo> writes
   its props here instead and scripts/prerender.mjs stamps them into the
   HTML. One declaration per page serves both the crawler and the SPA. */
export const collectedHead = { current: null }

const abs = (path) => SITE_URL + (path === '/' ? '/' : path.replace(/\/$/, ''))

function upsertMeta(attr, key, content) {
  const sel = `meta[${attr}="${key}"]`
  let el = document.head.querySelector(sel)
  if (content == null) {
    el?.remove()
    return
  }
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel, href, extra) {
  const sel = extra
    ? `link[rel="${rel}"][${extra.name}="${extra.value}"]`
    : `link[rel="${rel}"]`
  let el = document.head.querySelector(sel)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    if (extra) el.setAttribute(extra.name, extra.value)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/* Per-route <head> manager. Updates the tags index.html ships with
   rather than duplicating them, so a crawler that executes JS sees the
   same title, description, canonical, OpenGraph and structured data as
   one that reads the prerendered file. */
export function Seo({
  title,
  description,
  path = '/',
  type = 'website',
  robots = 'index, follow',
  image = OG_IMAGE,
  imageAlt = 'ForgeQubit — AI agents that work while the world sleeps',
  publishedTime,
  modifiedTime,
  jsonLd = null,
}) {
  const url = abs(path)
  const ldString = jsonLd ? JSON.stringify(jsonLd) : null

  if (typeof window === 'undefined' && collectedHead.current) {
    Object.assign(collectedHead.current, {
      title,
      description,
      url,
      type,
      robots,
      image,
      imageAlt,
      publishedTime,
      modifiedTime,
      jsonLd: ldString,
    })
  }

  useEffect(() => {
    document.title = title
    upsertMeta('name', 'description', description)
    upsertMeta('name', 'robots', robots)

    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:type', type)
    upsertMeta('property', 'og:site_name', SITE_NAME)
    upsertMeta('property', 'og:locale', 'en_GB')
    upsertMeta('property', 'og:image', image)
    upsertMeta('property', 'og:image:alt', imageAlt)

    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', image)
    upsertMeta('name', 'twitter:image:alt', imageAlt)

    /* article timestamps only belong on articles — strip them when
       navigating from a post back to a normal page */
    upsertMeta('property', 'article:published_time', publishedTime ?? null)
    upsertMeta('property', 'article:modified_time', modifiedTime ?? null)

    upsertLink('canonical', url)
    upsertLink('alternate', url, { name: 'hreflang', value: 'en' })
    upsertLink('alternate', url, { name: 'hreflang', value: 'x-default' })

    let ld = document.getElementById('route-jsonld')
    if (ldString) {
      if (!ld) {
        ld = document.createElement('script')
        ld.type = 'application/ld+json'
        ld.id = 'route-jsonld'
        document.head.appendChild(ld)
      }
      ld.textContent = ldString
    } else if (ld) {
      ld.remove()
    }
  }, [title, description, url, type, robots, image, imageAlt, publishedTime, modifiedTime, ldString])

  return null
}

/* ———————————————————— structured data helpers ———————————————————— */

export const orgRef = { '@id': ORG_ID }

/* Google shows breadcrumbs in results for any page that declares them —
   cheap win on every non-home route. */
export function breadcrumbLd(trail) {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${abs(trail[trail.length - 1].path)}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      ...trail.map((t, i) => ({
        '@type': 'ListItem',
        position: i + 2,
        name: t.label,
        item: abs(t.path),
      })),
    ],
  }
}

export function webPageLd({ path, title, description, type = 'WebPage' }) {
  return {
    '@type': type,
    '@id': `${abs(path)}#webpage`,
    url: abs(path),
    name: title,
    description,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: orgRef,
    inLanguage: 'en-GB',
    primaryImageOfPage: { '@id': `${SITE_URL}/#logo` },
  }
}

export const graph = (...nodes) => ({
  '@context': 'https://schema.org',
  '@graph': nodes.filter(Boolean),
})
