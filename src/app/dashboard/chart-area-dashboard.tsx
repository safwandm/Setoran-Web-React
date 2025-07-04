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
import ApiService from "@/lib/api-client/wrapper"
import { DashboardDataDTO, StatusTransaksi, Transaksi } from "@/lib/api-client"
import { formatDateToLongDate, formatPrice } from "@/lib/utils"

export const description = "An interactive area chart"

const chartConfig = {
  totalHarga: {
    label: "Income",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function ChartAreaDashboard({ data } : { data: DashboardDataDTO }) {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  const transaksi = React.useMemo(() => data.chartTransaksi || [], [data])

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = React.useMemo(() => {
    return transaksi.filter((item) => {
      if (item.status !== StatusTransaksi.Selesai) 
        return false

      const date = new Date(item.tanggalSelesai!)
      const referenceDate = new Date()
      let daysToSubtract = 90
      if (timeRange === "30d") {
        daysToSubtract = 30
      } else if (timeRange === "7d") {
        daysToSubtract = 7
      }
      const startDate = new Date(referenceDate)
      startDate.setDate(startDate.getDate() - daysToSubtract)
      return date >= startDate && date <= referenceDate
    }).sort((a, b) => new Date(a.tanggalSelesai!).getTime() - new Date(b.tanggalSelesai!).getTime())
  }, [transaksi, timeRange])

  const timeRangeText = React.useMemo(() => {
    switch (timeRange) {
      case "7d":
        return "Last 7 days"
      case "30d":
        return "Last 30 days"
      case "90d":
      default:
        return "Last 3 months"
    }
  }, [timeRange])

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Income</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total for the {timeRangeText.toLowerCase()}
          </span>
          <span className="@[540px]/card:hidden">{timeRangeText}</span>
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
              dataKey="tanggalSelesai"
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
                    formatter={(value, name) => {
                      if (name === "totalHarga") {
                        return `Income ${formatPrice(value)}`
                      }
                      return `${name} ${value}`
                    }}
                    indicator="dot"
                  />
              }
            />
            <Area
              dataKey="totalHarga"
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