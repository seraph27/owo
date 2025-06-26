import { useState, useEffect } from 'react'

interface Options {
  ttl?: number // time in ms to keep cache
  retries?: number
}

interface CacheEntry<T> {
  timestamp: number
  data: T
}

export function useCachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  { ttl = 30 * 1000, retries = 3 }: Options = {},
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let active = true
    const run = async () => {
      setLoading(true)
      try {
        const cached = localStorage.getItem(key)
        if (cached) {
          const parsed: CacheEntry<T> = JSON.parse(cached)
          if (Date.now() - parsed.timestamp < ttl) {
            setData(parsed.data)
            setLoading(false)
            return
          }
        }
        let attempt = 0
        while (attempt < retries) {
          try {
            const fresh = await fetcher()
            if (!active) return
            setData(fresh)
            localStorage.setItem(
              key,
              JSON.stringify({ timestamp: Date.now(), data: fresh }),
            )
            setLoading(false)
            return
          } catch {
            attempt++
            if (attempt >= retries) throw new Error('fetch failed')
          }
        }
      } catch {
        if (active) setData(null)
      } finally {
        if (active) setLoading(false)
      }
    }
    run()
    return () => {
      active = false
    }
  }, [key])

  return { data, loading }
}