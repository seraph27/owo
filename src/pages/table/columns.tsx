"use client"

import { type ColumnDef } from '@tanstack/react-table'

export type Problem = {
  date: string
  problems: string
  tags: string
  isContest: boolean
  resources: string
}

export const columns: ColumnDef<Problem>[] = [
  {
    accessorKey: 'date',
    header: "Date",
  },
  {
    accessorKey: 'problems',
    header: "Problems",
    filterFn: "includesString"
  },
  {
    accessorKey: 'tags',
    header: "Tags",
    filterFn: "includesString"
  },
  {
    accessorKey: 'resources',
    header: "Resources",
    filterFn: "includesString"
  }
]
