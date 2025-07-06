import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { CodeforcesWidgets } from './codeforces-widgets'
import { AtcoderWidgets } from './atcoder-widgets'
import { LeetCodeWidgets } from './leetcode-widgets'

const platforms = ['codeforces', 'atcoder', 'leetcode'] as const

export function CompetitiveTabs() {
  const [activeTab, setActiveTab] = React.useState<string>(() =>
    typeof localStorage !== 'undefined'
      ? localStorage.getItem('active-platform') || 'codeforces'
      : 'codeforces',
  )

  const [inputs, setInputs] = React.useState<Record<string, string>>({
    codeforces: 'monoidic',
    atcoder: 'monoidic',
    leetcode: 'monoidic',
  })
  const [usernames, setUsernames] = React.useState<Record<string, string>>(inputs)

  const handleSubmit = () => {
    setUsernames((prev) => ({ ...prev, [activeTab]: inputs[activeTab].trim() }))
  }

  React.useEffect(() => {
    localStorage.setItem('active-platform', activeTab)
  }, [activeTab])

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-2">
      <div className="flex max-w-6xl mx-auto justify-between space-x-2">
        <TabsList>
          <TabsTrigger value="codeforces">Codeforces</TabsTrigger>
          <TabsTrigger value="atcoder">AtCoder</TabsTrigger>
          <TabsTrigger value="leetcode">LeetCode</TabsTrigger>
        </TabsList>
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder={`Enter ${activeTab} username`}
            value={inputs[activeTab]}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, [activeTab]: e.target.value }))
            }
          />
          <Button onClick={handleSubmit}>Fetch</Button>
        </div>
      </div>
      <TabsContent value="codeforces">
        <CodeforcesWidgets username={usernames.codeforces} />
      </TabsContent>
      <TabsContent value="atcoder">
        <AtcoderWidgets username={usernames.atcoder} />
      </TabsContent>
      <TabsContent value="leetcode">
        <LeetCodeWidgets username={usernames.leetcode} />
      </TabsContent>
    </Tabs>
  )
}