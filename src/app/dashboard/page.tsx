"use client"

import { ChartAreaDashboard } from "./chart-area-dashboard"
import { DataTableDashboard } from "./data-table-dashboard"
import { SectionCardsDasboard } from "./section-cards-dashboard"

import data from './data.json'
import typedMitraData from './dataMitra.json'
import { usetTitle } from "@/components/layout"
import { useEffect } from "react"

export default function Page() {
  const setTitle = usetTitle()

  useEffect(() => {
    setTitle("Dashboard")
  })

  return (
  
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCardsDasboard />
              <div className="px-4 lg:px-6">
                <ChartAreaDashboard />
              </div>
              <DataTableDashboard data={data} mitraData={typedMitraData} />
            </div>
          </div>
        </div>

  )
}