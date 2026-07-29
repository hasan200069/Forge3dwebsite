import { Link } from 'react-router-dom'
import { Footer } from '../chrome.jsx'
import { Seo } from '../seo.jsx'

export default function NotFound() {
  return (
    <div className="page">
      <Seo
        title="Page Not Found | ForgeQubit"
        description="This page never made it out of the forge."
        path="/404"
        robots="noindex, follow"
      />
      <div className="page-inner nf-inner">
        <p className="page-kicker rise">Lost in the Dark</p>
        <h1 className="nf-code rise d1 ember-text">404</h1>
        <p className="page-sub rise d2">
          This page never made it out of the forge. The road you want is back at the start.
        </p>
        <div className="btn-row rise d3">
          <Link className="btn btn-primary" to="/">Return to the Forge <span>→</span></Link>
          <Link className="btn btn-ghost" to="/services">Browse the Services <span>→</span></Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}
