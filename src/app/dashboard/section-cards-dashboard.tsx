import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCardsDasboard() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Motors Available</CardDescription>
          <CardTitle className="mt-8 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            12 Motors
          </CardTitle>
        </CardHeader>
        <CardFooter className="mt-8 flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Number of units ready to rent
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Motors Rented</CardDescription>
          <CardTitle className="mt-6 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            5 Motors
          </CardTitle>
        </CardHeader>
        <CardFooter className="mt-8 flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Motorcycles that are actively rented by current users
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Pending Order</CardDescription>
          <CardTitle className="mt-6 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            2 Orders
          </CardTitle>
        </CardHeader>
        <CardFooter className="mt-8 flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Orders still waiting for partner processing
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Income</CardDescription>
          <CardTitle className="mt-6 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            Rp. 1.000.000
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="mt-0 line-clamp-1 flex gap-2 font-medium">
            Total income from successful transactions
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}