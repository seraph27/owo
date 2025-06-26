import * as React from 'react'
import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCachedFetch } from '@/lib/useCachedFetch'

interface Props {
  username: string
}

interface ContestInfo {
  count: number
  lastRank?: number
  lastDelta?: number
}

export function CodeforcesContestWidget({ username }: Props) {
  const fetcher = React.useCallback(async () => {
    if (!username) throw new Error('no username')
    const res = await fetch(
      `https://codeforces.com/api/user.rating?handle=${username}`,
    )
    const json = await res.json()
    if (json.status !== 'OK') {
      throw new Error('failed')
    }
    const entries = json.result
    const count = entries.length
    let lastRank: number | undefined
    let lastDelta: number | undefined
    if (count > 0) {
      const last = entries[count - 1]
      lastRank = last.rank
      lastDelta = last.newRating - last.oldRating
    }
    const payload: ContestInfo = { count, lastRank, lastDelta }
    return payload
  }, [username])

  const { data, loading } = useCachedFetch<ContestInfo>(
    `cf-contest-${username}`,
    fetcher,
    { ttl: 30 * 1000, retries: 3 },
  )


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
            {data.lastRank != null && data.lastDelta != null ? (
              <>
                <p className="text-sm text-muted-foreground">Last Rank: {data.lastRank}</p>
                <p className="text-sm text-muted-foreground">
                  Rating Δ: {data.lastDelta >= 0 ? '+' : ''}
                  {data.lastDelta}
                </p>
              </>
            ) : null}
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