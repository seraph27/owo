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

const fetchData = async (username: string) => {
  const query = `https://codeforces.com/api/user.rating?handle=${username}`
  const response = await fetch(query)
  const data = await response.json()
  if (data.status === 'FAILED') {
    throw new Error('Invalid username or no data available.')
  }
  return data.result.map((entry: any) => {
    const getRank = (rating: number) => {
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
    return {
      date: new Date(entry.ratingUpdateTimeSeconds * 1000)
        .toISOString()
        .split('T')[0],
      rating: entry.newRating,
      change: `${entry.newRating - entry.oldRating > 0 ? '+' : ''}${
        entry.newRating - entry.oldRating
      }`,
      rank: getRank(entry.newRating),
      globalRank: entry.rank,
      contestName: entry.contestName,
      contestTime: new Date(entry.ratingUpdateTimeSeconds * 1000),
      contestTimeFormatted: new Date(
        entry.ratingUpdateTimeSeconds * 1000,
      ).toLocaleString('en-US'),
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
  const [codeforcesData, setCodeforcesData] = useState([])
  const [error, setError] = useState<string | null>(null)

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

  const ratingBands = [
    { min: 0, max: 1200, color: 'rgba(204, 204, 204, 0.6)' },
    { min: 1200, max: 1400, color: 'rgba(119, 255, 119, 0.8)' },
    { min: 1400, max: 1600, color: 'rgba(119, 221, 187, 0.8)' },
    { min: 1600, max: 1900, color: 'rgba(170, 170, 255, 0.8)' },
    { min: 1900, max: 2100, color: 'rgba(255, 136, 255, 0.8)' },
    { min: 2100, max: 2300, color: 'rgba(255, 249, 70, 0.8)' },
    { min: 2300, max: 2400, color: 'rgba(255, 72, 72, 0.8)' },
    { min: 2400, max: 2600, color: 'rgba(255, 18, 18, 0.8)' },
    { min: 2600, max: 3000, color: 'rgba(255, 18, 18, 0.8)' },
    { min: 3000, max: 4000, color: 'rgba(170, 0, 0, 0.8)' },
    { min: 4000, max: 5000, color: 'rgba(0, 0, 0, 0.8)' },
  ]

  const minRating =
    codeforcesData.length > 0
      ? Math.min(
          ...codeforcesData
            .filter((entry: any) => entry.contestTime >= new Date('2024-01-01'))
            .map((d: any) => d.rating),
        )
      : 0

  const maxRating =
    codeforcesData.length > 0
      ? Math.max(
          ...codeforcesData
            .filter((entry: any) => entry.contestTime >= new Date('2024-01-01'))
            .map((d: any) => d.rating),
        )
      : 0

  console.log('Min Rating:', minRating, 'Max Rating:', maxRating)
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
                data={codeforcesData.filter(
                  (entry: any) => entry.contestTime >= new Date('2024-01-01'),
                )}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 30,
                }}
              >
                {ratingBands
                  .filter(
                    (band) => band.min <= maxRating+100 && band.max >= minRating-100,
                  )
                  .map((band, index) => (
                    <ReferenceArea
                      key={index}
                      y1={Math.max(band.min, minRating-100)}
                      y2={Math.min(band.max, maxRating+100)}
                      fill={band.color}
                      ifOverflow="extendDomain"
                    />
                  ))}
                <XAxis
                  dataKey="contestTime"
                  scale="time"
                  type="Date"
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      year: '2-digit',
                    })
                  }
                  height={60}
                  tickMargin={20}
                  angle={-45}
                  textAnchor="end"
                />
                <YAxis domain={[minRating, maxRating]} tickCount={100} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
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
