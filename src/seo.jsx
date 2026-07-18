import { useEffect } from 'react'

export const SITE_URL = 'https://forgequbit.com'
export const SITE_NAME = 'ForgeQubit'

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/* Per-route <head> manager. Updates the tags index.html ships with
   (never duplicates them), so crawlers that execute JS — Googlebot
   included — see route-specific titles, descriptions, canonicals,
   OpenGraph data and structured data. */
export function Seo({ title, description, path = '/', type = 'website', robots = 'index, follow', jsonLd = null }) {
  const ldString = jsonLd ? JSON.stringify(jsonLd) : null
  useEffect(() => {
    const url = SITE_URL + path
    document.title = title
    setMeta('name', 'description', description)
    setMeta('name', 'robots', robots)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:type', type)
    setMeta('property', 'og:site_name', SITE_NAME)
    setMeta('name', 'twitter:card', 'summary')
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)

    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', url)

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
  }, [title, description, path, type, robots, ldString])
  return null
}
