"use client";

import * as React from "react";
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
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  IconSearch,
  IconChevronLeft,
  IconBuildingWarehouse,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconDotsVertical,
  IconGripVertical,
  IconLayoutColumns,
  IconLoader,
  IconTrendingUp,
  IconUser,
  IconClipboard,
} from "@tabler/icons-react";
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
} from "@tanstack/react-table";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { toast } from "sonner";
import { z } from "zod";

import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApiMotorGetRequest, Motor, Pengguna, StatusMotor } from "@/lib/api-client";
import ApiService from "@/lib/api-client/wrapper";
import { formatMotorName, matchesSearch, translateEnum } from "@/lib/utils";
import { PenggunaInfoLink } from "@/app/users/[idPengguna]/page";
import { LoadingOverlay } from "@/components/loading-overlay";
import EditMotorDrawer from "@/components/forms/motor-drawer";

// Create a separate component for the drag handle
function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({
    id,
  });

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
  );
}

const columns: ColumnDef<Motor>[] = [
  {
    accessorKey: "idMotor",
    header: () => <div className="w-20 text-left">ID Motor</div>,
    cell: ({ row }) => {
      return (
        <EditMotorDrawer
          idMotor={row.original.idMotor!}
          buttonText={row.original.idMotor?.toString()}
        />
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "idMitra",
    header: () => <div className="w-30 text-left">Mitra Name</div>,
    cell: ({ row }) => {
      return (
        <div className="w-9">
            <PenggunaInfoLink
              idPengguna={row.original.mitra?.pengguna?.id!}
              buttonText={row.original.mitra?.pengguna?.nama!}
            />
        </div>
      );
    },
  },
  {
    accessorKey: "platNomor",
    header: () => <div className="w-30 text-left">Plat Nomor</div>,
    cell: ({ row }) => <div className="w-9">{row.original.platNomor}</div>,
  },
  {
    accessorKey: "nomorSTNK",
    header: () => <div className="w-30 text-left">Nomor STNK</div>,
    cell: ({ row }) => <div className="w-9">{row.original.nomorSTNK}</div>,
  },
  {
    accessorKey: "nomorBPKB",
    header: () => <div className="w-30 text-left">Nomor BPKB</div>,
    cell: ({ row }) => <div className="w-9">{row.original.nomorBPKB}</div>,
  },
  {
    accessorKey: "model",
    header: () => <div className="w-30 text-left">Model</div>,
    cell: ({ row }) => <div className="w-9">{row.original.model}</div>,
  },
  {
    accessorKey: "brand",
    header: () => <div className="w-30 text-left">Brand</div>,
    cell: ({ row }) => <div className="w-9">{row.original.brand}</div>,
  },
  {
    accessorKey: "tipe",
    header: () => <div className="w-30 text-left">Tipe</div>,
    cell: ({ row }) => <div className="w-9">{row.original.tipe}</div>,
  },
  {
    accessorKey: "tahun",
    header: () => <div className="w-30 text-left">Tahun</div>,
    cell: ({ row }) => <div className="w-9">{row.original.tahun}</div>,
  },
  {
    accessorKey: "transmisi",
    header: () => <div className="w-30 text-left">Transmisi</div>,
    cell: ({ row }) => <div className="w-9">{row.original.transmisi}</div>,
  },
  {
    accessorKey: "statusMotor",
    header: () => <div className="w-30 text-left">Status Motor</div>,
    cell: ({ row }) => (
      <Badge variant="outline" className="text-muted-foreground px-1.5">
        {row.original.statusMotor === StatusMotor.Tersedia ? (
          <IconCircleCheckFilled className="fill-green-500 dark:fill-blue-400" />
        ) : row.original.statusMotor === StatusMotor.Disewa ? (
          <IconUser className="" /> 
        ) : row.original.statusMotor === StatusMotor.DalamPerbaikan ? (
          <IconCircleCheckFilled className=" text-blue-500" />
        ) : row.original.statusMotor === StatusMotor.TidakTersedia ? (
          <IconCircleCheckFilled className=" text-red-500" />
        ) : row.original.statusMotor === StatusMotor.Diajukan ? (
          <IconClipboard className="" />
        ) : null}
        {translateEnum(row.original.statusMotor!)}
      </Badge>
    ),
  },
  {
    accessorKey: "hargaHarian",
    header: () => <div className="w-30 text-left">Harga Harian</div>,
    cell: ({ row }) => <div className="w-9">{row.original.hargaHarian}</div>,
  },
];

function DraggableRow({ row }: { row: Row<Motor> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.idMotor!,
  });

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
  );
}

export function TableMotors({
  hidePanel,
  motorQuery: initialQuery
} : {
  hidePanel?: boolean,
  motorQuery?: ApiMotorGetRequest
}) {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<Motor[]>([]);
  const [filter, setFilter] = React.useState({
    search: "",
    status: "All",
  });
  const motorQuery = initialQuery ?? {} // TODO: make this a state perhaps later
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 20,
  });
  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ idMotor }) => idMotor!) || [],
    [data]
  );

  const apiService = ApiService.getInstance();

  const filteredData: Motor[] = React.useMemo(() => {
    if (!filter.search && filter.status == "All") return data;

    const lowerSearch = filter.search.toLowerCase();

    return data.filter((row) => 
      (filter.status === "All" || row.statusMotor == filter.status) && Object.values(row).some((value) =>
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
    getRowId: (row) => row.idMotor!.toString(),
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
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }

  React.useEffect(() => {
    setLoading(true);
    apiService.motorApi.apiMotorGet({ ...motorQuery, withPengguna: true }).then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  return (
    <Tabs
      defaultValue="outline"
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-2">
          { hidePanel || <div className="relative">
            <IconSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search .."
              value={filter.search}
              onChange={(event) =>
                setFilter({ ...filter, search: event.target.value })
              }
              className="h-9 w-[150px] lg:w-[250px] pl-8"
            />
          </div>}
          <div className="relative">
            <Select 
                defaultValue="All"
                value={filter.status || ""} 
                onValueChange={(value) => setFilter({ ...filter, status: value })}
              >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={"All"}>Status: All</SelectItem>
                {Object.keys(StatusMotor).map((key, index) => (
                  <SelectItem key={StatusMotor[key]} value={StatusMotor[key]}>Status: {translateEnum(StatusMotor[key])}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
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
                          );
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
                    table.setPageSize(Number(value));
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
      <TabsContent
        value="past-performance"
        className="flex flex-col px-4 lg:px-6"
      >
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent value="key-personnel" className="flex flex-col px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent
        value="focus-documents"
        className="flex flex-col px-4 lg:px-6"
      >
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
    </Tabs>
  );
}

function TableCellViewer({ item }: { item: Motor }) {
  const isMobile = useIsMobile();

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {item.idMotor}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>Motor Details</DrawerTitle>
          <DrawerDescription>
            Displays complete information about the motorbike for rent.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Done</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
