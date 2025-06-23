import * as React from 'react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Props {
  solved?: string[]
  count?: number
  problems?: string[]
}

export function ContestProblemStatus({
  solved = [],
  count = 6,
  problems,
}: Props) {
  const allProblems =
    problems ??
    Array.from({ length: count }, (_, i) =>
      String.fromCharCode('A'.charCodeAt(0) + i),
    )
  return (
    <div className="flex justify-center gap-2 my-4">
      {allProblems.map((p) => {
        const isSolved = solved.includes(p)
        return (
          <Badge
            key={p}
            showHash={false}
            className={cn(
              'w-8 h-8 items-center justify-center rounded-full font-semibold',
              isSolved ? 'bg-green-600 text-white' : 'bg-red-600 text-white',
            )}
          >
            {p}
          </Badge>
        )
      })}
    </div>
  )
}
