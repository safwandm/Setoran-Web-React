"use client"

import * as React from "react"
import { format, parseISO } from "date-fns"
import { DateRange } from "react-day-picker"

interface DatePickerWithRangeProps extends React.HTMLAttributes<HTMLDivElement> {
  date: DateRange | undefined
  setDate: (range: DateRange | undefined) => void
}

export function DatePickerWithRange({
  className,
  date,
  setDate,
}: DatePickerWithRangeProps) {
  const handleChange = (type: "from" | "to") => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selected = e.target.value ? parseISO(e.target.value) : undefined
    if (type === "from") {
      setDate({ from: selected, to: date?.to })
    } else {
      setDate({ from: date?.from, to: selected })
    }
  }

  return (
    <div className={className}>
      <input
        type="date"
        value={date?.from ? format(date.from, "yyyy-MM-dd") : ""}
        onChange={handleChange("from")}
        max={date?.to ? format(date.to, "yyyy-MM-dd") : undefined}
        className="border px-2 py-1 rounded w-[160px]"
      />
      <span className="mx-2">-</span>
      <input
        type="date"
        value={date?.to ? format(date.to, "yyyy-MM-dd") : ""}
        onChange={handleChange("to")}
        min={date?.from ? format(date.from, "yyyy-MM-dd") : undefined}
        className="border px-2 py-1 rounded w-[160px]"
      />
    </div>
  )
}
