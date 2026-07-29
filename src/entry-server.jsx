import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { AppShell } from './App.jsx'
import { collectedHead } from './seo.jsx'

/* Renders one route to static HTML plus whatever <Seo> declared for it.
   Used only by scripts/prerender.mjs at build time — there is no server
   at runtime, just files. */
export function render(url) {
  collectedHead.current = {}
  const html = renderToString(
    <StaticRouter location={url}>
      <AppShell />
    </StaticRouter>
  )
  return { html, head: collectedHead.current }
}
