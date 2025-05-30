'use client'

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
import ApiService from "@/lib/api-client/wrapper"
import { useEffect, useState } from "react"
import { StatusMotor } from "@/components/forms/motor-drawer"
import { StatusTransaksi } from "@/components/forms/transaction-drawer"

export function SectionCardsDasboard() {

  const [info, setInfo] = useState({
    motorAvailable: 0,
    motorRented: 0,
    orderOngoing: 0,
    income: 0
  })

  const apiService = ApiService.getInstance()

  const refresh = async () => {
    var motors = await apiService.motorApi.apiMotorGet()
    var transaction = await apiService.transaksiApi.apiTransaksiGet()

    setInfo({
      motorAvailable: motors.filter(m => m.statusMotor === StatusMotor.Available).length,
      motorRented: motors.filter(m => m.statusMotor === StatusMotor.Rented).length,
      orderOngoing: transaction.filter(t => t.status === StatusTransaksi.Ongoing).length,
      income: transaction.filter(t => t.status === StatusTransaksi.Finished).map(t => t.totalHarga).reduce((p, i) => p! + i!, 0)!
    })
  }

  useEffect(() => {
    refresh()
  }, [])

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Motors Available</CardDescription>
          <CardTitle className="mt-8 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {info.motorAvailable} Motors
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
            {info.motorRented} Motors
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
          <CardDescription>Ongoing Order</CardDescription>
          <CardTitle className="mt-6 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {info.orderOngoing} Orders
          </CardTitle>
        </CardHeader>
        <CardFooter className="mt-8 flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Orders still In progress
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Income</CardDescription>
          <CardTitle className="mt-6 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            Rp. {info.income}
          </CardTitle>
          <CardAction>
            {/* <Badge variant="outline">
              <IconTrendingUp />
              +4.5%
            </Badge> */}
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