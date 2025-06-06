"use client"

import { ChartAreaDashboard } from "./chart-area-dashboard"
import { DataTableDashboard } from "./data-table-dashboard"
import { SectionCardsDasboard } from "./section-cards-dashboard"

import data from './data.json'
import typedMitraData from './dataMitra.json'
import { usetTitle } from "@/components/layout"
import { useEffect, useState } from "react"
import ApiService from "@/lib/api-client/wrapper"

export default function Page() {
  const setTitle = usetTitle()
  const [dashboardData, setDashboardData] = useState({})

  useEffect(() => {
    setTitle("Dashboard")
    ApiService.getInstance().reactApi.apiReactDashboardDataGet().then(res => {
      setDashboardData(res)
    })
  }, [])

  return (
  
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCardsDasboard data={dashboardData} />
              <div className="px-4 lg:px-6">
                <ChartAreaDashboard data={dashboardData} />
              </div>
              <DataTableDashboard />
            </div>
          </div>
        </div>

  )
}