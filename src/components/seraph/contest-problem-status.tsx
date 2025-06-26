import * as React from 'react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Props {
  solved?: string[]
  failed?: string[]
  count?: number
  problems?: string[]
  contestId?: number
}

export function ContestProblemStatus({
  solved = [],
  failed = [],
  count = 6,
  problems,
  contestId,
}: Props) {
  const allProblems =
    problems ??
    Array.from({ length: count }, (_, i) =>
      String.fromCharCode('A'.charCodeAt(0) + i),
    )
  const linkBase = contestId
    ? `https://codeforces.com/contest/${contestId}/problem/`
    : null
  return (
    <div className="flex justify-center gap-2 my-4">
      {allProblems.map((p) => {
        const isSolved = solved.includes(p)
        const isFailed = failed.includes(p)
        const badge = (
          <Badge
            showHash={false}
            className={cn(
              'w-8 h-8 items-center justify-center rounded-full font-bold text-base transition-colors',
              isSolved
                ? 'bg-green-700 text-white'
                : isFailed
                  ? 'bg-red-700 text-white'
                  : 'bg-slate-200 text-gray-800',
              'hover:bg-violet-300 hover:text-white',
            )}
          >
            {p}
          </Badge>
        )
        return linkBase ? (
          <a
            key={p}
            href={`${linkBase}${p}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {badge}
          </a>
        ) : (
          <React.Fragment key={p}>{badge}</React.Fragment>
        )
      })}
    </div>
  )
}