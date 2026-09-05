import { Link } from 'react-router-dom'
import { Crumbs, EMAIL, Footer } from '../chrome.jsx'
import { Seo, graph, webPageLd, breadcrumbLd } from '../seo.jsx'

function LegalPage({ title, updated, children, seo, crumb }) {
  return (
    <div className="page">
      <Seo
        {...seo}
        jsonLd={graph(
          webPageLd({ path: seo.path, title: seo.title, description: seo.description }),
          breadcrumbLd([{ label: crumb, path: seo.path }])
        )}
      />
      <div className="shell narrow">
        <header className="page-hero">
          <Crumbs trail={[{ label: crumb, to: seo.path }]} />
          <p className="eyebrow">Legal</p>
          <h1>{title}</h1>
          <p className="lede">Last updated: {updated}</p>
        </header>
        <div className="legal-body">{children}</div>
        <div className="btn-row" style={{ marginTop: 40 }}>
          <Link className="btn btn-secondary" to="/">Back to the homepage</Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export function Privacy() {
  return (
    <LegalPage
      crumb="Privacy"
      title="Privacy Policy"
      updated="5 September 2026"
      seo={{
        title: 'Privacy Policy | ForgeQubit',
        description: 'How ForgeQubit collects, uses and protects your information when you visit our site or contact us about a project.',
        path: '/privacy',
      }}
    >
      <h2>Who we are</h2>
      <p>
        ForgeQubit (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is an AI development studio registered in the
        United Kingdom, reachable at <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. This policy explains
        what information we handle when you visit forgequbit.co.uk or get in touch with us. We
        handle personal data in accordance with UK GDPR and, for visitors in the European Union,
        EU GDPR.
      </p>

      <h2>What we collect</h2>
      <p>
        When you submit our contact form, the name, email address, area of interest, description
        and any optional budget or timeline you enter are transmitted to our email inbox through
        Web3Forms, a form delivery service acting as our processor. We do not operate a database
        of enquiries; the submission reaches us as an email. If you email us directly, we receive
        whatever you choose to send. Either way we use it solely to respond to your enquiry and,
        if we work together, to deliver the engagement.
      </p>

      <h2>Cookies and analytics</h2>
      <p>
        This site sets no advertising cookies and does not sell or share personal data with third
        parties for marketing. We use Vercel Analytics and Speed Insights, which record
        aggregated, cookie-less page and performance measurements and do not identify individual
        visitors. Fonts and images are served from this domain, so loading a page makes no
        request to a third-party content network.
      </p>

      <h2>How long we keep information</h2>
      <p>
        Project correspondence is retained for as long as needed to serve the engagement and to
        meet legal or accounting obligations, after which it is deleted.
      </p>

      <h2>Your rights</h2>
      <p>
        Under UK and EU GDPR you may request a copy, correction or deletion of any personal
        information we hold about you at any time by writing to{' '}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. We respond within 30 days. UK visitors may also
        lodge a complaint with the ICO, and EU visitors with their local supervisory authority.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        If we change this policy we will update the date at the top of this page. Material changes
        will be highlighted on this page for 30 days.
      </p>
    </LegalPage>
  )
}

export function Terms() {
  return (
    <LegalPage
      crumb="Terms"
      title="Terms of Service"
      updated="5 September 2026"
      seo={{
        title: 'Terms of Service | ForgeQubit',
        description: 'The terms that govern use of the ForgeQubit website and engagement of our AI development services.',
        path: '/terms',
      }}
    >
      <h2>Use of this site</h2>
      <p>
        forgequbit.co.uk and its content are provided for general information about our services.
        ForgeQubit is registered in the United Kingdom, and these terms are governed by the laws of
        England and Wales. You may browse, link to and quote the site with attribution. You may not
        scrape it for resale, misrepresent its content as your own, or use it to build a competing
        dataset.
      </p>

      <h2>Engagements</h2>
      <p>
        Client work is governed by the individual proposal and services agreement signed for each
        engagement, including scope, fees, timelines and ownership. Where those terms and this
        page differ, the signed agreement wins.
      </p>

      <h2>Intellectual property</h2>
      <p>
        Deliverables created for a client are assigned to that client on full payment, as set out
        in the engagement agreement. Third-party software, models and services used within a
        deliverable remain subject to their own licences, which we identify in the proposal. The
        ForgeQubit name, mark and this site&rsquo;s design remain our property.
      </p>

      <h2>No warranties on informational content</h2>
      <p>
        Examples and scenarios on this site are illustrations of how projects are scoped and
        measured, not a promise of particular results. Blog content is provided in good faith but
        is not professional advice for your specific situation.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, we are not liable for indirect or consequential
        damages arising from use of this website. Liability within a client engagement is defined
        in that engagement&rsquo;s agreement.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
      </p>
    </LegalPage>
  )
}
