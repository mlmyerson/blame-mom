import type { TransformedHeadline } from './types'

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`
  const response = await fetch(url, init)

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || `Request failed with status ${response.status}`)
  }

  return response.json() as Promise<T>
}

type RandomHeadlineResponse = {
  success: boolean
  headline?: TransformedHeadline
  error?: string
}

type HeadlineListResponse = {
  success: boolean
  headlines: TransformedHeadline[]
  count: number
  error?: string
}

export async function fetchRandomHeadline(): Promise<TransformedHeadline> {
  const data = await fetchJson<RandomHeadlineResponse>('/api/random')

  if (!data.success || !data.headline) {
    throw new Error(data.error ?? 'No headline available')
  }

  return data.headline
}

export async function fetchHeadlines(limit = 50, suitableOnly = true): Promise<TransformedHeadline[]> {
  const params = new URLSearchParams({ limit: String(limit) })
  if (suitableOnly) {
    params.set('suitable', 'true')
  }

  const data = await fetchJson<HeadlineListResponse>(`/api/headlines?${params.toString()}`)

  if (!data.success || !data.headlines) {
    throw new Error(data.error ?? 'Unable to load headlines')
  }

  return data.headlines
}
