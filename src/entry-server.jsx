import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { AppShell } from './App.jsx'
import { collectedHead } from './seo.jsx'
import Services from './pages/Services.jsx'
import ServicePage from './pages/ServicePage.jsx'
import VoiceAgents from './pages/VoiceAgents.jsx'
import About from './pages/About.jsx'
import Work from './pages/Work.jsx'
import Blog from './pages/Blog.jsx'
import BlogPost from './pages/BlogPost.jsx'
import Contact from './pages/Contact.jsx'
import { Privacy, Terms } from './pages/Legal.jsx'
import NotFound from './pages/NotFound.jsx'

/* Static imports here, lazy ones on the client: the prerenderer renders
   every page to complete HTML while the browser only downloads the
   chunk for the route it is on. */
const PAGES = {
  Services,
  ServicePage,
  VoiceAgents,
  About,
  Work,
  Blog,
  BlogPost,
  Contact,
  Legal: { Privacy, Terms },
  NotFound,
}

/* Renders one route to static HTML plus whatever <Seo> declared for it.
   Used only by scripts/prerender.mjs at build time — there is no server
   at runtime, just files. */
export function render(url) {
  collectedHead.current = {}
  const html = renderToString(
    <StaticRouter location={url}>
      <AppShell pages={PAGES} />
    </StaticRouter>
  )
  return { html, head: collectedHead.current }
}
