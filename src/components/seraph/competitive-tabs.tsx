import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CodeforcesWidgets } from './codeforces-widgets'

export function CompetitiveTabs() {
  const [username, setUsername] = React.useState<string>('monoidic')
  const [inputValue, setInputValue] = React.useState<string>('monoidic')

  const handleSubmit = () => {
    const newUsername = inputValue.trim()
    if (newUsername) {
      setUsername(newUsername)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex max-w-6xl mx-auto justify-between space-x-2">
        <div className="flex items-center space-x-2">
          <Button 
            variant="secondary" 
            className="font-semibold border border-border text-white" 
          >
            Codeforces
          </Button>
        </div>
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Enter Codeforces username"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Button onClick={handleSubmit}>Fetch</Button>
        </div>
      </div>
      
      <CodeforcesWidgets username={username} />
    </div>
  )
}