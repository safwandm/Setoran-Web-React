'use client'

import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import { DataTableVoucher } from "./data-table"
import { useEffect, useState } from "react"
import ApiService from "@/lib/api-client/wrapper"
import { Voucher } from "@/lib/api-client"

export default function Page() {

  const [voucher, setVoucher] = useState<Voucher[]>([])

  let apiService = ApiService.getInstance()

  useEffect(() => {
    apiService.voucherApi.voucherFilteredGet().then(res => {
      setVoucher(res)
      console.log(res)
    })
  }, [])
  
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
             
              <DataTableVoucher data={voucher} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
