import * as React from 'react'
import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
  username: string
}

interface ContestInfo {
  count: number
  lastRank?: number
  lastDelta?: number
}

export function CodeforcesContestWidget({ username }: Props) {
  const [data, setData] = React.useState<ContestInfo | null>(null)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (!username) {
      setData(null)
      return
    }
    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await fetch(
          `https://codeforces.com/api/user.rating?handle=${username}`,
        )
        const json = await res.json()
        if (json.status !== 'OK') {
          setData(null)
          return
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
        setData({ count, lastRank, lastDelta })
      } catch {
        setData(null)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [username])

  return (
    <Card className="w-[300px] h-full bg-secondary">
      <CardHeader>
        <CardTitle>Contests Attended</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-2">
        {loading ? (
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        ) : data ? (
          <>
            <p className="animate-in fade-in zoom-in-95 bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-6xl font-bold text-transparent">
              {data.count}
            </p>
            {data.lastRank != null && data.lastDelta != null ? (
              <p className="text-sm text-muted-foreground">
                Last Rank: {data.lastRank} ({data.lastDelta >= 0 ? '+' : ''}
                {data.lastDelta})
              </p>
            ) : null}
          </>
        ) : (
          <p className="text-sm italic text-muted-foreground">Enter handle</p>
        )}
      </CardContent>
    </Card>
  )
}