"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon, RotateCcw } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export function FiltersBar() {
  const [dateRange, setDateRange] = React.useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Filters:</span>
      </div>

      {/* Date Range Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-64 justify-start bg-secondary text-left font-normal",
              !dateRange.from && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "MMM d, yyyy")} - {format(dateRange.to, "MMM d, yyyy")}
                </>
              ) : (
                format(dateRange.from, "MMM d, yyyy")
              )
            ) : (
              "Select date range"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange.from}
            selected={{ from: dateRange.from, to: dateRange.to }}
            onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      <div className="h-6 w-px bg-border" />

      <Select>
        <SelectTrigger className="w-40 bg-secondary">
          <SelectValue placeholder="Document Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="receipts">Receipts</SelectItem>
          <SelectItem value="delivery">Delivery</SelectItem>
          <SelectItem value="internal">Internal Transfer</SelectItem>
          <SelectItem value="adjustments">Adjustments</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="w-32 bg-secondary">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="waiting">Waiting</SelectItem>
          <SelectItem value="ready">Ready</SelectItem>
          <SelectItem value="done">Done</SelectItem>
          <SelectItem value="canceled">Canceled</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="w-40 bg-secondary">
          <SelectValue placeholder="Warehouse" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Locations</SelectItem>
          <SelectItem value="wh-a">Warehouse A</SelectItem>
          <SelectItem value="wh-b">Warehouse B</SelectItem>
          <SelectItem value="wh-c">Warehouse C</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="w-40 bg-secondary">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="electronics">Electronics</SelectItem>
          <SelectItem value="clothing">Clothing</SelectItem>
          <SelectItem value="furniture">Furniture</SelectItem>
          <SelectItem value="food">Food & Beverage</SelectItem>
        </SelectContent>
      </Select>

      <Button 
        variant="ghost" 
        size="sm" 
        className="ml-auto text-muted-foreground hover:text-foreground"
        onClick={() => setDateRange({ from: undefined, to: undefined })}
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        Reset
      </Button>
    </div>
  )
}
