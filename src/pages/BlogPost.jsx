import { Link, useParams, Navigate } from 'react-router-dom'
import { POSTS } from '../data.js'
import { Crumbs, Footer, useReveal } from '../chrome.jsx'
import { Seo, SITE_URL, OG_IMAGE, orgRef, graph, breadcrumbLd } from '../seo.jsx'

/* rough word count drives the schema's wordCount — Google uses it as a
   depth signal on article pages */
const wordsIn = (post) =>
  post.body.reduce((n, s) => n + s.p.split(/\s+/).length + (s.h ? s.h.split(/\s+/).length : 0), 0)

export default function BlogPost() {
  const { slug } = useParams()
  const ref = useReveal()
  const post = POSTS.find((p) => p.slug === slug)
  if (!post) return <Navigate to="/blog" replace />

  const others = POSTS.filter((p) => p.slug !== slug).slice(0, 2)
  const url = `${SITE_URL}/blog/${post.slug}`

  const jsonLd = graph(
    {
      '@type': 'BlogPosting',
      '@id': `${url}#article`,
      headline: post.title,
      description: post.excerpt,
      datePublished: post.iso,
      dateModified: post.iso,
      url,
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      image: OG_IMAGE,
      author: orgRef,
      publisher: orgRef,
      isPartOf: { '@id': `${SITE_URL}/blog#blog` },
      inLanguage: 'en-GB',
      keywords: post.tag,
      articleSection: post.tag,
      wordCount: wordsIn(post),
    },
    breadcrumbLd([
      { label: 'Blog', path: '/blog' },
      { label: post.title, path: `/blog/${post.slug}` },
    ])
  )

  return (
    <div className="page" ref={ref}>
      <Seo
        title={`${post.title} | ForgeQubit`}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        type="article"
        publishedTime={post.iso}
        modifiedTime={post.iso}
        jsonLd={jsonLd}
      />
      <div className="page-inner narrow">
        <article className="post">
          <header className="post-header">
            <Crumbs
              trail={[
                { label: 'Blog', to: '/blog' },
                { label: post.title },
              ]}
            />
            <Link to="/blog" className="post-back">← All notes</Link>
            <div className="post-meta rise">
              <span className="post-tag">{post.tag}</span>
              <span className="post-date">
                <time dateTime={post.iso}>{post.date}</time> · {post.readTime}
              </span>
            </div>
            <h1 className="page-title rise d1">{post.title}</h1>
            <p className="post-lede rise d2">{post.excerpt}</p>
          </header>

          <div className="post-body">
            {post.body.map((s, i) => (
              <section key={i} className="reveal">
                {s.h && <h2>{s.h}</h2>}
                <p>{s.p}</p>
              </section>
            ))}
          </div>

          <div className="page-cta reveal">
            <h2>Want this working <span className="ember-text">for you?</span></h2>
            <div className="btn-row">
              <Link className="btn btn-primary" to="/contact">Start a Project <span>→</span></Link>
              <Link className="btn btn-ghost" to="/case-studies">See the Work <span>→</span></Link>
            </div>
          </div>

          {others.length > 0 && (
            <aside className="post-others reveal">
              <p className="page-kicker">Keep reading</p>
              <div className="blog-list compact">
                {others.map((p) => (
                  <Link key={p.slug} to={`/blog/${p.slug}`} className="card post-card">
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
            </aside>
          )}
        </article>
      </div>
      <Footer />
    </div>
  )
}
