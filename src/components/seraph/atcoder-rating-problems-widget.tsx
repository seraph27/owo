import * as React from 'react'
import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCachedFetch } from '@/lib/useCachedFetch'

interface Props {
  username: string
}

interface StatsInfo {
  rating: number
  rank: string
  solved: number
}

export function AtcoderCurrentRatingWidget({ username }: Props) {
  const fetcher = React.useCallback(async () => {
    if (!username) throw new Error('No username provided')

    // 1) Fetch rating & rank
    const infoRes = await fetch(
      `https://kenkoooo.com/atcoder/atcoder-api/v3/user_info?user=${username}`
    )
    if (!infoRes.ok) throw new Error('Failed to fetch user info')
    const infoJson = (await infoRes.json()) as {
      rating: number
      rated_point_sum_rank: string
      accepted_count: number
    }

    return {
      rating: infoJson.rating,
      rank: infoJson.rated_point_sum_rank,
      solved: infoJson.accepted_count,
    } as StatsInfo
  }, [username])

  const { data, loading } = useCachedFetch(
    `atcoder-stats-${username}`,
    fetcher,
    { ttl: 30 * 1000, retries: 3 }
  )
  const [showRating, setShowRating] = React.useState(true)

  React.useEffect(() => {
    const id = setInterval(() => setShowRating((v) => !v), 5000)
    return () => clearInterval(id)
  }, [])

  return (
    <Card className="w-[300px] h-full bg-secondary transition-all duration-300 pb-2 hover:border-primary hover:shadow-md">
      <CardHeader>
        <CardTitle>Rank &amp; Solved</CardTitle>
      </CardHeader>
      <CardContent className="relative h-28 flex items-center justify-center">
        {loading ? (
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        ) : data ? (
          <>
            <div
              className={`absolute inset-0 flex flex-col items-center justify-center space-y-1 transition-opacity duration-700 ${
                showRating ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <p className="animate-in fade-in zoom-in-95 bg-gradient-to-r from-violet-300 to-indigo-300 bg-clip-text text-6xl font-bold text-transparent">
                {data.rank}
              </p>
              <p className="text-sm text-muted-foreground">Global Rank</p>
            </div>
            <div
              className={`absolute inset-0 flex flex-col items-center justify-center space-y-1 transition-opacity duration-700 ${
                showRating ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <p className="animate-in fade-in zoom-in-95 bg-gradient-to-r from-violet-300 to-indigo-300 bg-clip-text text-6xl font-bold text-transparent">
                {data.solved}
              </p>
              <p className="text-sm text-muted-foreground">Solved</p>
            </div>
          </>
        ) : (
          <p className="text-center text-sm italic text-muted-foreground">
            Loading
          </p>
        )}
      </CardContent>
    </Card>
  )
}
