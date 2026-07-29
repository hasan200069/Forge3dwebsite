import { Link } from 'react-router-dom'
import { POSTS } from '../data.js'
import { Crumbs, Footer, useReveal } from '../chrome.jsx'
import { Seo, SITE_URL, OG_IMAGE, orgRef, graph, webPageLd, breadcrumbLd } from '../seo.jsx'

const TITLE = 'AI Agents Blog — Notes from the Forge | ForgeQubit'
const DESC =
  'Practical writing on WhatsApp automation, voice agents and shipping AI SaaS — for founders and operators, not researchers.'

const JSON_LD = graph(
  webPageLd({ path: '/blog', title: TITLE, description: DESC, type: 'CollectionPage' }),
  breadcrumbLd([{ label: 'Blog', path: '/blog' }]),
  {
    '@type': 'Blog',
    '@id': `${SITE_URL}/blog#blog`,
    url: `${SITE_URL}/blog`,
    name: 'ForgeQubit — Notes from the Forge',
    description: DESC,
    inLanguage: 'en-GB',
    publisher: orgRef,
    blogPost: POSTS.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      description: p.excerpt,
      url: `${SITE_URL}/blog/${p.slug}`,
      datePublished: p.iso,
      dateModified: p.iso,
      image: OG_IMAGE,
      keywords: p.tag,
      author: orgRef,
      publisher: orgRef,
    })),
  }
)

export default function Blog() {
  const ref = useReveal()
  return (
    <div className="page" ref={ref}>
      <Seo title={TITLE} description={DESC} path="/blog" jsonLd={JSON_LD} />
      <div className="page-inner">
        <header className="page-hero">
          <Crumbs trail={[{ label: 'Blog', to: '/blog' }]} />
          <p className="page-kicker rise">From the Forge</p>
          <h1 className="page-title rise d1">Notes in <span className="ember-text">the fire.</span></h1>
          <p className="page-sub rise d2">
            What we’re learning while building agents that work through the night —
            written for founders and operators, not researchers.
          </p>
        </header>

        <div className="blog-list">
          {POSTS.map((p, i) => (
            <Link key={p.slug} to={`/blog/${p.slug}`} className={`card post-card reveal d${(i % 3) + 1}`}>
              <div className="post-meta">
                <span className="post-tag">{p.tag}</span>
                <span className="post-date">{p.date} · {p.readTime}</span>
              </div>
              <h2 className="post-title">{p.title}</h2>
              <p className="post-excerpt">{p.excerpt}</p>
              <span className="post-more">Read the note →</span>
            </Link>
          ))}
        </div>

        <div className="page-cta reveal">
          <h2>Done reading? <span className="ember-text">Start forging.</span></h2>
          <div className="btn-row">
            <Link className="btn btn-primary" to="/contact">Start a Project <span>→</span></Link>
            <Link className="btn btn-ghost" to="/services">Browse the Services <span>→</span></Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
