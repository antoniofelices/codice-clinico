import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { ColumnFiltersState, RowData, SortingState } from '@tanstack/react-table'

import { flexRender, useTable } from '@tanstack/react-table'

import {
    dataTableFeatures,
    type DataTableColumnDef,
} from '@shared/components/ui/DataTable.features'

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@shared/components/ui/base/table'

import { contentES as content } from './DataTable.content'

type DataTableProps<TData extends RowData> = {
    columns: DataTableColumnDef<TData>[]
    data: TData[]
    caption?: string
    filterColumn?: string
    filterValue?: string
}

const DataTable = <TData extends RowData>({
    columns,
    data,
    caption,
    filterColumn,
    filterValue,
}: DataTableProps<TData>) => {
    const initialPageIndex = 0
    const initialPageSize = 20

    const [sorting, setSorting] = useState<SortingState>([])

    const columnFilters = useMemo<ColumnFiltersState>(
        () =>
            filterColumn && filterValue
                ? [{ id: filterColumn, value: filterValue }]
                : [],
        [filterColumn, filterValue]
    )

    const table = useTable({
        features: dataTableFeatures,
        data,
        columns,
        initialState: {
            pagination: {
                pageIndex: initialPageIndex,
                pageSize: initialPageSize,
            },
        },
        onSortingChange: setSorting,
        state: {
            sorting,
            columnFilters,
        },
    })

    const paginationArray = table.getPageOptions()

    return (
        <>
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableCaption className="sr-only">{caption}</TableCaption>
                    <TableHeader className="bg-gray-200 dark:bg-gray-800">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody className="bg-white dark:bg-gray-950">
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getAllCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
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
                                    {content.textNoResult}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {paginationArray.length > 1 && (
                <div className="flex mt-4 text-sm">
                    <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeft size="18" />
                    </button>
                    {paginationArray.map((page) => {
                        return (
                            <button
                                key={page}
                                onClick={() => table.setPageIndex(page)}
                                disabled={
                                    table.state.pagination.pageIndex ===
                                    page
                                }
                                className="px-2"
                            >
                                {page + 1}
                            </button>
                        )
                    })}
                    <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronRight size="18" />
                    </button>
                </div>
            )}
        </>
    )
}

export default DataTable
