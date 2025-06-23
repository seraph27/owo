import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Dot,
  ReferenceArea,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export type RatingCategory =
  | 'Newbie'
  | 'Pupil'
  | 'Specialist'
  | 'Expert'
  | 'Candidate Master'
  | 'Master'
  | 'International Master'
  | 'Grandmaster'
  | 'International Grandmaster'
  | 'Legendary Grandmaster'

export interface CodeforcesRatingEntry {

  date: string  
  /** the new rating after the contest */
  rating: number
  /** e.g. "+23", "-15" */
  change: string
  /** one of the predefined bands */
  rank: RatingCategory
  /** your place in that contest */
  globalRank: number
  /** the contest’s human-readable name */
  contestName: string
  /** raw Date object for plotting, sorting, etc. */
  contestTime: Date
  /** localized timestamp string */
  contestTimeFormatted: string
}

const fetchData = async (username: string): Promise<CodeforcesRatingEntry[]> => {
  const query = `https://codeforces.com/api/user.rating?handle=${username}`
  const response = await fetch(query)
  const data = await response.json()
  if (data.status === 'FAILED') {
    throw new Error('Invalid username or no data available.')
  }

  return data.result.map((entry: any): CodeforcesRatingEntry => {
    const delta = entry.newRating - entry.oldRating
    const getRank = (rating: number): RatingCategory => {
      if (rating < 1200) return 'Newbie'
      if (rating < 1400) return 'Pupil'
      if (rating < 1600) return 'Specialist'
      if (rating < 1900) return 'Expert'
      if (rating < 2100) return 'Candidate Master'
      if (rating < 2300) return 'Master'
      if (rating < 2400) return 'International Master'
      if (rating < 2600) return 'Grandmaster'
      if (rating < 3000) return 'International Grandmaster'
      return 'Legendary Grandmaster'
    }

    const ts = entry.ratingUpdateTimeSeconds * 1000
    const dateObj = new Date(ts)

    return {
      date: dateObj.toISOString().split('T')[0],
      rating: entry.newRating,
      change: `${delta > 0 ? '+' : ''}${delta}`,
      rank: getRank(entry.newRating),
      globalRank: entry.rank,
      contestName: entry.contestName,
      contestTime: dateObj,
      contestTimeFormatted: dateObj.toLocaleString('en-US'),
    }
  })
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-card text-card-foreground rounded border bg-background p-4 shadow-lg">
        <p className="font-bold">{`${data.rating} (${data.change}), ${data.rank}`}</p>
        <p>{`Rank: ${data.globalRank}`}</p>
        <p>{data.contestName}</p>
        <p>{data.contestTimeFormatted}</p>
      </div>
    )
  }
  return null
}

const CustomDot = (props: any) => {
  const { cx, cy, stroke } = props
  return (
    <Dot
      cx={cx}
      cy={cy}
      r={4}
      stroke={stroke}
      strokeWidth={2}
      fill="hsl(var(--background))"
    />
  )
}

