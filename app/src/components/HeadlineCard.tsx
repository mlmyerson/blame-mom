import type { TransformedHeadline } from '../types'
import './HeadlineCard.css'

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: undefined,
})

function formatDate(value?: string) {
  if (!value) return null
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return null
  return dateFormatter.format(parsed)
}

type HeadlineCardProps = {
  headline: TransformedHeadline
}

export function HeadlineCard({ headline }: HeadlineCardProps) {
  const { original, transformed } = headline
  const formattedDate = formatDate(original.publishedAt)

  return (
    <article className="headline-card">
      <div className="headline-original">
        <p className="headline-label">Original Headline</p>
        <p>{original.title}</p>
      </div>

      <p className="headline-transformed">{transformed}</p>

      <footer className="headline-meta">
        <span className="source">
          {original.source ?? 'Unknown source'}
          {original.category ? ` - ${original.category}` : ''}
        </span>
        <span className="meta-actions">
          {formattedDate && <span className="timestamp">{formattedDate}</span>}
          {original.link && (
            <a href={original.link} target="_blank" rel="noreferrer" className="link">
              Read Original {'->'}
            </a>
          )}
        </span>
      </footer>
    </article>
  )
}

export default HeadlineCard
