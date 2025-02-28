import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function UsageSection() {
  return (
    <div className="grid gap-6">
    <Card>
      <CardHeader>
        <CardTitle>Usage Overview</CardTitle>
        <CardDescription>Monitor your blog usage and plan limits</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {/* Blogs Created */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="font-medium">Blogs Created</div>
            <div className="text-muted-foreground">12 / 20</div> {/* Adjust numbers dynamically */}
          </div>
          <Progress value={(12 / 20) * 100} /> {/* Adjust the value dynamically */}
        </div>

      </CardContent>
    </Card>
  </div>
  )
}

