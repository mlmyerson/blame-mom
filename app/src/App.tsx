import { useCallback, useEffect, useState } from 'react'
import './App.css'
import { fetchHeadlines, fetchRandomHeadline } from './api'
import HeadlineCard from './components/HeadlineCard'
import type { TransformedHeadline } from './types'

type ViewMode = 'random' | 'all'

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('random')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [randomHeadline, setRandomHeadline] = useState<TransformedHeadline | null>(null)
  const [allHeadlines, setAllHeadlines] = useState<TransformedHeadline[]>([])

  const actionLabel = viewMode === 'random' ? 'Generate New Headline' : 'Load All Headlines'

  const hasData = viewMode === 'random' ? Boolean(randomHeadline) : allHeadlines.length > 0

  const loadData = useCallback(async (mode: ViewMode) => {
    setLoading(true)
    setError(null)

    try {
      if (mode === 'random') {
        const headline = await fetchRandomHeadline()
        setRandomHeadline(headline)
      } else {
        const headlines = await fetchHeadlines(50, true)
        setAllHeadlines(headlines)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadData(viewMode)
  }, [loadData, viewMode])

  return (
    <div className="app">
      <header className="hero">
        <h1>Blame Mom</h1>
        <p className="tagline">Because everything is definitely your mother&apos;s fault!</p>
      </header>

      <section className="disclaimer">
        <strong>Satirical Content Warning</strong>
        <p>
          This site is 100% satirical. Real news headlines are transformed for comedic purposes only. We love all
          moms! Please don&apos;t take this seriously.
        </p>
      </section>

      <section className="view-mode">
        <button
          className={viewMode === 'random' ? 'toggle active' : 'toggle'}
          onClick={() => setViewMode('random')}
          disabled={loading && viewMode !== 'random'}
        >
          Random Headline
        </button>
        <button
          className={viewMode === 'all' ? 'toggle active' : 'toggle'}
          onClick={() => setViewMode('all')}
          disabled={loading && viewMode !== 'all'}
        >
          All Headlines
        </button>
      </section>

      <section className="controls">
        <button className="cta" onClick={() => loadData(viewMode)} disabled={loading}>
          {loading ? 'Loading...' : actionLabel}
        </button>
      </section>

      {error && <div className="banner error">{error}</div>}
      {loading && <div className="banner loading">Fetching headlines...</div>}

      {!loading && !error && (
        <section className="content">
          {viewMode === 'random' && randomHeadline && <HeadlineCard headline={randomHeadline} />}

          {viewMode === 'all' && allHeadlines.length > 0 && (
            <div className="headlines-list">
              {allHeadlines.map((headline) => (
                <HeadlineCard
                  key={headline.original.link ?? `${headline.original.title}-${headline.transformed}`}
                  headline={headline}
                />
              ))}
            </div>
          )}

          {!hasData && <p className="empty-state">No headlines available right now. Try again in a moment!</p>}
        </section>
      )}
    </div>
  )
}

export default App
