"use client"

import * as React from "react"
import { z } from "zod"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Separator } from "@/components/ui/separator"
import {
  IconBan,
  IconClock2,
  IconArrowsCross,
  IconCircle,
  IconCircleCheckFilled,
  IconDotsVertical,
  IconGripVertical,
  IconLoader,
} from "@tabler/icons-react"
import type { ColumnDef } from "@tanstack/react-table"
import { useSortable } from "@dnd-kit/sortable"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Define the schema
export const mitraSchema = z.object({
  id: z.number(),
  mitraId: z.string(),
  mitraName: z.string(), 
  status: z.string(),
  registered: z.string(),
  available: z.string(),
  payment: z.string(),
})

export type MitraType = z.infer<typeof mitraSchema>

// Create DragHandle component
function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({
    id,
  })

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}

// Define columns
export const mitraColumns: ColumnDef<MitraType>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    accessorKey: "mitraId",
    header: "Mitra ID",
    cell: ({ row }) => {
      return <TableCellViewer item={row.original} />
    },
     enableHiding: false,
    enableColumnFilter: true,
    filterFn: 'includesString'
  },
  {
    accessorKey: "mitraName", 
    header: "Name",
    cell: ({ row }) => <div>{row.original.mitraName}</div>,
    enableColumnFilter: true,
    filterFn: 'includesString'
  },
  {
    accessorKey: "status",
    header: () => <div className="w-0.5 text-left">Status</div>,
    cell: ({ row }) => (
      <Badge variant="outline" className="text-muted-foreground px-1.5">
        {row.original.status === "Active" ? (
          <IconCircle className="fill-green-500" />
        ) : (
          <IconBan className="dark:fill-red-400" />
        )}
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "registered",
    header: () => <div className="w-full text-left">Registration</div>,
    cell: ({ row }) => (
      <div className="w-9">
        {row.original.registered}
      </div>
    ),
  },
  {
    accessorKey: "available",
    header: () => <div className="w-30 text-left">Available</div>,
    cell: ({ row }) => (
      <div className="w-9">
          {row.original.available}
      </div>
    ),
  },
  {
    accessorKey: "payment",
    header: () => <div className="text-left">Payment</div>,
    cell: ({ row }) => (
      <Badge variant="outline" className="text-muted-foreground px-1.5">
        {row.original.payment === "Paid" ? (
          <IconCircleCheckFilled className="fill-blue-500 dark:fill-blue-400" />
        ) : row.original.payment === "Waiting for Payment" ? (
          <IconClock2 className="" />
        ) : row.original.payment === "Failed" ? (
          <IconArrowsCross className=" text-muted-foreground" />
        ):
        <IconLoader className=" text-muted-foreground" />
        }
        {row.original.payment}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Make a copy</DropdownMenuItem>
          <DropdownMenuItem>Favorite</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

function TableCellViewer({ item }: { item: MitraType }) {
  const isMobile = useIsMobile()
  
  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {item.mitraId} {/* Ganti userId dengan mitraId */}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>Profile Details</DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          {!isMobile && (
            <>
              <Separator />
              <div className="grid gap-4">
                <div className="flex gap-2 leading-none font-medium">
                  ID: {item.mitraId}
                </div>
                <div className="flex gap-2 leading-none font-medium">
                  Name: {item.mitraName}
                </div>
                <div className="flex gap-2 leading-none font-medium">
                  Status: {item.status}
                </div>
                <div className="flex gap-2 leading-none font-medium">
                  Registration: {item.registered}
                </div>
                <div className="flex gap-2 leading-none font-medium">
                  Available: {item.available}
                </div>
                <div className="flex gap-2 leading-none font-medium">
                  Payment: {item.payment}
                </div>
              </div>
              <Separator />
            </>
          )}
        </div>
      <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Done</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}