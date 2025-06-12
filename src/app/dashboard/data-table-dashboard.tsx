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

export function DataTableDashboard() {

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