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
        <div className="page-kicker rise">Lost in the Dark</div>
        <h1 className="nf-code rise d1 molten-text">404</h1>
        <p className="page-sub rise d2">
          This page never made it out of the forge. The road you want is back at the start.
        </p>
        <div className="finale-actions rise d3">
          <Link className="outro-cta hoverable" to="/">Return to the Forge <span>→</span></Link>
          <Link className="ghost-cta hoverable" to="/case-studies">See the Work <span>→</span></Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}
