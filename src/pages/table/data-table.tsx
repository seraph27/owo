'use client'
export const prerender = false
import * as React from 'react'
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

import DataTableFacetedFilter from './data-table-faceted-filter'
import { resources } from './data'
import { DataTablePagination } from './pagination'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowUpDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { MixerHorizontalIcon, Cross2Icon } from '@radix-ui/react-icons'

interface DataTableProps<TData, TValue> {
  data: TData[]
}

export type Problem = {
  date: string
  problems: string
  tags: string
  isContest: boolean
  resources: string
}

export function DataTable<TData, TValue>({
  data,
}: DataTableProps<TData, TValue>) {
  const columns: ColumnDef<Problem, any>[] = [
    {
      accessorKey: 'date',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return <div className="w-26 flex p-2">{row.original.date}</div>
      },
      enableHiding: false,
    },
    {
      accessorKey: 'problems',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Problems
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return <div className="w-64 break-all p-2">{row.original.problems}</div>
      },
      filterFn: 'includesString',
      enableHiding: false,
    },
    {
      accessorKey: 'tags',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Tags
            <ArrowUpDown className="ml-2 h-4 w-4 p-2" />
          </Button>
        )
      },
      filterFn: 'includesString',
      cell: ({ row }) => {
        const tags = row.original.tags.split(',')
        return (
          <div className="flex w-48 flex-wrap gap-1">
            {tags[0] !== ''
              ? tags.map((tag, index) => (
                  <Badge
                    key={index}
                    className="text-nowrap"
                    variant="secondary"
                  >
                    {tag}
                  </Badge>
                ))
              : null}
          </div>
        )
      },
    },
    {
      accessorKey: 'resources',
      header: 'Resources',
      filterFn: 'includesString',
    },
  ]

  const [sorting, setSorting] = React.useState<SortingState>([
    { id: 'date', desc: true },
  ])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  React.useEffect(() => {
    const columnToHide = table.getColumn('resources')
    if (columnToHide) {
      columnToHide.toggleVisibility(false)
    }
  }, [data])

  const table = useReactTable({
    data,
    // @ts-expect-error
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  const isFiltered = table.getState().columnFilters.length > 0
  return (
    <div>
      {/* search bar */}
      <div className="flex items-center justify-between py-4">
        <div className="flex gap-x-2">
          <Input
            placeholder="Filter problems..."
            value={
              (table.getColumn('problems')?.getFilterValue() as string) ?? ''
            }
            onChange={(event: any) =>
              table.getColumn('problems')?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />
          {/*tag filter */}
          {table.getColumn('resources') && (
            <DataTableFacetedFilter
              column={table.getColumn('resources')}
              title="Resources"
              options={resources}
            />
          )}
          {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
        </div>
        {/* filter view */}
        <div className=''>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="ml-auto hidden h-8 lg:flex"
              >
                <MixerHorizontalIcon className="mr-2 h-4 w-4" />
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-[150px] bg-background"
            >
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== 'undefined' &&
                    column.getCanHide(),
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* main table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
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
      </div>
      <div className="py-4">
        <DataTablePagination table={table} />
      </div>
    </div>
  )
}
