import * as React from 'react'
import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCachedFetch } from '@/lib/useCachedFetch'
import { PlaceholderWidget } from './placeholder-widget'

interface Props {
  username: string
}

interface StatsInfo {
  rating: number
  rank?: number
  solved: number
}

export function AtcoderCurrentStatsWidget({ username }: Props) {
  const fetcher = React.useCallback(async () => {
    if (!username) throw new Error('no username')
    const [infoRes, solvedRes] = await Promise.all([
      fetch(`https://kenkoooo.com/atcoder/atcoder-api/v3/user_info?user=${username}`),
      fetch(`https://kenkoooo.com/atcoder/atcoder-api/results?user=${username}`),
    ])
    const info = await infoRes.json()
    const solvedJson = await solvedRes.json()
    const solvedSet = new Set<string>()
    for (const sub of solvedJson) {
      if (sub.result === 'AC') {
        solvedSet.add(sub.problem_id)
      }
    }
    return {
      rating: info.rating ?? 0,
      rank: info.rank,
      solved: solvedSet.size,
    } as StatsInfo
  }, [username])

  const { data, loading } = useCachedFetch<StatsInfo>(`ac-stats-${username}`, fetcher, { ttl: 30_000, retries: 3 })

  const [showRating, setShowRating] = React.useState(true)

  React.useEffect(() => {
    const id = setInterval(() => setShowRating((p) => !p), 5000)
    return () => clearInterval(id)
  }, [])

  return (
    <Card className="w-[300px] h-full bg-secondary transition-all duration-300 hover:border-primary hover:shadow-md">
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
              <p className="text-sm text-muted-foreground capitalize">Rank {data.rank ?? 'N/A'}</p>
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

interface LastSolved {
  problemId: string
  contestId: string
}

export function AtcoderLastSolvedWidget({ username }: Props) {
  const fetcher = React.useCallback(async () => {
    if (!username) throw new Error('no username')
    const res = await fetch(`https://kenkoooo.com/atcoder/atcoder-api/results?user=${username}`)
    const data = await res.json()
    const sub = data
      .filter((s: any) => s.result === 'AC')
      .sort((a: any, b: any) => b.epoch_second - a.epoch_second)[0]
    if (!sub) throw new Error('no solved')
    return { problemId: sub.problem_id, contestId: sub.contest_id } as LastSolved
  }, [username])

  const { data, loading } = useCachedFetch<LastSolved>(`ac-last-${username}`, fetcher, { ttl: 30_000, retries: 3 })

  const link = data ? `https://atcoder.jp/contests/${data.contestId}/tasks/${data.problemId}` : '#'

  return (
    <Card className="w-[300px] h-full bg-secondary transition-all duration-300 hover:border-primary hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-base">Last Solved</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {loading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : data ? (
          <a href={link} target="_blank" rel="noopener noreferrer" className="hover:underline">
            {data.problemId}
          </a>
        ) : (
          <p className="text-center text-sm italic text-muted-foreground">Loading</p>
        )}
      </CardContent>
    </Card>
  )
}

interface ContestInfo {
  count: number
  lastRank?: number
  lastDelta?: number
}

export function AtcoderContestWidget({ username }: Props) {
  const fetcher = React.useCallback(async () => {
    if (!username) throw new Error('no username')
    const res = await fetch(`https://atcoder.jp/users/${username}/history/json`)
    const json = await res.json()
    const count = json.length
    let lastRank: number | undefined
    let lastDelta: number | undefined
    if (count > 0) {
      const last = json[count - 1]
      lastRank = last.Place
      lastDelta = last.NewRating - last.OldRating
    }
    return { count, lastRank, lastDelta } as ContestInfo
  }, [username])

  const { data, loading } = useCachedFetch<ContestInfo>(`ac-contest-${username}`, fetcher, { ttl: 30_000, retries: 3 })

  return (
    <Card className="w-[300px] h-full bg-secondary transition-all duration-300 hover:border-primary hover:shadow-md">
      <CardHeader>
        <CardTitle>Contests Attended</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-2">
        {loading ? (
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        ) : data ? (
          <>
            <p className="animate-in fade-in zoom-in-95 bg-gradient-to-r from-violet-300 to-indigo-300 bg-clip-text text-6xl font-bold text-transparent">
              {data.count}
            </p>
            {data.lastRank != null && data.lastDelta != null && (
              <>
                <p className="text-sm text-muted-foreground">Last Rank: {data.lastRank}</p>
                <p className="text-sm text-muted-foreground">Rating Δ: {data.lastDelta >= 0 ? '+' : ''}{data.lastDelta}</p>
              </>
            )}
          </>
        ) : (
          <p className="text-center text-sm italic text-muted-foreground">Loading</p>
        )}
      </CardContent>
    </Card>
  )
}

export function AtcoderRatingChart() {
  return <PlaceholderWidget title="AtCoder Rating Progress" height="h-[500px]" />
}

export function AtcoderActivityHeatmap() {
  return <PlaceholderWidget title="Activity" height="h-32" />
}

export function AtcoderWidgets({ username }: Props) {
  return (
    <div className="space-y-2">
      <div className="grid w-full max-w-6xl gap-2 grid-cols-1 lg:grid-cols-[1fr_3fr] mx-auto">
        <div className="flex flex-col gap-2 justify-evenly">
          <AtcoderCurrentStatsWidget username={username} />
          <AtcoderLastSolvedWidget username={username} />
          <AtcoderContestWidget username={username} />
        </div>
        <div>
          <AtcoderRatingChart />
        </div>
      </div>
      <AtcoderActivityHeatmap />
    </div>
  )
}