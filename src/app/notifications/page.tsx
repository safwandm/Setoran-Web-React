import { AppSidebar } from "@/components/app-sidebar"
import { IconArrowLeft } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

function NotificationItem({
  title,
  description,
  time,
  status = "info"
}: {
  title: string
  description: string
  time: string
  status?: "success" | "warning" | "error" | "info"
}) {
  const statusColors = {
    success: "text-green-500",
    warning: "text-yellow-500",
    error: "text-red-500",
    info: "text-blue-500"
  }

  return (
    <div className="flex items-start gap-4 rounded-lg border p-4">
      <div className={`mt-1 size-2 rounded-full ${statusColors[status]}`} />
      <div className="flex-1">
        <h4 className="text-sm font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
        <span className="text-xs text-muted-foreground">{time}</span>
      </div>
    </div>
  )
}

export default function NotificationsPage() {
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b">
          <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mx-2 data-[orientation=vertical]:h-4"
            />
            <Button variant="ghost" asChild className="mr-2">
              <a href="/dashboard">
                <IconArrowLeft className="h-4 w-4" />
              </a>
            </Button>
            <h1 className="text-base font-medium">Notifications</h1>
          </div>
        </header>

        {/* Main content area */}
        <div className="flex flex-col gap-6 p-4 lg:p-6">
          {/* Today's notifications */}
          <div>
            <h2 className="mb-4 text-lg font-semibold">Today</h2>
            <div className="space-y-3">
              <NotificationItem
                title="New User Registration"
                description="A new user has registered to the system"
                time="2 hours ago"
                status="success"
              />
              <NotificationItem
                title="Payment Received"
                description="Payment of $50 received from User123"
                time="5 hours ago"
                status="info"
              />
            </div>
          </div>

          <Separator />

          {/* Yesterday's notifications */}
          <div>
            <h2 className="mb-4 text-lg font-semibold">Yesterday</h2>
            <div className="space-y-3">
              <NotificationItem
                title="System Update"
                description="System maintenance scheduled for tomorrow"
                time="1 day ago"
                status="warning"
              />
              <NotificationItem
                title="Transaction Alert"
                description="Unusual activity detected on transaction #TRX8901"
                time="1 day ago"
                status="error"
              />
            </div>
          </div>

          <Separator />

          {/* Older notifications */}
          <div>
            <h2 className="mb-4 text-lg font-semibold">Older</h2>
            <div className="space-y-3">
              <NotificationItem
                title="Account Update"
                description="Your account settings have been updated"
                time="2 days ago"
                status="info"
              />
            </div>
          </div>
        </div>

        {/* Footer with actions */}
        <div className="sticky bottom-0 flex items-center justify-between border-t bg-background p-4">
          <Button variant="outline">Mark All as Read</Button>
          <Button variant="outline">Clear All</Button>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}