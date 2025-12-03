import { useEffect, useState } from 'react'
import './App.css'
import type { TransformedHeadline } from './types'

function App() {
  const [headlines, setHeadlines] = useState<TransformedHeadline[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  useEffect(() => {
    fetchHeadlines()
  }, [])

  const fetchHeadlines = async () => {
    setLoading(true)
    try {
      const response = await fetch('/headlines.json')
      if (!response.ok) {
        throw new Error('Failed to load headlines')
      }
      const data = await response.json()
      setHeadlines(data.headlines)
      setLastUpdated(data.generatedAt)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (isoString?: string) => {
    if (!isoString) return new Date().toLocaleDateString()
    return new Date(isoString).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading && headlines.length === 0) {
    return (
      <div className="paper">
        <div className="masthead">
          <h1>The Daily Blame</h1>
        </div>
        <div className="notice">Loading the latest news...</div>
      </div>
    )
  }

  const heroHeadline = headlines[0]
  const sideHeadlines = headlines.slice(1, 4)
  const otherHeadlines = headlines.slice(4)

  return (
    <div className="paper">
      <header>
        <div className="masthead">
          <div style={{ flex: 1 }}>
            <div className="edition">VOL. CLII No. 52,890</div>
            <div className="motto">"It's Always Her Fault"</div>
          </div>
          <h1>The Daily Blame</h1>
          <div style={{ flex: 1, textAlign: 'right' }}>
            <div className="dateline">{formatDate(lastUpdated || undefined)}</div>
            <div className="edition">Price: Your Dignity</div>
          </div>
        </div>

        <nav className="section-nav">
          <span>World</span>
          <span>Politics</span>
          <span>Business</span>
          <span>Opinion</span>
          <span>Science</span>
          <span>Arts</span>
          <span>Style</span>
          <span>Food</span>
        </nav>

        <div className="ticker">
          <div className="ticker-label">BREAKING NEWS:</div>
          <div className="ticker-items">
            {headlines.slice(0, 5).map((h, i) => (
              <span key={i}>{h.transformed} &nbsp;&nbsp; • &nbsp;&nbsp;</span>
            ))}
          </div>
        </div>
      </header>

      <main className="layout">
        {error && <div className="notice error">{error}</div>}

        <div className="controls-row">
          <button onClick={fetchHeadlines} disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh Edition'}
          </button>
        </div>

        {headlines.length > 0 && (
          <>
            <section className="feature-grid">
              {heroHeadline && (
                <article className="article-card hero">
                  <h2 className="headline-transformed">{heroHeadline.transformed}</h2>
                  <p className="kicker">EXCLUSIVE REPORT</p>
                  <p className="summary">{heroHeadline.original.summary || heroHeadline.original.description}</p>
                  <p className="original">
                    Original: {heroHeadline.original.title} ({heroHeadline.original.source})
                  </p>
                  <div className="meta">
                    <span>By Staff Writer</span>
                    {heroHeadline.original.link && (
                      <a href={heroHeadline.original.link} target="_blank" rel="noopener noreferrer">
                        Read Source
                      </a>
                    )}
                  </div>
                </article>
              )}

              <div className="feature-side">
                {sideHeadlines.map((h, i) => (
                  <article key={i} className="article-card secondary">
                    <h2>{h.transformed}</h2>
                    <p className="original">Original: {h.original.title}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="daily-outrage">
              <div className="section-header">
                <h3>More Reasons To Call Home</h3>
              </div>
              <div className="article-grid">
                {otherHeadlines.map((h, i) => (
                  <article key={i} className="article-card">
                    <p className="kicker">{h.original.category || 'News'}</p>
                    <h2>{h.transformed}</h2>
                    <p className="original">Original: {h.original.title}</p>
                    <div className="meta">
                      <span>{h.original.source}</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} The Daily Blame. All rights reserved. This is a satirical project.</p>
      </footer>
    </div>
  )
}

export default App
