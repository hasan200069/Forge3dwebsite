import { Link, useParams } from 'react-router-dom'
import { POSTS } from '../data.js'
import { Crumbs, Footer, CtaBand } from '../chrome.jsx'
import { Seo, SITE_URL, OG_IMAGE, orgRef, graph, breadcrumbLd } from '../seo.jsx'
import NotFound from './NotFound.jsx'

/* rough word count drives the schema's wordCount */
const wordsIn = (post) =>
  post.body.reduce((n, s) => n + s.p.split(/\s+/).length + (s.h ? s.h.split(/\s+/).length : 0), 0)

export default function BlogPost() {
  const { slug } = useParams()
  const post = POSTS.find((p) => p.slug === slug)
  /* an unknown slug is a missing page, not a redirect to the index —
     crawlers should see the 404 shell, not a soft redirect */
  if (!post) return <NotFound />

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
    <div className="page">
      <Seo
        title={`${post.title} | ForgeQubit`}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        type="article"
        publishedTime={post.iso}
        modifiedTime={post.iso}
        jsonLd={jsonLd}
      />
      <div className="shell narrow">
        <article className="post">
          <header className="post-header">
            <Crumbs trail={[{ label: 'Blog', to: '/blog' }, { label: post.title }]} />
            <div className="post-meta">
              <span className="post-tag">{post.tag}</span>
              <span><time dateTime={post.iso}>{post.date}</time> · {post.readTime}</span>
            </div>
            <h1>{post.title}</h1>
            <p className="lede">{post.excerpt}</p>
          </header>

          <div className="post-body">
            {post.body.map((s, i) => (
              <section key={i}>
                {s.h && <h2>{s.h}</h2>}
                <p>{s.p}</p>
              </section>
            ))}
          </div>

          {others.length > 0 && (
            <aside className="post-others" aria-labelledby="more-h">
              <p className="eyebrow" id="more-h">Keep reading</p>
              <div className="blog-list compact">
                {others.map((p) => (
                  <Link key={p.slug} to={`/blog/${p.slug}`} className="card post-card">
                    <div className="post-meta">
                      <span className="post-tag">{p.tag}</span>
                      <span>{p.date} · {p.readTime}</span>
                    </div>
                    <h3>{p.title}</h3>
                    <p>{p.excerpt}</p>
                    <span className="post-more">Read the note →</span>
                  </Link>
                ))}
              </div>
            </aside>
          )}
        </article>
      </div>

      <CtaBand title="Want this working for your team?" secondary={{ to: '/case-studies', label: 'See worked examples' }} />
      <Footer />
    </div>
  )
}
