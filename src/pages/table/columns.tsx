"use client"

import * as React from "react"
import { type ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

export type Problem = {
  date: string
  problems: string
  resources: string
}

export const columns: ColumnDef<Problem>[] = [
  {
    accessorKey: 'date',
    header: ({ column }) => {
      const [isClient, setIsClient] = React.useState(false)
      React.useEffect(() => setIsClient(true), [])
      
      return isClient ? (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        null
      )
    },
  },
  {
    accessorKey: 'problems',
    header: ({ column }) => {
      const [isClient, setIsClient] = React.useState(false)
      React.useEffect(() => setIsClient(true), [])
      
      return isClient ? (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Problems
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        null
      )
    },
    filterFn: "includesString"
  },
  {
    accessorKey: 'resources',
    header: ({ column }) => {
      const [isClient, setIsClient] = React.useState(false)
      React.useEffect(() => setIsClient(true), [])
      
      return isClient ? (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Resources
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        null
      )
    },
    filterFn: "includesString"
  }
]
