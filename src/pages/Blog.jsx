import { Link } from 'react-router-dom'
import { POSTS } from '../data.js'
import { Crumbs, Footer, CtaBand } from '../chrome.jsx'
import { Seo, SITE_URL, OG_IMAGE, orgRef, graph, webPageLd, breadcrumbLd } from '../seo.jsx'

const TITLE = 'Blog: Notes on AI Reception, Automation & Products | ForgeQubit'
const DESC =
  'Practical writing on WhatsApp and voice agents, workflow automation and building AI products, for founders and operations teams rather than researchers.'

const JSON_LD = graph(
  webPageLd({ path: '/blog', title: TITLE, description: DESC, type: 'CollectionPage' }),
  breadcrumbLd([{ label: 'Blog', path: '/blog' }]),
  {
    '@type': 'Blog',
    '@id': `${SITE_URL}/blog#blog`,
    url: `${SITE_URL}/blog`,
    name: 'ForgeQubit blog',
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
  return (
    <div className="page">
      <Seo title={TITLE} description={DESC} path="/blog" jsonLd={JSON_LD} />
      <header className="shell page-hero">
        <Crumbs trail={[{ label: 'Blog', to: '/blog' }]} />
        <p className="eyebrow">Blog</p>
        <h1>Notes for <span className="em">operators.</span></h1>
        <p className="lede">
          What we are learning while building reception agents, automations and AI products,
          written for founders and operations teams rather than researchers.
        </p>
      </header>

      <section className="section tight" aria-label="Posts">
        <div className="shell blog-list">
          {POSTS.map((p) => (
            <Link key={p.slug} to={`/blog/${p.slug}`} className="card post-card">
              <div className="post-meta">
                <span className="post-tag">{p.tag}</span>
                <span>{p.date} · {p.readTime}</span>
              </div>
              <h2>{p.title}</h2>
              <p>{p.excerpt}</p>
              <span className="post-more">Read the note →</span>
            </Link>
          ))}
        </div>
      </section>

      <CtaBand title="Reading done? Talk it through." secondary={{ to: '/services', label: 'All solutions' }} />
      <Footer />
    </div>
  )
}
