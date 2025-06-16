"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  ChevronDown,
  Search,
  Filter,
  Download,
  RefreshCw,
  Plus,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface EnhancedDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
  searchPlaceholder?: string
  showColumnToggle?: boolean
  showPagination?: boolean
  showToolbar?: boolean
  pageSize?: number
  title?: string
  description?: string
  onAdd?: () => void
  onRefresh?: () => void
  onExport?: () => void
  loading?: boolean
  className?: string
}

export function EnhancedDataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Search...",
  showColumnToggle = true,
  showPagination = true,
  showToolbar = true,
  pageSize = 10,
  title,
  description,
  onAdd,
  onRefresh,
  onExport,
  loading = false,
  className,
}: EnhancedDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    initialState: {
      pagination: {
        pageSize,
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const selectedRows = table.getFilteredSelectedRowModel().rows.length
  const totalRows = table.getFilteredRowModel().rows.length

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Header Section */}
      {(title || description) && (
        <div className="space-y-2">
          {title && (
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {title}
              </h2>
              {selectedRows > 0 && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {selectedRows} selected
                </Badge>
              )}
            </div>
          )}
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
      )}

      {/* Toolbar */}
      {showToolbar && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center space-x-2">
            {searchKey && (
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={searchPlaceholder}
                  value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
                  onChange={(event) => table.getColumn(searchKey)?.setFilterValue(event.target.value)}
                  className="pl-10 border-2 focus:border-blue-500 transition-colors"
                />
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              className="h-10 border-2 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={loading}
                className="h-10 border-2 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-950 transition-colors"
              >
                <RefreshCw className={cn("mr-2 h-4 w-4", loading && "animate-spin")} />
                Refresh
              </Button>
            )}

            {onExport && (
              <Button
                variant="outline"
                size="sm"
                onClick={onExport}
                className="h-10 border-2 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950 transition-colors"
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            )}

            {showColumnToggle && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 border-2 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950 transition-colors"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) => column.toggleVisibility(!!value)}
                        >
                          <div className="flex items-center">
                            {column.getIsVisible() ? (
                              <Eye className="mr-2 h-4 w-4 text-green-600" />
                            ) : (
                              <EyeOff className="mr-2 h-4 w-4 text-gray-400" />
                            )}
                            {column.id}
                          </div>
                        </DropdownMenuCheckboxItem>
                      )
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {onAdd && (
              <Button
                size="sm"
                onClick={onAdd}
                className="h-10 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border-2 border-gray-200 dark:border-gray-800 overflow-hidden shadow-lg">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-800 dark:hover:to-gray-700 transition-all duration-200"
              >
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort()
                  const sorted = header.column.getIsSorted()

                  return (
                    <TableHead key={header.id} className="font-semibold text-gray-900 dark:text-gray-100">
                      {header.isPlaceholder ? null : (
                        <div className="flex items-center space-x-2">
                          {canSort ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="-ml-3 h-8 data-[state=open]:bg-accent hover:bg-gray-200 dark:hover:bg-gray-700"
                              onClick={() => header.column.toggleSorting(sorted === "asc")}
                            >
                              <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                              {sorted === "desc" ? (
                                <ArrowDown className="ml-2 h-4 w-4 text-blue-600" />
                              ) : sorted === "asc" ? (
                                <ArrowUp className="ml-2 h-4 w-4 text-blue-600" />
                              ) : (
                                <ArrowUpDown className="ml-2 h-4 w-4 text-gray-400" />
                              )}
                            </Button>
                          ) : (
                            flexRender(header.column.columnDef.header, header.getContext())
                          )}
                        </div>
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    "hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950 dark:hover:to-purple-950 transition-all duration-200 cursor-pointer",
                    row.getIsSelected() &&
                      "bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900",
                    index % 2 === 0 && "bg-gray-50/50 dark:bg-gray-900/50",
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="text-gray-400 text-lg">📊</div>
                    <p className="text-muted-foreground">No results found.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {showPagination && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>
              Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
              {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, totalRows)}{" "}
              of {totalRows} results
            </span>
            {selectedRows > 0 && (
              <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
                {selectedRows} selected
              </Badge>
            )}
          </div>

          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
                className="h-8 w-[70px] rounded-md border-2 border-input bg-background px-3 py-1 text-sm focus:border-blue-500 transition-colors"
              >
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex hover:bg-blue-50 hover:border-blue-300 transition-colors"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                {"<<"}
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                {"<"}
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                {">"}
              </Button>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex hover:bg-blue-50 hover:border-blue-300 transition-colors"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                {">>"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
