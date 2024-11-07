"use client"
export const prerender = false
import { Cross2Icon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import { type Table } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import DataTableFacetedFilter from "./data-table-faceted-filter.tsx" 
import { DataTableViewOptions } from "./data-table-view-options.tsx"
import { resources } from "./data.tsx"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter problems..."
          value={(table.getColumn("problems")?.getFilterValue() as string) ?? ""}
          onChange={(event: any) =>
            table.getColumn("problems")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("resources") && (
          <DataTableFacetedFilter
            column={table.getColumn("resources")}
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
      <DataTableViewOptions table={table} />   
    </div>
  )
}