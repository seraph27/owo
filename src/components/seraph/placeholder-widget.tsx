import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
  title: string
  height?: string
}

export function PlaceholderWidget({ title, height = 'h-32' }: Props) {
  return (
    <Card className={`w-full ${height} bg-secondary`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <p className="text-sm italic text-muted-foreground">Coming soon</p>
      </CardContent>
    </Card>
  )
}