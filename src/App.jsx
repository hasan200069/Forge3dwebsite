import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Analytics } from '@vercel/analytics/react'
import { Nav, Cursor } from './chrome.jsx'
import { startInputTracking } from './input.js'
import Home from './pages/Home.jsx'
import Services from './pages/Services.jsx'
import About from './pages/About.jsx'
import CaseStudies from './pages/CaseStudies.jsx'
import Blog from './pages/Blog.jsx'
import BlogPost from './pages/BlogPost.jsx'
import Contact from './pages/Contact.jsx'
import { Privacy, Terms } from './pages/Legal.jsx'
import NotFound from './pages/NotFound.jsx'

/* Home is the entry page and the one that gets prerendered with real
   content, so it ships in the main bundle. three.js sits behind a
   dynamic import inside it and never blocks first paint. */

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    // 'instant' so a route change never animates the whole document
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

/* Router-agnostic so the prerenderer can wrap it in a StaticRouter. */
export function AppShell() {
  return (
    <div className="app">
      <a className="skip-link" href="#main">Skip to content</a>
      <Nav />
      <ScrollToTop />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <div className="vignette" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      {/* inside the shell so the prerendered markup and the hydrated
          tree agree — the element is inert until the effect claims it */}
      <Cursor />
    </div>
  )
}

export default function App() {
  useEffect(startInputTracking, [])
  return (
    <BrowserRouter>
      <AppShell />
      <SpeedInsights />
      <Analytics />
    </BrowserRouter>
  )
}