export function CodeforcesRatingChart() {
  const [inputValue, setInputValue] = useState('shiinamashiro_') // Track input text
  const [username, setUsername] = useState('shiinamashiro_') // Used for fetching
  const [codeforcesData, setCodeforcesData] = useState([] as CodeforcesRatingEntry[])
  const [_, setError] = useState<string | null>(null)

  const fetchAndSetData = async (username: string) => {
    try {
      const data = await fetchData(username)
      setCodeforcesData(data)
      console.log(codeforcesData)
      setError(null)
    } catch (err: any) {
      setError(err.message)
      setCodeforcesData([])
    }
  }
  useEffect(() => {
    fetchAndSetData(username)
  }, [username])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value.trim())
  }

  const handleSubmit = () => {
    if (inputValue) {
      setUsername(inputValue)
    }
  }
  
  // Filter data to only include entries from 2024 onwards
  const filteredData = codeforcesData.filter(
    (entry: CodeforcesRatingEntry) => entry.contestTime >= new Date('2024-01-01'),
  )

  // Define rating bands and their colors
  const ratingBands = [
    { min: 0, max: 1200, color: 'rgba(204, 204, 204, 0.6)' },
    { min: 1200, max: 1400, color: 'rgba(119, 255, 119, 0.8)' },
    { min: 1400, max: 1600, color: 'rgba(119, 221, 187, 0.8)' },
    { min: 1600, max: 1900, color: 'rgba(170, 170, 255, 0.8)' },
    { min: 1900, max: 2100, color: 'rgba(255, 136, 255, 0.8)' },
    { min: 2100, max: 2300, color: 'rgba(255, 249, 70, 0.8)' },
    { min: 2300, max: 2400, color: 'rgba(255, 155, 90, 0.8)' },
    { min: 2400, max: 2600, color: 'rgba(255, 72, 72, 0.8)' },
    { min: 2600, max: 3000, color: 'rgba(255, 18, 18, 0.8)' },
    { min: 3000, max: 4000, color: 'rgba(170, 0, 0, 0.8)' },
    { min: 4000, max: 5000, color: 'rgba(0, 0, 0, 0.8)' },
  ]

  
  const ratingBoundaries = [
    ...ratingBands.map((b) => b.min),
    ratingBands[ratingBands.length - 1].max,
  ]

  const minRating =
    filteredData.length > 0
      ? Math.min(...filteredData.map((d: any) => d.rating)) - 200
      : 0

  const maxRating =
    filteredData.length > 0
      ? Math.max(...filteredData.map((d: any) => d.rating)) + 200
      : 0
  console.log('minRating:', minRating, 'maxRating:', maxRating, filteredData)
  
  const monthTicks =
    filteredData.length > 0
      ? (() => {
          const ticks: Date[] = []
          const start = new Date(filteredData[0].contestTime)
          start.setDate(1)
          start.setHours(0, 0, 0, 0)
          const end = new Date(
            filteredData[filteredData.length - 1].contestTime,
          )
          start.setMonth(start.getMonth() + 1)
          end.setDate(1)
          end.setHours(0, 0, 0, 0)
          for (let d = new Date(start); d <= end; d.setMonth(d.getMonth() + 1)) {
            ticks.push(new Date(d))
          }
          return ticks
        })()
      : []

  return (
    <div className="space-y-1">
      <div className="flex max-w-[400px] space-x-1">
        <Input
          type="text"
          placeholder="Enter Codeforces username"
          value={inputValue}
          onChange={handleInputChange}
        />
        <Button type="submit" onClick={handleSubmit}>
          Fetch
        </Button>
      </div>
      <Card className="w-full max-w-6xl">
        <CardHeader>
          <CardTitle>Codeforces Rating Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={filteredData}
                margin={{
                  top: 0,
                  right: 10,
                  left: 0,
                  bottom: 20,
                }}
              >
                {ratingBands
                  .filter(
                    (band) => band.min <= maxRating && band.max >= minRating,
                  )
                  .map((band, index) => (
                    <ReferenceArea
                      key={index}
                      y1={Math.max(band.min, minRating)}
                      y2={Math.min(band.max, maxRating)}
                      fill={band.color}
                      ifOverflow="extendDomain"
                    />
                  ))}
                <XAxis
                  dataKey="contestTime"
                  scale="time"
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      year: '2-digit',
                    })
                  }
                  ticks={monthTicks}
                  tick={{ fontSize: 12 }}
                  height={60}
                  tickMargin={20}
                  angle={-45}
                  textAnchor="end"
                />
                <YAxis
                  domain={[minRating, maxRating]}
                  ticks={ratingBoundaries.filter(
                    (b) => b >= minRating && b <= maxRating,
                  )}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="linear"
                  dataKey="rating"
                  stroke="#B19CD9"
                  fillOpacity={0.05}
                  isAnimationActive={false}
                  dot={(props) => (
                    <CustomDot
                      key={props.key}
                      cx={props.cx}
                      cy={props.cy}
                      stroke="#FFFFFF"
                    />
                  )}
                  fill="#FFFFFF"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
