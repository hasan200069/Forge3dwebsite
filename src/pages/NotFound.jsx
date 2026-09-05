import { Link } from 'react-router-dom'
import { Footer } from '../chrome.jsx'
import { Seo } from '../seo.jsx'

export default function NotFound() {
  return (
    <div className="page">
      <Seo
        title="Page Not Found | ForgeQubit"
        description="That page does not exist. Find our solutions, worked examples and contact details from the homepage."
        path="/404"
        robots="noindex, follow"
      />
      <div className="shell nf">
        <p className="eyebrow">Not found</p>
        <p className="nf-code" aria-hidden="true">404</p>
        <h1>That page does not exist.</h1>
        <p className="lede">
          The address may have changed. The solutions, worked examples and contact form are all
          one click away.
        </p>
        <div className="btn-row">
          <Link className="btn btn-primary" to="/">Go to the homepage</Link>
          <Link className="btn btn-secondary" to="/services">See our solutions</Link>
          <Link className="btn btn-secondary" to="/contact">Contact us</Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}
