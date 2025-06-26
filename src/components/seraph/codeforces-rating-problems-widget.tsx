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

export function CodeforcesCurrentRatingWidget({ username }: Props) {
  const fetcher = React.useCallback(async () => {
    if (!username) throw new Error('no username')
    const [infoRes, solvedRes] = await Promise.all([
      fetch(`https://codeforces.com/api/user.info?handles=${username}`),
      fetch(
        `https://codeforces.com/api/user.status?handle=${username}&from=1&count=100000`,
      ),
    ])
    const infoJson = await infoRes.json()
    const solvedJson = await solvedRes.json()
    if (
      infoJson.status !== 'OK' ||
      infoJson.result.length === 0 ||
      solvedJson.status !== 'OK'
    ) {
      throw new Error('invalid')
    }
    const solvedSet = new Set<string>()
    for (const sub of solvedJson.result) {
      if (sub.verdict === 'OK') {
        solvedSet.add(`${sub.problem.contestId}-${sub.problem.index}`)
      }
    }
    const info = infoJson.result[0]
    const payload: StatsInfo = {
      rating: info.rating,
      rank: info.rank,
      solved: solvedSet.size,
    }
    return payload
  }, [username])

  const { data, loading } = useCachedFetch(
    `cf-stats-${username}`,
    fetcher,
    { ttl: 30 * 1000, retries: 3 },
  )
  const [showRating, setShowRating] = React.useState(true)

  React.useEffect(() => {
    const id = setInterval(() => {
      setShowRating((prev) => !prev)
    }, 5000)
    return () => clearInterval(id)
  }, [])

  return (
    <Card className="w-[300px] h-full bg-secondary transition-all duration-300 pb-2 hover:border-primary hover:shadow-md">
      <CardHeader>
        <CardTitle>Rating &amp; Problems</CardTitle>
      </CardHeader>
      <CardContent className="relative h-28 flex items-center justify-center">
        {loading ? (
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        ) : data ? (
          <>
            <div
              className={`absolute inset-0 flex flex-col items-center justify-center space-y-1 transition-opacity duration-700 ${showRating ? 'opacity-100' : 'opacity-0'}`}
            >
              <p className="animate-in fade-in zoom-in-95 bg-gradient-to-r from-violet-300 to-indigo-300 bg-clip-text text-6xl font-bold text-transparent">
                {data.rating}
              </p>
              <p className="text-sm text-muted-foreground capitalize">{data.rank}</p>
            </div>
            <div
              className={`absolute inset-0 flex flex-col items-center justify-center space-y-1 transition-opacity duration-700 ${showRating ? 'opacity-0' : 'opacity-100'}`}
            >
              <p className="animate-in fade-in zoom-in-95 bg-gradient-to-r from-violet-300 to-indigo-300 bg-clip-text text-6xl font-bold text-transparent">
                {data.solved}
              </p>
              <p className="text-sm text-muted-foreground">Solved</p>
            </div>
          </>
        ) : (
          <p className="text-center text-sm italic text-muted-foreground">Loading</p>
        )}
      </CardContent>
    </Card>
  )
}