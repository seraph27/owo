import * as React from 'react'
import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
  username: string
}

interface LastSolved {
  name: string
  rating?: number
  tags: string[]
  contestId: number
  index: string
  submissionId: number
}

export function CodeforcesLastSolvedWidget({ username }: Props) {
  const [lastSolved, setLastSolved] = React.useState<LastSolved | null>(null)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (!username) {
      setLastSolved(null)
      return
    }
    const fetchLastSolved = async () => {
      try {
        setLoading(true)
        const res = await fetch(
          `https://codeforces.com/api/user.status?handle=${username}&from=1&count=100`,
        )
        const data = await res.json()
        if (data.status !== 'OK') {
          setLastSolved(null)
          return
        }
        const sub = data.result.find((s: any) => s.verdict === 'OK')
        if (!sub) {
          setLastSolved(null)
          return
        }
        setLastSolved({
          name: sub.problem.name,
          rating: sub.problem.rating,
          tags: sub.problem.tags || [],
          contestId: sub.problem.contestId,
          index: sub.problem.index,
          submissionId: sub.id,
        })
      } catch {
        setLastSolved(null)
      } finally {
        setLoading(false)
      }
    }
    fetchLastSolved()
  }, [username])

  const problemLink = lastSolved
    ? `https://codeforces.com/problemset/problem/${lastSolved.contestId}/${lastSolved.index}`
    : '#'
  const submissionLink = lastSolved
    ? `https://codeforces.com/contest/${lastSolved.contestId}/submission/${lastSolved.submissionId}`
    : '#'

  return (
    <Card className="w-[300px] h-auto bg-secondary">
      <CardHeader>
        <CardTitle className="text-base">
          {lastSolved ? (
            <a
              href={problemLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {lastSolved.name}
            </a>
          ) : (
            'Last Solved Problem'
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {loading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : lastSolved ? (
          <div className="text-sm">
            {lastSolved.rating && (
              <p>
                <span className="font-medium">Rating:</span> {lastSolved.rating}
              </p>
            )}
            {lastSolved.tags && lastSolved.tags.length > 0 && (
              <p>
                <span className="font-medium">Tags:</span> {lastSolved.tags.join(', ')}
              </p>
            )}
            <p>
              <a
                href={submissionLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                View Submission
              </a>
            </p>
          </div>
        ) : (
          <p className="text-sm italic text-muted-foreground">Enter handle</p>
        )}
      </CardContent>
    </Card>
  )
}