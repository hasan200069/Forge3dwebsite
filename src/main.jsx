import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles.css'

const root = document.getElementById('root')

/* Every route is prerendered to real HTML, so the normal path is
   hydration — the markup is already on screen and React just adopts it.
   createRoot is the fallback for a URL that wasn't prerendered. */
if (root.firstElementChild) {
  hydrateRoot(root, <App />)
} else {
  createRoot(root).render(<App />)
}
