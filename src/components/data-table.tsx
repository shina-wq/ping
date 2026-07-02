import * as React from "react"

import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export type DataTableColumn<T> = {
  id: string
  header: React.ReactNode
  cell: (row: T, index: number) => React.ReactNode
  align?: "left" | "center" | "right"
  headerClassName?: string
  cellClassName?: string
  hideBelow?: "sm" | "md" | "lg"
  /** Custom skeleton cell while isLoading is true. Defaults to a text-sized bar. */
  skeleton?: React.ReactNode
}

export type DataTableProps<T> = {
  columns: DataTableColumn<T>[]
  data: T[]
  getRowId: (row: T, index: number) => string
  isLoading?: boolean
  skeletonRowCount?: number
  error?: React.ReactNode
  emptyMessage?: React.ReactNode
  onRowClick?: (row: T) => void
  rowClassName?: (row: T) => string | undefined
  className?: string
}

const alignClass = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const

const hideBelowClass = {
  sm: "hidden sm:table-cell",
  md: "hidden md:table-cell",
  lg: "hidden lg:table-cell",
} as const

export function DataTable<T>({
  columns,
  data,
  getRowId,
  isLoading = false,
  skeletonRowCount = 5,
  error,
  emptyMessage = "No results found.",
  onRowClick,
  rowClassName,
  className,
}: DataTableProps<T>) {
  const colSpan = columns.length

  return (
    <Table className={className}>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          {columns.map((col) => (
            <TableHead
              key={col.id}
              className={cn(
                alignClass[col.align ?? "left"],
                col.hideBelow && hideBelowClass[col.hideBelow],
                col.headerClassName
              )}
            >
              {col.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {isLoading ? (
          Array.from({ length: skeletonRowCount }).map((_, i) => (
            <TableRow key={`skeleton-${i}`} className="hover:bg-transparent">
              {columns.map((col) => (
                <TableCell
                  key={col.id}
                  className={cn(
                    alignClass[col.align ?? "left"],
                    col.hideBelow && hideBelowClass[col.hideBelow]
                  )}
                >
                  {col.skeleton ?? (
                    <Skeleton
                      className={cn(
                        "h-4 w-24",
                        col.align === "right" && "ml-auto",
                        col.align === "center" && "mx-auto"
                      )}
                    />
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : error ? (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={colSpan} className="py-10 text-center text-sm text-muted-foreground">
              {error}
            </TableCell>
          </TableRow>
        ) : !data.length ? (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={colSpan} className="py-10 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </TableCell>
          </TableRow>
        ) : (
          data.map((row, index) => (
            <TableRow
              key={getRowId(row, index)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn(onRowClick && "cursor-pointer", rowClassName?.(row))}
            >
              {columns.map((col) => (
                <TableCell
                  key={col.id}
                  className={cn(
                    alignClass[col.align ?? "left"],
                    col.hideBelow && hideBelowClass[col.hideBelow],
                    col.cellClassName
                  )}
                >
                  {col.cell(row, index)}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}