import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Analytics } from '@vercel/analytics/react'
import { Nav, Cursor } from './chrome.jsx'
import Services from './pages/Services.jsx'
import About from './pages/About.jsx'
import CaseStudies from './pages/CaseStudies.jsx'
import Blog from './pages/Blog.jsx'
import BlogPost from './pages/BlogPost.jsx'
import Contact from './pages/Contact.jsx'
import { Privacy, Terms } from './pages/Legal.jsx'
import NotFound from './pages/NotFound.jsx'

/* Home carries three.js + postprocessing (~1 MB) — start fetching
   immediately so the chunk downloads while React boots. The 3D render
   loop is deferred via frameloop="demand" inside Home so it never
   blocks the main thread during the Lighthouse measurement window. */
const homeModule = import('./pages/Home.jsx')
const Home = lazy(() => homeModule)

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    document.querySelector('.page')?.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Nav />
        <div className="grain" />
        <Cursor />
        <ScrollToTop />
        <Routes>
          <Route
            path="/"
            element={
              <Suspense fallback={<div className="home" />}>
                <Home />
              </Suspense>
            }
          />
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
        <SpeedInsights />
        <Analytics />
      </div>
    </BrowserRouter>
  )
}
