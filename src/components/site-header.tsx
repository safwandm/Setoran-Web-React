"use client"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { IconBell } from "@tabler/icons-react"
// import { useIsMobile } from "@/hooks/use-mobile"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

import { useEffect, useState } from "react"
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}


function NotificationItem({
  title,
  description,
  time,
  status = "info",
  onAction
}: {
  title: string
  description: string
  time: string
  status?: "success" | "warning" | "error" | "info"
  onAction?: () => void
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
        {onAction && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onAction}
              className="h-8 px-2"
            >
              View Details
            </Button>
          )}
      </div>
    </div>
  )
}

export function SiteHeader() {
   const isMobile = useIsMobile()
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Dashboard</h1>
        <div className="ml-auto flex items-center gap-2">
          <Drawer direction={isMobile? "bottom" : "right"} >
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <IconBell className="h-5 w-5" />
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Notifications</DrawerTitle>
              </DrawerHeader>
              <div className="flex flex-col gap-4 overflow-y-auto px-4">
                <div>
                  <h3 className="mb-2 font-semibold text-sm">Today</h3>
                  <div className="space-y-3">
                    <NotificationItem
                      title="New User Registration"
                      description="A new user has registered to the system"
                      time="2 hours ago"
                      status="success"
                      onAction={() => {
                        console.log("View details clicked")
                      }}
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

                <div>
                  <h3 className="mb-2 font-semibold text-sm">Yesterday</h3>
                  <div className="space-y-3">
                    <NotificationItem
                      title="System Update"
                      description="System maintenance scheduled for tomorrow"
                      time="1 day ago"
                      status="warning"
                    />
                  </div>
                </div>
              </div>

              <DrawerFooter>
                <Button variant="outline" className="w-full">
                  Mark All as Read
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline">Close</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  )
}

