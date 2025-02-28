import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export function BillingSection() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>You are currently on the free plan</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center justify-between">
            <div className="grid gap-1">
              <div className="font-medium">Free Plan</div>
              <div className="text-sm text-muted-foreground">Basic features with limited usage</div>
            </div>
            <Link href={"/pricing"}>
            <Button >Upgrade Plan</Button>

            </Link>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>View your recent billing history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground text-center py-6">No billing history available</div>
        </CardContent>
      </Card>
    </div>
  )
}

