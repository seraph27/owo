import * as React from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Loader2 } from 'lucide-react'
import { useCachedFetch } from '@/lib/useCachedFetch'

interface Props {
  username: string
}

interface ActivityMap {
  [date: string]: number
}

export function CodeforcesActivityHeatmap({ username }: Props) {
  const [selectedYear, setSelectedYear] = React.useState<number>(
    new Date().getFullYear(),
  )

  const fetcher = React.useCallback(async () => {
    if (!username) throw new Error('no username')
    const res = await fetch(
      `https://codeforces.com/api/user.status?handle=${username}&from=1&count=100000`,
    )
    const json = await res.json()
    if (json.status !== 'OK') throw new Error('failed')
    const map: ActivityMap = {}
    const yearSet = new Set<number>()
    for (const sub of json.result) {
      if (sub.verdict !== 'OK') continue
      const date = new Date(sub.creationTimeSeconds * 1000)
      const day = date.toISOString().split('T')[0]
      const year = date.getFullYear()
      yearSet.add(year)
      map[day] = (map[day] || 0) + 1
    }
    const years = Array.from(yearSet).sort((a, b) => b - a)
    return { activity: map, years }
  }, [username])

  const { data, loading } = useCachedFetch<{ activity: ActivityMap; years: number[] }>(
    `cf-activity-${username}`,
    fetcher,
    { ttl: 30 * 1000, retries: 3 },
  )

  const activity = data?.activity ?? {}
  const years = data?.years ?? []

  const year = selectedYear
  const startDate = new Date(year, 0, 1)
  const endDate = new Date(year, 11, 31)

  const days: { date: string; count: number }[] = []
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dayStr = d.toISOString().split('T')[0]
    days.push({ date: dayStr, count: activity[dayStr] || 0 })
  }

  const maxCount = Math.max(0, ...days.map((d) => d.count))
  const colorFor = (count: number) => {
    if (count === 0) return 'bg-muted/60'
    const level = count / maxCount
    if (level > 0.75) return 'bg-green-900'
    if (level > 0.5) return 'bg-green-700'
    if (level > 0.25) return 'bg-green-500'
    return 'bg-green-200'
  }

  // organize by weeks
  const weeks: { date: string; count: number }[][] = []
  let week: { date: string; count: number }[] = []
  const firstDow = new Date(startDate).getDay()
  for (let i = 0; i < firstDow; i++) week.push({ date: '', count: 0 })
  for (const day of days) {
    week.push(day)
    if (week.length === 7) {
      weeks.push(week)
      week = []
    }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push({ date: '', count: 0 })
    weeks.push(week)
  }

  return (
    <Card className="w-full max-w-6xl bg-secondary transition-all duration-300 hover:border-primary hover:shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Activity</CardTitle>
          {years.length > 0 && (
            <Select
              value={selectedYear.toString()}
              onValueChange={(v) => setSelectedYear(parseInt(v))}
            >
              <SelectTrigger className="w-[100px] bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background">
                {years.map((y) => (
                  <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="overflow-x-auto px-12">
            <div
              className="grid gap-x-1"
              style={{
                gridTemplateColumns: `repeat(${weeks.length}, minmax(0,1fr))`,
              }}
            >
              {weeks.map((w, i) => (
                <div key={i} className="flex flex-col gap-1">
                  {w.map((day, j) =>
                    day.date ? (
                      <Popover key={j}>
                        <PopoverTrigger asChild>
                          <div
                            className={`h-3 w-3 rounded ${colorFor(day.count)}`}
                          />
                        </PopoverTrigger>
                        <PopoverContent className="px-1 py-1 w-auto text-xs bg-background" side="top">
                          {day.date}: {day.count}
                        </PopoverContent>
                      </Popover>
                    ) : (
                      <div key={j} className="h-3 w-3 rounded opacity-0" />
                    ),
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}