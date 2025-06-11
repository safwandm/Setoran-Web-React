"use client"

import * as React from "react"
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
  IconArrowsCross,
  IconSearch,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconDotsVertical,
  IconGripVertical,
  IconLoader,
  IconCross,
  IconX,
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
import { z } from "zod"

import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
} from "@/components/ui/tabs"
import { ApiTransaksiGetRequest, StatusTransaksi, Transaksi } from "@/lib/api-client"
import { formatDateToLongDate, formatFilterString, formatMotorName, formatPrice, matchesSearch } from "@/lib/utils"
import ApiService from "@/lib/api-client/wrapper"
import EditTransactionDrawer from "@/components/forms/transaction-drawer"
import { PenggunaInfoLink } from "@/app/users/[idPengguna]/page"
import EditMotorDrawer from "@/components/forms/motor-drawer"
import { LoadingOverlay } from "@/components/loading-overlay"

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

function DraggableRow({ row }: { row: Row<Transaksi> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.idTransaksi!,
  })

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
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

export function DataTableTransaction({
  hidePanel,
  initQuery
} : {
  hidePanel?: boolean,
  initQuery?: ApiTransaksiGetRequest
}) {
  const [loading, setLoading] = React.useState(true)
  const [data, setData] = React.useState<Transaksi[]>([])
  const transactionQuery = initQuery ?? {}
  const [filter, setFilter] = React.useState({
    search: "",
    status: "All"
  })

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
    () => data?.map(({ idTransaksi }) => idTransaksi!) || [],
    [data]
  )

  const refresh = () => {
    setLoading(true)
    apiService.transaksiApi.apiTransaksiGet(transactionQuery).then(res => {
      setData(res)
      setLoading(false)
    })
  }

  const columns: ColumnDef<Transaksi>[] = [
    {
      accessorKey: "transactionId",
      header: () => <div className="w-30 text-left">Transaction ID</div>,
      cell: ({ row }) => {
        return <EditTransactionDrawer idTransaksi={row.original.idTransaksi!} />
      },
      enableHiding: false,
      enableColumnFilter: true,
      filterFn: "includesString",
    },
    {
      accessorKey: "userName",
      header: () => <div className="w-30 text-left">User Name</div>,
    
      cell: ({ row }) => (
        <div className="w-4">
            <PenggunaInfoLink idPengguna={row.original.pelanggan!.idPengguna!} buttonText={row.original.pelanggan!.pengguna!.nama!} />
        </div>
      ),
    },
    {
      accessorKey: "motorName",
      header: () => <div className="w-30 text-left">Motor Name</div>,
      cell: ({ row }) => (
        <div className="w-8">
            <EditMotorDrawer idMotor={row.original.motor!.idMotor!} buttonText={formatMotorName(row.original.motor!)} editing={false} />
        </div>
      ),
    },
    {
      accessorKey: "rentalDate",
      header: () => <div className="w-30 text-left">Rental Date</div>,
      cell: ({ row }) => (
        <div className="w-8">
            {formatDateToLongDate(row.original.tanggalMulai!)}
        </div>
      ),
    },
    {
      accessorKey: "returnDate",
      header: () => <div className="w-30 text-left">Return Date</div>,
      cell: ({ row }) => (
        <div className="w-8">
            {formatDateToLongDate(row.original.tanggalSelesai!)}
        </div>
      ),
    },
        {
      accessorKey: "totalHarga",
      header: () => <div className="w-30 text-left">Total Price</div>,
      cell: ({ row }) => (
        <div className="w-8">
            {formatPrice(row.original.totalHarga!)}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: () => <div className="w-full text text-left">Status</div>,
      cell: ({ row }) => (
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.status === StatusTransaksi.Dibuat ? (
            <IconCircleCheckFilled className="" />
          ) : row.original.status === StatusTransaksi.Berlangsung ? (
            <IconLoader className="animate-spin" />
          ) : row.original.status === StatusTransaksi.Batal ? (
            <IconX className="text-muted-foreground fill-red-400" />
          ) : (
            <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
          )}
          {row.original.status}
        </Badge>
      ),
    },
  ]

  const filteredData: Transaksi[] = React.useMemo(() => {
    if (!filter.search && filter.status === "All") return data;
  
    const lowerSearch = filter.search.toLowerCase();
  
    return data.filter((row) => 
      (filter.status === "All" || row.status == filter.status) && Object.values(row).some((value) =>
        matchesSearch(value, lowerSearch)
      )
    );
  }, [data, filter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.idTransaksi!.toString(),
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

  const apiService = ApiService.getInstance()

  React.useEffect(() => {
    refresh()
  }, [])

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(data, oldIndex, newIndex)
      })
    }
  }

  return (
    <Tabs
      defaultValue="outline"
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        { hidePanel || <div className="flex items-center gap-2">
              <div className="relative">
                <IconSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search .."
                  value={
                    filter.search
                  }
                  onChange={(event) =>
                    setFilter({ ...filter, search: event.target.value })
                  }
                  className="h-9 w-[150px] lg:w-[250px] pl-8"
                />
              </div>
              <Select 
                defaultValue="All"
                value={filter.status ?? ""} 
                onValueChange={(value) => setFilter({ ...filter, status: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"All"}>Status: All</SelectItem>
                  {Object.keys(StatusTransaksi).map((key, index) => (
                    <SelectItem key={StatusTransaksi[key]} value={StatusTransaksi[key]}>Status: {StatusTransaksi[key]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
        </div>}
      </div>
      <TabsContent
        value="outline"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <LoadingOverlay loading={loading}>
            <DndContext
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis]}
          
              onDragEnd={handleDragEnd}
              sensors={sensors}
              id={sortableId}
            >
              <Table>
                <TableHeader className="bg-muted sticky top-0 z-10">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id} colSpan={header.colSpan}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        )
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody className="**:data-[slot=table-cell]:first:w-8">
                  {table.getRowModel().rows?.length ? (
                    <SortableContext
                      items={dataIds}
                      strategy={verticalListSortingStrategy}
                    >
                      {table.getRowModel().rows.map((row) => (
                        <DraggableRow key={row.id} row={row} />
                      ))}
                    </SortableContext>
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </DndContext>
          </LoadingOverlay>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}
function TableCellViewer({ item }: { item: Transaksi }) {
  const isMobile = useIsMobile()

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {item.idTransaksi}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>Transaction Detail</DrawerTitle>
          <DrawerDescription>
           Displays the history and status of motorbike rentals by customers.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Done</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
