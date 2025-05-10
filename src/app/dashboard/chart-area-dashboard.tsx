"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const description = "An interactive area chart"

const chartData = [
  { date: "2024-04-01", mobile: 10000 },
  { date: "2024-04-02", mobile: 15000 },
  { date: "2024-04-03", mobile: 12000 },
  { date: "2024-04-04", mobile: 26000 },
  { date: "2024-04-05", mobile: 29000 },
  { date: "2024-04-06", mobile: 34000 },
  { date: "2024-04-07", mobile: 1800 },
  { date: "2024-04-08", mobile: 32000 },
  { date: "2024-04-09", mobile: 11000 },
  { date: "2024-04-10", mobile: 19000 },
  { date: "2024-04-11", mobile: 35000 },
  { date: "2024-04-12", mobile: 21000 },
  { date: "2024-04-13", mobile: 38000 },
  { date: "2024-04-14", mobile: 22000 },
  { date: "2024-04-15", mobile: 17000 },
  { date: "2024-04-16", mobile: 19000 },
  { date: "2024-04-17", mobile: 36000 },
  { date: "2024-04-18", mobile: 50000 },
  { date: "2024-04-19", mobile: 18000 },
  { date: "2024-04-20", mobile: 15000 },
  { date: "2024-04-21", mobile: 20000 },
  { date: "2024-04-22", mobile: 17000 },
  { date: "2024-04-23", mobile: 23000 },
  { date: "2024-04-24", mobile: 29000 },
  { date: "2024-04-25", mobile: 25000 },
  { date: "2024-04-26", mobile: 13000 },
  { date: "2024-04-27", mobile: 20000 },
  { date: "2024-04-28", mobile: 18000 },
  { date: "2024-04-29", mobile: 24000 },
  { date: "2024-04-30", mobile: 30000 },
  { date: "2024-05-01", mobile: 22000 },
  { date: "2024-05-02", mobile: 31000 },
  { date: "2024-05-03", mobile: 19000 },
  { date: "2024-05-04", mobile: 20000 },
  { date: "2024-05-05", mobile: 90000 },
  { date: "2024-05-06", mobile: 20000 },
  { date: "2024-05-07", mobile: 30000 },
  { date: "2024-05-08", mobile: 21000 },
  { date: "2024-05-09", mobile: 18000 },
  { date: "2024-05-10", mobile: 33000 },
  { date: "2024-05-11", mobile: 27000 },
  { date: "2024-05-12", mobile: 24000 },
  { date: "2024-05-13", mobile: 16000 },
  { date: "2024-05-14", mobile: 90000 },
  { date: "2024-05-15", mobile: 38000 },
  { date: "2024-05-16", mobile: 90000 },
  { date: "2024-05-17", mobile: 20000 },
  { date: "2024-05-18", mobile: 50000 },
  { date: "2024-05-19", mobile: 18000 },
  { date: "2024-05-20", mobile: 23000 },
  { date: "2024-05-21", mobile: 14000 },
  { date: "2024-05-22", mobile: 12000 },
  { date: "2024-05-23", mobile: 29000 },
  { date: "2024-05-24", mobile: 22000 },
  { date: "2024-05-25", mobile: 25000 },
  { date: "2024-05-26", mobile: 17000 },
  { date: "2024-05-27", mobile: 60000 },
  { date: "2024-05-28", mobile: 19000 },
  { date: "2024-05-29", mobile: 13000 },
  { date: "2024-05-30", mobile: 28000 },
  { date: "2024-05-31", mobile: 23000 },
  { date: "2024-06-01", mobile: 20000 },
  { date: "2024-06-02", mobile: 10000 },
  { date: "2024-06-03", mobile: 16000 },
  { date: "2024-06-04", mobile: 80000 },
  { date: "2024-06-05", mobile: 14000 },
  { date: "2024-06-06", mobile: 25000 },
  { date: "2024-06-07", mobile: 37000 },
  { date: "2024-06-08", mobile: 32000 },
  { date: "2024-06-09", mobile: 80000 },
  { date: "2024-06-10", mobile: 20000 },
  { date: "2024-06-11", mobile: 15000 },
  { date: "2024-06-12", mobile: 20000 },
  { date: "2024-06-13", mobile: 13000 },
  { date: "2024-06-14", mobile: 80000 },
  { date: "2024-06-15", mobile: 35000 },
  { date: "2024-06-16", mobile: 10000 },
  { date: "2024-06-17", mobile: 20000 },
  { date: "2024-06-18", mobile: 17000 },
  { date: "2024-06-19", mobile: 90000 },
  { date: "2024-06-20", mobile: 30000 },
  { date: "2024-06-21", mobile: 10000 },
  { date: "2024-06-22", mobile: 27000 },
  { date: "2024-06-23", mobile: 30000 },
  { date: "2024-06-24", mobile: 18000 },
  { date: "2024-06-25", mobile: 19000 },
  { date: "2024-06-26", mobile: 80000 },
  { date: "2024-06-27", mobile: 30000 },
  { date: "2024-06-28", mobile: 20000 },
  { date: "2024-06-29", mobile: 16000 },
  { date: "2024-06-30", mobile: 20000 },
]

const chartConfig = {
  mobile: {
    label: "Income",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function ChartAreaDashboard() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Income</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total for the last 3 months
          </span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }}
                    formatter={(value, name) => {
                      if (name === "mobile") {
                        return `Income ${value}`
                      }
                      return `${name} ${value}`
                    }}
                    indicator="dot"
                  />
              }
            />
            <Area
              dataKey="mobile"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
