"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { IconBell } from "@tabler/icons-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

type NotificationStatus = "success" | "warning" | "error" | "info"
type BaseNotification = {
  id: number
  title: string
  description: string
  time: string
  status: NotificationStatus
}

type UserNotificationDetails = {
  type: "user"
  userId: string
  userName: string
  email: string
  registrationDate: string
  userType: string
}

type PaymentNotificationDetails = {
  type: "payment"
  transactionId: string
  amount: string
  paymentMethod: string
  customerName: string
  date: string
}

type MaintenanceNotificationDetails = {
  type: "maintenance"
  maintenanceId: string
  scheduledDate: string
  duration: string
  affectedServices: string[]
  priority: string
}

type Notification = BaseNotification & {
  details: UserNotificationDetails | PaymentNotificationDetails | MaintenanceNotificationDetails
}

function useIsMobile() {
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
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-muted-foreground">{time}</span>
          {onAction && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onAction}
              className="h-8 px-3 text-xs font-medium hover:bg-secondary/80 transition-colors"
            >
              View Details
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

import data from "./data.json"
import { DataTableVoucher } from "./data-table"
import dataNotification from "./dataNotification.json"

export default function Page() {
  const [isMobile, setIsMobile] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleViewDetails = (notificationId: number) => {
    const foundNotification = dataNotification.notifications.find(n => n.id === notificationId)
    if (foundNotification) {
      setSelectedNotification(foundNotification as Notification)
      setIsDetailsOpen(true)
    }
  }
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
         <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b">
          <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mx-2 data-[orientation=vertical]:h-4"
            />
            <h1 className="text-base font-medium">Vouchers</h1>
            <div className="ml-auto flex items-center gap-2">
              <Drawer direction={isMobile ? "bottom" : "right"}>
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
                        {dataNotification.notifications.map((notification) => (
                          <NotificationItem
                            key={notification.id}
                            title={notification.title}
                            description={notification.description}
                            time={notification.time}
                            status={notification.status as NotificationStatus}
                            onAction={() => handleViewDetails(notification.id)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <DrawerFooter>
                    {/* <Button variant="outline" className="w-full">
                      Mark All as Read
                    </Button> */}
                    <DrawerClose asChild>
                      <Button variant="outline">Close</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
             
              <DataTableVoucher data={data} />
            </div>
          </div>
        </div>
         <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedNotification?.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedNotification?.details && 
                Object.entries(selectedNotification.details).map(([key, value]) => (
                  <div key={key} className="flex flex-col gap-1">
                    <dt className="text-sm font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </dt>
                    <dd className="text-sm text-muted-foreground">
                      {Array.isArray(value) ? value.join(", ") : value.toString()}
                    </dd>
                  </div>
                ))
              }
            </div>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  )
}
