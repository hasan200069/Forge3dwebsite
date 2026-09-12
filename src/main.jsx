import { createRoot, hydrateRoot } from 'react-dom/client'
import App, { PAGE_LOADERS, loaderFor } from './App.jsx'
import './styles.css'
import './studio.css'

const root = document.getElementById('root')

/* Motion that hides anything is scoped to html.js in the stylesheet, so
   the prerendered page is complete for every visitor and the entrances
   only run where the script that finishes them is running too. */
document.documentElement.classList.add('js')

/* Every route is prerendered to real HTML. The page's own chunk is
   fetched before hydration so React adopts the markup in one pass
   instead of suspending on a lazy import; Home ships in the main
   bundle and needs nothing extra. */
async function start() {
  const key = loaderFor(window.location.pathname)
  if (key) {
    try {
      await PAGE_LOADERS[key]()
    } catch {
      /* the chunk will be retried by React's lazy() on render */
    }
  }
  if (root.firstElementChild) {
    hydrateRoot(root, <App />)
  } else {
    createRoot(root).render(<App />)
  }
  try { sessionStorage.removeItem('fq-chunk-reload') } catch { /* ignore */ }

  /* Warm every other page's chunk once the browser is idle, so a later
     navigation never waits on the network and never shows a loading
     gap. Together they are a few tens of kilobytes. */
  const warm = () => {
    for (const [k, load] of Object.entries(PAGE_LOADERS)) {
      if (k !== key) load().catch(() => {})
    }
  }
  if ('requestIdleCallback' in window) requestIdleCallback(warm, { timeout: 4000 })
  else setTimeout(warm, 1500)
}

start()
