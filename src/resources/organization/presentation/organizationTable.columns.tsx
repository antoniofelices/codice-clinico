import type { DataTableColumnDef } from '@shared/components/ui/DataTable.features'
import type { NavigateFn } from '@tanstack/react-router'
import type { OrganizationType } from '@resources/organization/types/organization.model'
import { ArrowUpDown, ArrowRight } from 'lucide-react'
import { contentES as content } from './organizationTable.content'

const organizationTableColumns = (
    navigate: NavigateFn
): DataTableColumnDef<OrganizationType>[] => [
    {
        accessorKey: 'name',
        header: ({ column }) => {
            return (
                <button
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    <span className="flex items-center gap-2">
                        {content.labelName}
                        <ArrowUpDown size="12" />
                    </span>
                </button>
            )
        },
    },
    {
        accessorKey: 'type',
        header: ({ column }) => {
            return (
                <button
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    <span className="flex items-center gap-2">
                        {content.labelType}
                        <ArrowUpDown size="12" />
                    </span>
                </button>
            )
        },
    },
    {
        accessorKey: 'identifier',
        header: ({ column }) => {
            return (
                <button
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    <span className="flex items-center gap-2">
                        {content.labelIdentifier}
                        <ArrowUpDown size="12" />
                    </span>
                </button>
            )
        },
    },
    {
        accessorKey: 'id',
        header: 'Edit',
        cell: ({ row }) => {
            const id = row.original.id
            return (
                <button onClick={() => navigate({ to: `/organization/${id}` })}>
                    <ArrowRight size="16" />
                </button>
            )
        },
    },
]

export default organizationTableColumns
