"use client"

import * as React from "react"
import profileUser from '@/public/profileUser.png'
import { mitraColumns } from './mitra-table'
import type { MitraType } from './mitra-table.tsx'
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  IconBan,
  IconArrowsCross,
  IconSearch,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircle,
  IconCircleCheckFilled,
  IconDotsVertical,
  IconGripVertical,
  IconLayoutColumns,
  IconLoader,
  IconTrendingUp,
  IconCircleOff,
} from "@tabler/icons-react"
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { toast } from "sonner"
import { z } from "zod"

import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { get } from "http"
import { TableMitra } from "../mitra/table"
import { DataTableTransaction } from "../transactions/data-table-transactions"
import { TableMotors } from "../motors/table"

export const schema = z.object({
  id: z.number(),
  userId: z.string(),
  name: z.string(),
  status: z.string(),
  registration: z.string(),
  verification: z.string(),
  transaction: z.string(),
})

// const mitraSchema = z.object({
//   id: z.number(),
//   userId: z.string(),
//   name: z.string(),
//   status: z.string(),
//   registration: z.string(), 
//   verification: z.string(),
//   transaction: z.string(),
// })

// Create a separate component for the drag handle
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

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "userId",
    header: "User ID",
    cell: ({ row }) => {
      return <TableCellViewer item={row.original} />
    },
    enableHiding: false,
    enableColumnFilter: true,
    filterFn: 'includesString'
  },
  {
    accessorKey: "name",
    header: "Name",
  
    cell: ({ row }) => (
      <div className="w-">
          {row.original.name}
      </div>
    ),
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
        ) : row.original.status === "Blocked" ? (
          <IconBan className="dark:fill-red-400" />
        ) : (
          <IconCircle/>
        )}
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "registration",
    header: () => <div className="w-full text-left">Registration </div>,
    cell: ({ row }) => (
      <div className="w-9">
          {row.original.registration}
      </div>
    ),
  },
  {
    accessorKey: "verification",
    header: () => <div className="w-10 text-left">Verification</div>,
    cell: ({ row }) => (
      <Badge variant="outline" className="text-muted-foreground px-1.5">
        {row.original.verification === "Verified" ? (
          <IconCircleCheckFilled className="fill-blue-500 dark:fill-blue-400" />
        ) : row.original.verification === "Canceled" ? (
          <IconArrowsCross className="fill-red-500 dark:fill-red-400" />
        ) : (
          <IconLoader className="animate-spin text-muted-foreground" />
        )}
        {row.original.verification}
      </Badge>
    ),
  },
  {
    accessorKey: "transaction",
    header: () => <div className="text-left">Transaction</div>,
    cell: ({ row }) => (
      <div className="w-4">
          {row.original.transaction}
      </div>
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

function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> |Row<MitraType>  }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  const renderCell = (cell: any) => {
    // Handle different schema types
    if ("mitraId" in row.original) {
      // This is a mitra row
      return flexRender(cell.column.columnDef.cell, cell.getContext())
    } else {
      // This is a user row
      return flexRender(cell.column.columnDef.cell, cell.getContext())
    }
  }

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {renderCell(cell)}
        </TableCell>
      ))}
    </TableRow>
  )
}

export function DataTableDashboard({
  data: initialData,
  mitraData: initialMitraData,
}: {
  data: z.infer<typeof schema>[]
  // mitraData: z.infer<typeof mitraSchema>[]
  mitraData: MitraType[]
}) {
  const [mitraData, setMitraData] = React.useState(() => initialMitraData)
  const [mitraRowSelection, setMitraRowSelection] = React.useState({})
  const [mitraColumnVisibility, setMitraColumnVisibility] = React.useState<VisibilityState>({})
  const [mitraColumnFilters, setMitraColumnFilters] = React.useState<ColumnFiltersState>([])
  const [mitraSorting, setMitraSorting] = React.useState<SortingState>([])
  const [mitraPagination, setMitraPagination] = React.useState({
    pageIndex: 0,
    pageSize: 20,
  })

  const [data, setData] = React.useState(() => initialData)
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 20,
  })
  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data]
  )

  const mitraDataIds = React.useMemo<UniqueIdentifier[]>(
    () => mitraData?.map(({ id }) => id) || [],
    [mitraData]
  )

  const mitraTable = useReactTable({
    data: mitraData,
    columns: mitraColumns,
    state: {
      sorting: mitraSorting,
      columnVisibility: mitraColumnVisibility,
      rowSelection: mitraRowSelection,
      columnFilters: mitraColumnFilters,
      pagination: mitraPagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setMitraRowSelection, 
    onSortingChange: setMitraSorting, 
    onColumnFiltersChange: setMitraColumnFilters, 
    onColumnVisibilityChange: setMitraColumnVisibility, 
    onPaginationChange: setMitraPagination, 
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })


  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      if (event.active.data.current?.sortable.containerId === "users") {
        setData((data) => {
          const oldIndex = dataIds.indexOf(active.id)
          const newIndex = dataIds.indexOf(over.id)
          return arrayMove(data, oldIndex, newIndex)
        })
      } else {
        setMitraData((data) => {
          const oldIndex = mitraDataIds.indexOf(active.id)
          const newIndex = mitraDataIds.indexOf(over.id)
          return arrayMove(data, oldIndex, newIndex)
        })
      }
    }
  }

  return (
    <Tabs
      defaultValue="transaksi"
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <Select defaultValue="transaksi">
          <SelectTrigger
            className="flex w-fit @4xl/main:hidden"
            size="sm"
            id="view-selector"
          >
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="transaksi">Transaction</SelectItem>
            <SelectItem value="mitra">Mitra</SelectItem>
            <SelectItem value="motor">Motor</SelectItem>
          </SelectContent>
        </Select>
        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
          <TabsTrigger value="transaksi">Transaction</TabsTrigger>
          <TabsTrigger value="mitra">
            Mitra 
          </TabsTrigger>
          <TabsTrigger value="motor">
            Motor 
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent
          value="transaksi"
          className="relative flex flex-col gap-4 ml-[-24px] overflow-auto lg:px-6"
        >
          <DataTableTransaction />
        </TabsContent>
      <TabsContent
        value="mitra"
        className="relative flex flex-col gap-4 ml-[-24px] overflow-auto lg:px-6"
      >

        <TableMitra />
      </TabsContent>
      <TabsContent
        value="motor"
        className="relative flex flex-col gap-4 ml-[-24px] overflow-auto lg:px-6"
      >

        <TableMotors />
      </TabsContent>
    </Tabs>
  )
}

function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
  const isMobile = useIsMobile()

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {item.userId}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>Profile Details</DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          {!isMobile && (
            <>
             <Separator />  {/* untuk membuat garis */}
              <div className="grid gap-4">
                <div className="flex gap-2 leading-none font-medium">
                  {/* Trending up by 5.2% this month{" "}
                  <IconTrendingUp className="size-4" /> yes */}
                  ID: {item.userId}
                </div>
                <div className="flex gap-2 leading-none font-medium">
                  Name: {item.name}
                </div>
                <div className="flex gap-2 leading-none font-medium">
                  Status: {item.status}
                </div>
                <div className="flex gap-2 leading-none font-medium">
                  Registration: {item.registration}
                </div>
                <div className="flex gap-2 leading-none font-medium">
                  Verification: {item.verification}
                </div>
                <div className="flex gap-2 leading-none font-medium">
                  Transaction: {item.transaction}
                </div>
                {/* <div className="text-muted-foreground">
                  Showing total visitors for the last 6 months. This is just
                  some random text to test the layout. It spans multiple lines
                  and should wrap around.
                </div> */}
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