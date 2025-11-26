import { useCallback, useEffect, useState } from 'react'
import './App.css'
import { fetchHeadlines, fetchRandomHeadline } from './api'
import type { TransformedHeadline } from './types'

type CardVariant = 'hero' | 'secondary' | 'grid' | 'outrage'

const datelineFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})

const articleDateFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

function formatArticleDate(value?: string) {
  if (!value) return null
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return null
  return articleDateFormatter.format(parsed)
}

type ArticleCardProps = {
  headline: TransformedHeadline
  variant?: CardVariant
}

function ArticleCard({ headline, variant = 'grid' }: ArticleCardProps) {
  const summary = headline.original.summary || headline.original.description || 'Details remain sketchy.'
  const sourceLine = [headline.original.source, headline.original.category].filter(Boolean).join(' | ')
  const published = formatArticleDate(headline.original.publishedAt) || 'Today'

  return (
    <article className={`article-card ${variant}`}>
      <p className="kicker">{headline.original.source || 'Staff Wire'}</p>
      <h2>{headline.transformed}</h2>
      <p className="summary">{summary}</p>
      <p className="original">"{headline.original.title}"</p>
      <div className="meta">
        <span>
          {sourceLine && <>{sourceLine} &middot; </>}
          {published}
        </span>
        {headline.original.link && (
          <a href={headline.original.link} target="_blank" rel="noreferrer">
            Read original
          </a>
        )}
      </div>
    </article>
  )
}

function App() {
  const [headlines, setHeadlines] = useState<TransformedHeadline[]>([])
  const [dailyFeature, setDailyFeature] = useState<TransformedHeadline | null>(null)
  const [loadingHeadlines, setLoadingHeadlines] = useState(false)
  const [loadingOutrage, setLoadingOutrage] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadHeadlines = useCallback(async () => {
    setLoadingHeadlines(true)
    setError(null)

    try {
      const items = await fetchHeadlines(60, true)
      setHeadlines(items)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
    } finally {
      setLoadingHeadlines(false)
    }
  }, [])

  const loadDailyFeature = useCallback(async () => {
    setLoadingOutrage(true)
    try {
      const item = await fetchRandomHeadline()
      setDailyFeature(item)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to fetch headline'
      setError(message)
    } finally {
      setLoadingOutrage(false)
    }
  }, [])

  useEffect(() => {
    void loadHeadlines()
    void loadDailyFeature()
  }, [loadHeadlines, loadDailyFeature])

  const primary = headlines[0]
  const secondary = headlines.slice(1, 3)
  const gridHeadlines = headlines.slice(3)
  const ticker = headlines.slice(0, 6)

  const dateline = datelineFormatter.format(new Date())

  return (
    <div className="paper">
      <header className="masthead">
        <div>
          <p className="edition">Volume 1 · Issue 42</p>
          <h1>The Daily Blame</h1>
          <p className="motto">We report, mom retorts.</p>
        </div>
        <div className="dateline">{dateline}</div>
      </header>

      <nav className="section-nav">
        <span>World</span>
        <span>Science</span>
        <span>Society</span>
        <span>Economy</span>
        <span>Climate</span>
        <span>Opinion</span>
        <span>Letters</span>
      </nav>

      <div className="ticker">
        <span className="ticker-label">Breaking</span>
        <div className="ticker-items">
          {ticker.length > 0
            ? ticker.map((item) => (
                <span key={item.original.link ?? `${item.original.title}-${item.transformed}`}>{item.original.title}</span>
              ))
            : 'Gathering headlines...'}
        </div>
      </div>

      <div className="controls-row">
        <button onClick={loadHeadlines} disabled={loadingHeadlines}>
          {loadingHeadlines ? 'Refreshing headlines...' : 'Refresh headlines'}
        </button>
        <button onClick={loadDailyFeature} disabled={loadingOutrage}>
          {loadingOutrage ? 'Spinning outrage...' : 'New outrage'}
        </button>
      </div>

      {error && <div className="notice error">{error}</div>}
      {loadingHeadlines && !headlines.length && <div className="notice">Fetching headlines...</div>}

      <main className="layout">
        <section className="feature-grid">
          {primary ? <ArticleCard headline={primary} variant="hero" /> : <p className="placeholder">Headline press is warming up...</p>}

          <div className="feature-side">
            {secondary.map((story) => (
              <ArticleCard
                key={story.original.link ?? `${story.original.title}-${story.transformed}`}
                headline={story}
                variant="secondary"
              />
            ))}
          </div>
        </section>

        <section className="daily-outrage">
          <div className="section-header">
            <h3>Daily Outrage</h3>
            <p>One random catastrophe mom apparently caused.</p>
          </div>
          {dailyFeature ? (
            <ArticleCard headline={dailyFeature} variant="outrage" />
          ) : (
            <p className="placeholder">Summoning today&apos;s outrage...</p>
          )}
        </section>

        <section className="article-grid">
          {gridHeadlines.map((story) => (
            <ArticleCard
              key={story.original.link ?? `${story.original.title}-${story.transformed}`}
              headline={story}
              variant="grid"
            />
          ))}
        </section>
      </main>

      <footer className="footer">
        <p>Satire notice: real headlines, unreal accusations. We love all moms.</p>
      </footer>
    </div>
  )
}

export default App
