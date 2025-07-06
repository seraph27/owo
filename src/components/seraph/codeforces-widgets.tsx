import * as React from 'react'
import { CodeforcesRatingChart } from './codeforces-rating-chart'
import { CodeforcesSolvedWidget } from './codeforces-solved-widget'
import { CodeforcesLastSolvedWidget } from './codeforces-last-solved-widget'
import { CodeforcesContestWidget } from './codeforces-contest-widget'
import { CodeforcesActivityHeatmap } from './codeforces-activity-heatmap'
import { CodeforcesCurrentRatingWidget } from './codeforces-rating-problems-widget'

interface Props {
  username: string
}

export function CodeforcesWidgets({ username }: Props) {
  return (
    <div className="space-y-2">
      <div className="grid w-full max-w-6xl gap-2 grid-cols-1 lg:grid-cols-[1fr_3fr] mx-auto">
        <div className="flex flex-col gap-2 justify-evenly">
          <CodeforcesCurrentRatingWidget username={username} />
          <CodeforcesLastSolvedWidget username={username} />
          <CodeforcesContestWidget username={username} />
        </div>
        <div>
          <CodeforcesRatingChart username={username} />
        </div>
      </div>
      <CodeforcesActivityHeatmap username={username} />
    </div>
  )
}