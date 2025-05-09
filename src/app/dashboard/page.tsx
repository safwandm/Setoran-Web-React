import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaDashboard } from "./chart-area-dashboard"
// import { DataTableDashboard } from "./data-table-dashboard"
import { SectionCardsDasboard } from "./section-cards-dashboard"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import data from "./data.json"
import { DataTableDashboard } from "./data-table-dashboard"

export default function Page() {
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
              <SectionCardsDasboard />
              <div className="px-4 lg:px-6">
                <ChartAreaDashboard />
              </div>
              <DataTableDashboard data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}