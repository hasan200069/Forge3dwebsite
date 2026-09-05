import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Component, Suspense, lazy, useEffect } from 'react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Analytics } from '@vercel/analytics/react'
import { Nav, Footer, useReveal } from './chrome.jsx'
import { SOLUTIONS } from './data.js'
import { startClickTracking } from './analytics.js'
import Home from './pages/Home.jsx'

/* ————————————————————————————————————————
   Pages other than Home load as separate chunks. The prerenderer passes
   the statically imported set (see entry-server.jsx) so every route is
   still rendered to real HTML; on the client, a route's chunk is fetched
   before hydration (see main.jsx) so the server markup never flashes.
   ———————————————————————————————————————— */
export const PAGE_LOADERS = {
  Services: () => import('./pages/Services.jsx'),
  ServicePage: () => import('./pages/ServicePage.jsx'),
  VoiceAgents: () => import('./pages/VoiceAgents.jsx'),
  About: () => import('./pages/About.jsx'),
  Work: () => import('./pages/Work.jsx'),
  Blog: () => import('./pages/Blog.jsx'),
  BlogPost: () => import('./pages/BlogPost.jsx'),
  Contact: () => import('./pages/Contact.jsx'),
  Legal: () => import('./pages/Legal.jsx'),
  NotFound: () => import('./pages/NotFound.jsx'),
}

/* Which loader a path needs — used by main.jsx to warm the chunk. */
export function loaderFor(pathname) {
  if (pathname === '/') return null
  if (pathname === '/services') return 'Services'
  if (pathname === '/services/voice-agents') return 'VoiceAgents'
  if (SOLUTIONS.some((s) => s.path === pathname)) return 'ServicePage'
  if (pathname === '/about') return 'About'
  if (pathname === '/case-studies') return 'Work'
  if (pathname === '/blog') return 'Blog'
  if (pathname.startsWith('/blog/')) return 'BlogPost'
  if (pathname === '/contact') return 'Contact'
  if (pathname === '/privacy' || pathname === '/terms') return 'Legal'
  return 'NotFound'
}

const lazyPages = Object.fromEntries(
  Object.entries(PAGE_LOADERS).map(([k, load]) => [
    k,
    k === 'Legal'
      ? { Privacy: lazy(() => load().then((m) => ({ default: m.Privacy }))), Terms: lazy(() => load().then((m) => ({ default: m.Terms }))) }
      : lazy(load),
  ])
)

/* Scroll to the top on route change, but honour in-page anchors so a
   link to /services#capabilities lands where it says. */
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView({ behavior: 'instant', block: 'start' })
        return
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])
  return null
}

/* Shown only during a client-side navigation while a chunk loads. It
   reserves height so the footer does not jump into view. */
function Loading() {
  return <div className="page" style={{ minHeight: '70vh' }} aria-busy="true" />
}

/* A rendering error on one page should not blank the whole site. */
class ErrorBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidUpdate(prev) {
    if (prev.location !== this.props.location && this.state.failed) this.setState({ failed: false })
  }
  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div className="page">
        <div className="shell nf">
          <p className="eyebrow">Something went wrong</p>
          <h1>This page could not be displayed.</h1>
          <p className="lede">
            Reloading usually fixes it. If it keeps happening, email us at{' '}
            <a href="mailto:info@forgequbit.com">info@forgequbit.com</a> and we will help directly.
          </p>
          <div className="btn-row">
            <a className="btn btn-primary" href={this.props.location}>Reload this page</a>
            <a className="btn btn-secondary" href="/">Go to the homepage</a>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}

function Boundary({ children }) {
  const { pathname } = useLocation()
  useReveal(pathname)
  return <ErrorBoundary location={pathname}>{children}</ErrorBoundary>
}

/* Router-agnostic so the prerenderer can wrap it in a StaticRouter and
   hand in statically imported pages. */
export function AppShell({ pages = lazyPages }) {
  const P = pages
  return (
    <div className="app">
      <a className="skip-link" href="#main">Skip to content</a>
      <Nav />
      <ScrollManager />
      <main id="main">
        <Boundary>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<P.Services />} />
              {SOLUTIONS.map((s) => (
                <Route key={s.slug} path={s.path} element={<P.ServicePage solution={s} />} />
              ))}
              <Route path="/services/voice-agents" element={<P.VoiceAgents />} />
              <Route path="/about" element={<P.About />} />
              <Route path="/case-studies" element={<P.Work />} />
              <Route path="/blog" element={<P.Blog />} />
              <Route path="/blog/:slug" element={<P.BlogPost />} />
              <Route path="/contact" element={<P.Contact />} />
              <Route path="/privacy" element={<P.Legal.Privacy />} />
              <Route path="/terms" element={<P.Legal.Terms />} />
              <Route path="*" element={<P.NotFound />} />
            </Routes>
          </Suspense>
        </Boundary>
      </main>
    </div>
  )
}

export default function App() {
  useEffect(startClickTracking, [])
  return (
    <BrowserRouter>
      <AppShell />
      <SpeedInsights />
      <Analytics />
    </BrowserRouter>
  )
}
