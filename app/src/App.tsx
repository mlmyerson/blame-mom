import { useCallback, useEffect, useState } from 'react'
import './App.css'
import { fetchHeadlines, fetchRandomHeadline } from './api'
import type { TransformedHeadline } from './types'

type ViewMode = 'random' | 'all'

function formatHeadlineText(headline: TransformedHeadline) {
  const lines = [`ORIGINAL: ${headline.original.title}`]

  if (headline.original.summary || headline.original.description) {
    lines.push(`SUMMARY: ${headline.original.summary || headline.original.description}`)
  }

  lines.push(`BLAME MOM: ${headline.transformed}`)

  if (headline.original.source) {
    lines.push(`SOURCE: ${headline.original.source}${headline.original.link ? ` (${headline.original.link})` : ''}`)
  } else if (headline.original.link) {
    lines.push(`SOURCE: ${headline.original.link}`)
  }

  return lines.join('\n')
}

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
          {viewMode === 'random' && randomHeadline && (
            <pre className="text-block">{formatHeadlineText(randomHeadline)}</pre>
          )}

          {viewMode === 'all' && allHeadlines.length > 0 && (
            <div className="text-list">
              {allHeadlines.map((headline) => (
                <pre
                  key={headline.original.link ?? `${headline.original.title}-${headline.transformed}`}
                  className="text-block"
                >
                  {formatHeadlineText(headline)}
                </pre>
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
