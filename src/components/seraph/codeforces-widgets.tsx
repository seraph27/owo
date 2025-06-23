import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CodeforcesRatingChart } from './codeforces-rating-chart'
import { CodeforcesSolvedWidget } from './codeforces-solved-widget'
import { CodeforcesLastSolvedWidget } from './codeforces-last-solved-widget'

export function CodeforcesWidgets() {
  const [inputValue, setInputValue] = React.useState('monoidic')
  const [username, setUsername] = React.useState('monoidic')

  const handleSubmit = () => {
    if (inputValue.trim()) {
      setUsername(inputValue.trim())
    }
  }

  return (
    <div className="space-y-2">
    <div className="flex max-w-6xl mx-auto space-x-2">
      <Input
        type="text"
        placeholder="Enter Codeforces username"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <Button onClick={handleSubmit}>Fetch</Button>
    </div>
      <div className="grid w-full max-w-6xl gap-4 grid-cols-1 lg:grid-cols-[1fr_3fr] mx-auto">
        <div className="flex flex-col gap-4 justify-evenly">
          <CodeforcesSolvedWidget username={username} />
          <CodeforcesLastSolvedWidget username={username} />
          <CodeforcesSolvedWidget username={username} />
        </div>
        <div>
          <CodeforcesRatingChart username={username} />
        </div>
      </div>
    </div>
  )
}