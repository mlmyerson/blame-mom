export type HeadlineSource = {
  title: string
  link?: string
  source?: string
  category?: string
  publishedAt?: string
  summary?: string
  description?: string
}

export type TransformedHeadline = {
  original: HeadlineSource
  transformed: string
  suitable: boolean
}
