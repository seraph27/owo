import * as React from 'react'
import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCachedFetch } from '@/lib/useCachedFetch'
import { PlaceholderWidget } from './placeholder-widget'

interface Props {
  username: string
}

interface StatsInfo {
  solved: number
  ranking?: number
}

export function LeetCodeCurrentStatsWidget({ username }: Props) {
  const fetcher = React.useCallback(async () => {
    if (!username) throw new Error('no username')
    const res = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`)
    const json = await res.json()
    if (!json.totalSolved) throw new Error('failed')
    return { solved: json.totalSolved, ranking: json.ranking } as StatsInfo
  }, [username])

  const { data, loading } = useCachedFetch<StatsInfo>(`lc-stats-${username}`, fetcher, { ttl: 30_000, retries: 3 })
  const [showRank, setShowRank] = React.useState(true)
  React.useEffect(() => {
    const id = setInterval(() => setShowRank(p => !p), 5000)
    return () => clearInterval(id)
  }, [])

  return (
    <Card className="w-[300px] h-full bg-secondary transition-all duration-300 hover:border-primary hover:shadow-md">
      <CardHeader>
        <CardTitle>Ranking &amp; Problems</CardTitle>
      </CardHeader>
      <CardContent className="relative h-28 flex items-center justify-center">
        {loading ? (
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        ) : data ? (
          <>
            <div className={`absolute inset-0 flex flex-col items-center justify-center space-y-1 transition-opacity duration-700 ${showRank ? 'opacity-100' : 'opacity-0'}`}>
              <p className="animate-in fade-in zoom-in-95 bg-gradient-to-r from-violet-300 to-indigo-300 bg-clip-text text-6xl font-bold text-transparent">
                {data.ranking ?? 'N/A'}
              </p>
              <p className="text-sm text-muted-foreground">Rank</p>
            </div>
            <div className={`absolute inset-0 flex flex-col items-center justify-center space-y-1 transition-opacity duration-700 ${showRank ? 'opacity-0' : 'opacity-100'}`}>
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

export function LeetCodeLastSolvedWidget() {
  return <PlaceholderWidget title="Last Solved" />
}

export function LeetCodeContestWidget() {
  return <PlaceholderWidget title="Contests Attended" />
}

export function LeetCodeRatingChart() {
  return <PlaceholderWidget title="LeetCode Rating Progress" height="h-[500px]" />
}

export function LeetCodeActivityHeatmap() {
  return <PlaceholderWidget title="Activity" height="h-32" />
}

export function LeetCodeWidgets({ username }: Props) {
  return (
    <div className="space-y-2">
      <div className="grid w-full max-w-6xl gap-2 grid-cols-1 lg:grid-cols-[1fr_3fr] mx-auto">
        <div className="flex flex-col gap-2 justify-evenly">
          <LeetCodeCurrentStatsWidget username={username} />
          <LeetCodeLastSolvedWidget />
          <LeetCodeContestWidget />
        </div>
        <div>
          <LeetCodeRatingChart />
        </div>
      </div>
      <LeetCodeActivityHeatmap />
    </div>
  )
}