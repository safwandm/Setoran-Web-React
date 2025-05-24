"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { IconBell } from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { GetNotifikasDTO, Notifikasi, TargetNavigasi } from "@/lib/api-client";
import { formatDateToLongDate } from "@/lib/utils";
import ApiService from "@/lib/api-client/wrapper";
import { useRouter } from "next/router";
import Link from "next/link";
import { LoadingOverlayContext } from "./loading-overlay";

function NotificationItem({
  title,
  description,
  time,
  status = "info",
  onAction,
}: {
  title: string;
  description: string;
  time: Date;
  status?: "success" | "warning" | "error" | "info";
  onAction?: () => void;
}) {
  const statusColors = {
    success: "text-green-500",
    warning: "text-yellow-500",
    error: "text-red-500",
    info: "text-blue-500",
  };

  return (
    <div className="flex items-start gap-4 rounded-lg border p-4">
      <div className={`mt-1 size-2 rounded-full ${statusColors[status]}`} />
      <div className="flex-1">
        <h4 className="text-sm font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-muted-foreground">
            {time !== undefined ? formatDateToLongDate(time) : "-"}
          </span>
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
  );
}

export default function Layout({
  children,
  noLayout = [],
}: {
  children: any;
  noLayout: string[];
}) {
  const pathname = usePathname();
  const isPublic = noLayout.includes(pathname);

  if (isPublic) {
    return <>{children}</>;
  }

  const [notifications, setNotifications] = useState<GetNotifikasDTO[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<Notifikasi | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleViewDetails = (notificationId: number) => {
    const foundNotification = notifications.find(
      (n) => n.idNotifikasi === notificationId
    );
    if (foundNotification) {
      setSelectedNotification(foundNotification);
      setIsDetailsOpen(true);
    }
  };

  const apiService = ApiService.getInstance();

  useEffect(() => {
    apiService.notifikasiApi.notifikasiGetPerUserGet().then((res) => {
      setNotifications(res);
    });
  }, []);
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
            <h1 className="text-base font-medium">Motors</h1>
            <div className="ml-auto flex items-center gap-2">
              <Drawer direction={isMobile ? "bottom" : "right"}>
                <DrawerTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hidden sm:flex"
                  >
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
                        {notifications.map((notification) => (
                          <NotificationItem
                            key={notification.idNotifikasi!}
                            title={notification.judul!}
                            description={notification.deskripsi!}
                            time={notification.waktuNotifikasi!}
                            // status={notification.status as NotificationStatus}
                            onAction={() =>
                              handleViewDetails(notification.idNotifikasi!)
                            }
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
        <LoadingOverlayContext>
          {children}
        </LoadingOverlayContext>
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedNotification?.judul}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* {selectedNotification?.details &&
                Object.entries(selectedNotification.details).map(
                  ([key, value]) => (
                    <div key={key} className="flex flex-col gap-1">
                      <dt className="text-sm font-medium capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </dt>
                      <dd className="text-sm text-muted-foreground">
                        {Array.isArray(value)
                          ? value.join(", ")
                          : value.toString()}
                      </dd>
                    </div>
                  )
                )} */}
              <div className="flex flex-col gap-1">
                <dt className="text-sm font-medium capitalize">Title</dt>
                <dd className="text-sm text-muted-foreground">
                  {selectedNotification?.judul}
                </dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-sm font-medium capitalize">Description</dt>
                <dd className="text-sm text-muted-foreground">
                  {selectedNotification?.deskripsi}
                </dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-sm font-medium capitalize">Notification Date</dt>
                <dd className="text-sm text-muted-foreground">
                  {selectedNotification?.waktuNotifikasi !== undefined ? formatDateToLongDate(selectedNotification?.waktuNotifikasi) : "-"}
                </dd>
              </div>
              {selectedNotification?.navigasi == TargetNavigasi.Transaksi ? (
                <div className="flex flex-col gap-1">
                  <dt className="text-sm font-medium capitalize">
                    Transaction Id
                  </dt>
                  {/* <dd className="text-sm text-muted-foreground">
                    {selectedNotification?.deskripsi}
                  </dd> */}
                  <Link href={`/transactions?idTransaksi=${selectedNotification.dataNavigasi!.idTransaksi}`} onClick={() => window.location.reload()}>
                    <Button variant="link" className="text-foreground w-fit px-0 text-left">
                      {selectedNotification.dataNavigasi!.idTransaksi}
                    </Button>
                  </Link>
                </div>
              ) : (
                ""
              )}
            </div>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  );
}
