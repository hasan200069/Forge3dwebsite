import { Link } from 'react-router-dom'
import { EMAIL, Footer } from '../chrome.jsx'
import { Seo } from '../seo.jsx'

function LegalPage({ kicker, title, updated, children, seo }) {
  return (
    <div className="page">
      <Seo {...seo} />
      <div className="page-inner narrow">
        <header className="page-hero">
          <div className="page-kicker rise">{kicker}</div>
          <h1 className="page-title rise d1">{title}</h1>
          <p className="page-sub rise d2">Last updated: {updated}</p>
        </header>
        <div className="legal-body rise d3">{children}</div>
        <div className="page-cta">
          <Link className="ghost-cta hoverable" to="/">Back to the Forge <span>→</span></Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export function Privacy() {
  return (
    <LegalPage
      kicker="The Fine Print"
      title="Privacy Policy"
      updated="July 18, 2026"
      seo={{
        title: 'Privacy Policy | ForgeQubit',
        description: 'How ForgeQubit collects, uses and protects your information when you visit our site or contact us about a project.',
        path: '/privacy',
      }}
    >
      <h2>Who we are</h2>
      <p>
        ForgeQubit (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is an AI agency registered in the
        United Kingdom with Companies House, reachable at{' '}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. This policy explains what information we
        handle when you visit forgequbit.co.uk or get in touch with us. We handle personal
        data in accordance with UK GDPR and, for visitors in the European Union, EU GDPR.
      </p>

      <h2>What we collect</h2>
      <p>
        Our contact form composes an email in your own mail client — nothing is stored on
        our servers when you use it. If you email us, we receive the information you choose
        to send: typically your name, email address and a description of your project. We
        use it solely to respond to your enquiry and, if we work together, to deliver the
        engagement.
      </p>

      <h2>Cookies and analytics</h2>
      <p>
        This site does not set advertising cookies and does not sell or share personal data
        with third parties for marketing. Fonts are served by Google Fonts, which may log
        standard technical request data (such as your IP address) when your browser fetches
        them; see Google&rsquo;s privacy policy for details.
      </p>

      <h2>How long we keep information</h2>
      <p>
        Project correspondence is retained for as long as needed to serve the engagement and
        to meet legal or accounting obligations, after which it is deleted.
      </p>

      <h2>Your rights</h2>
      <p>
        Under UK and EU GDPR you may request a copy, correction or deletion of any personal
        information we hold about you at any time by writing to{' '}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. We respond within 30 days. UK visitors may
        also lodge a complaint with the ICO, and EU visitors with their local supervisory
        authority.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        If we change this policy we will update the date at the top of this page. Material
        changes will be highlighted on this page for 30 days.
      </p>
    </LegalPage>
  )
}

export function Terms() {
  return (
    <LegalPage
      kicker="The Fine Print"
      title="Terms of Service"
      updated="July 18, 2026"
      seo={{
        title: 'Terms of Service | ForgeQubit',
        description: 'The terms that govern use of the ForgeQubit website and engagement of our AI development services.',
        path: '/terms',
      }}
    >
      <h2>Use of this site</h2>
      <p>
        forgequbit.co.uk and its content are provided for general information about our
        services. ForgeQubit is registered in the United Kingdom, and these terms are
        governed by the laws of England and Wales. You may browse, link to and quote the site with attribution. You may not
        scrape it for resale, misrepresent its content as your own, or use it to build a
        competing dataset.
      </p>

      <h2>Engagements</h2>
      <p>
        Client work is governed by the individual proposal and services agreement signed for
        each engagement — including scope, fees, timelines and ownership. Where those terms
        and this page differ, the signed agreement wins.
      </p>

      <h2>Intellectual property</h2>
      <p>
        Deliverables created for a client are assigned to that client on full payment, as set
        out in the engagement agreement. The ForgeQubit name, wordmark and this site&rsquo;s
        design remain our property.
      </p>

      <h2>No warranties on informational content</h2>
      <p>
        Case-study figures reflect specific engagements and are not a promise of identical
        results. Blog content is provided in good faith but is not professional advice for
        your specific situation.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, we are not liable for indirect or
        consequential damages arising from use of this website. Liability within a client
        engagement is defined in that engagement&rsquo;s agreement.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
      </p>
    </LegalPage>
  )
}
