"use client"
export const prerender = false
import * as React from 'react'
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
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

import { DataTablePagination } from './pagination'
import { DataTableToolbar } from './data-table-toolbar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowUpDown } from 'lucide-react'

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
        return <div className="w-64 break-all">{row.original.problems}</div>
      },
      filterFn: 'includesString',
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
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

  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data,
    // @ts-expect-error
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  return (
    <div className="space-y-4">
      {/* <DataTableToolbar table={table} /> */}
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
