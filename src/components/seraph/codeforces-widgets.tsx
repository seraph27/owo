import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CodeforcesRatingChart } from './codeforces-rating-chart'
import { CodeforcesSolvedWidget } from './codeforces-solved-widget'
import { 
    Card
    
 } from '../ui/card'
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
    <div className="flex max-w-6xl mx-12 space-x-2">
      <Input
        type="text"
        placeholder="Enter Codeforces username"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <Button onClick={handleSubmit}>Fetch</Button>
    </div>
      <div className="grid w-full max-w-6xl gap-4 grid-cols-1 grid-rows- lg:grid-cols-4 mx-12">
        <div className="col-span-1 row-span-1 flex max-w-fit">
          <CodeforcesSolvedWidget username={username} />
        </div>
        <div className="col-span-3 row-span-3">
          <CodeforcesRatingChart username={username} />
        </div>
        <div className="col-span-1 row-span-1 flex max-w-fit">
          <CodeforcesSolvedWidget username={username} />
        </div>
        <div className="col-span-1 row-span-1 flex max-w-fit">
          <CodeforcesSolvedWidget username={username} />
        </div>
      </div>
    </div>
  )
}