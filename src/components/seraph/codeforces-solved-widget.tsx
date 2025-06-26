import * as React from 'react'
import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCachedFetch } from '@/lib/useCachedFetch'

interface Props {
  username: string
}

export function CodeforcesSolvedWidget({ username }: Props) {
  const fetcher = React.useCallback(async () => {
    if (!username) throw new Error('no username')
    const res = await fetch(
      `https://codeforces.com/api/user.status?handle=${username}&from=1&count=100000`,
    )
    const data = await res.json()
    if (data.status !== 'OK') {
      throw new Error('failed')
    }
    const setProblems = new Set<string>()
    for (const sub of data.result) {
      if (sub.verdict === 'OK') {
        setProblems.add(`${sub.problem.contestId}-${sub.problem.index}`)
      }
    }
    return setProblems.size
  }, [username])

  const { data: solved, loading } = useCachedFetch<number>(
    `cf-solved-${username}`,
    fetcher,
    { ttl: 30 * 1000, retries: 3 },
  )

  return (
    <Card className="w-[300px] h-full bg-secondary transition-all duration-300 hover:border-primary hover:shadow-md">
      <CardHeader>
        <CardTitle>Problems Solved</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        {loading ? (
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        ) : solved !== null ? (
          <p className="animate-in fade-in zoom-in-95 bg-gradient-to-r from-violet-300 to-indigo-300 bg-clip-text text-center text-6xl font-bold text-transparent">
            {solved}
          </p>
        ) : (
          <p className="text-center text-sm italic text-muted-foreground">
            Loading
          </p>
        )}
      </CardContent>
    </Card>
  )
}