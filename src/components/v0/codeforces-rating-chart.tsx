import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Dot,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const codeforcesData = [
  {
    date: '2023-01-01',
    rating: 1200,
    change: '+25',
    rank: 'Pupil',
    globalRank: 5000,
    contestName: 'Codeforces Round 900 (Div. 3)',
    contestTime: 'Jan/01/2023 17:35',
  },
  {
    date: '2023-03-15',
    rating: 1300,
    change: '+100',
    rank: 'Specialist',
    globalRank: 4500,
    contestName: 'Codeforces Round 920 (Div. 3)',
    contestTime: 'Mar/15/2023 17:40',
  },
  {
    date: '2023-06-01',
    rating: 1400,
    change: '+100',
    rank: 'Specialist',
    globalRank: 4000,
    contestName: 'Codeforces Round 940 (Div. 3)',
    contestTime: 'Jun/01/2023 17:35',
  },
  {
    date: '2023-08-13',
    rating: 1432,
    change: '+32',
    rank: 'Specialist',
    globalRank: 2677,
    contestName: 'Codeforces Round 966 (Div. 3)',
    contestTime: 'Aug/13/2023 17:40',
  },
  {
    date: '2023-01-01',
    rating: 1200,
    change: '+25',
    rank: 'Pupil',
    globalRank: 5000,
    contestName: 'Codeforces Round 900 (Div. 3)',
    contestTime: 'Jan/01/2023 17:35',
  },
  {
    date: '2023-03-15',
    rating: 1300,
    change: '+100',
    rank: 'Specialist',
    globalRank: 4500,
    contestName: 'Codeforces Round 920 (Div. 3)',
    contestTime: 'Mar/15/2023 17:40',
  },
  {
    date: '2023-06-01',
    rating: 1400,
    change: '+100',
    rank: 'Specialist',
    globalRank: 4000,
    contestName: 'Codeforces Round 940 (Div. 3)',
    contestTime: 'Jun/01/2023 17:35',
  },
  {
    date: '2023-08-13',
    rating: 1432,
    change: '+32',
    rank: 'Specialist',
    globalRank: 2677,
    contestName: 'Codeforces Round 966 (Div. 3)',
    contestTime: 'Aug/13/2023 17:40',
  },
]

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-card text-card-foreground rounded border bg-background p-4 shadow-lg">
        <p className="font-bold">{`${data.rating} (${data.change}), ${data.rank}`}</p>
        <p>{`Rank: ${data.globalRank}`}</p>
        <p>{data.contestName}</p>
        <p>{data.contestTime}</p>
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
  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Codeforces Rating Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={codeforcesData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 40,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
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
              <YAxis
                domain={['dataMin - 100', 'dataMax + 100']}
                tickCount={8}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="rating"
                stroke="#B19CD9"
                fill="#B19CD9"
                fillOpacity={0.2}
                dot={(props) => (
                  <CustomDot
                    key={props.key}
                    cx={props.cx}
                    cy={props.cy}
                    stroke={props.stroke}
                  />
                )}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
