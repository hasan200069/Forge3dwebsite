import { Link, useParams, Navigate } from 'react-router-dom'
import { POSTS } from '../data.js'
import { Footer, useReveal } from '../chrome.jsx'
import { Seo, SITE_URL, SITE_NAME } from '../seo.jsx'

export default function BlogPost() {
  const { slug } = useParams()
  const ref = useReveal()
  const post = POSTS.find((p) => p.slug === slug)
  if (!post) return <Navigate to="/blog" replace />

  const others = POSTS.filter((p) => p.slug !== slug).slice(0, 2)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        datePublished: post.iso,
        dateModified: post.iso,
        url: `${SITE_URL}/blog/${post.slug}`,
        mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
        author: { '@id': `${SITE_URL}/#organization` },
        publisher: { '@id': `${SITE_URL}/#organization` },
        keywords: post.tag,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: SITE_NAME, item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
          { '@type': 'ListItem', position: 3, name: post.title },
        ],
      },
    ],
  }

  return (
    <div className="page" ref={ref}>
      <Seo
        title={`${post.title} | ForgeQubit`}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        type="article"
        jsonLd={jsonLd}
      />
      <div className="page-inner narrow">
        <article className="post">
          <header className="post-header">
            <Link to="/blog" className="post-back hoverable">← All notes</Link>
            <div className="post-meta rise">
              <span className="post-tag">{post.tag}</span>
              <span className="post-date">{post.date} · {post.readTime}</span>
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
            <h2>Want this working <span className="molten-text">for you?</span></h2>
            <Link className="outro-cta hoverable" to="/contact">Start a Project <span>→</span></Link>
          </div>

          {others.length > 0 && (
            <aside className="post-others reveal">
              <div className="page-kicker">Keep reading</div>
              <div className="blog-list compact">
                {others.map((p) => (
                  <Link key={p.slug} to={`/blog/${p.slug}`} className="post-card hoverable">
                    <div className="post-meta">
                      <span className="post-tag">{p.tag}</span>
                      <span className="post-date">{p.date} · {p.readTime}</span>
                    </div>
                    <h2 className="post-title">{p.title}</h2>
                    <span className="post-more">Read the note <span>→</span></span>
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
