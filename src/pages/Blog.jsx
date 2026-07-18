import { Link } from 'react-router-dom'
import { POSTS } from '../data.js'
import { Footer, useReveal } from '../chrome.jsx'

export default function Blog() {
  const ref = useReveal()
  return (
    <div className="page" ref={ref}>
      <div className="page-inner">
        <header className="page-hero">
          <div className="page-kicker rise">From the Forge</div>
          <h1 className="page-title rise d1">Notes in <span className="molten-text">the fire.</span></h1>
          <p className="page-sub rise d2">
            What we're learning while building agents that work through the night —
            written for founders and operators, not researchers.
          </p>
        </header>

        <div className="blog-list">
          {POSTS.map((p, i) => (
            <Link key={p.slug} to={`/blog/${p.slug}`} className={`post-card reveal d${(i % 3) + 1} hoverable`}>
              <div className="post-meta">
                <span className="post-tag">{p.tag}</span>
                <span className="post-date">{p.date} · {p.readTime}</span>
              </div>
              <h2 className="post-title">{p.title}</h2>
              <p className="post-excerpt">{p.excerpt}</p>
              <span className="post-more">Read the note <span>→</span></span>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}
