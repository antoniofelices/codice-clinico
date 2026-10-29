import type { DataTableColumnDef } from '@shared/components/ui/DataTable.features'
import type { NavigateFn } from '@tanstack/react-router'
import type { PhysicianType } from '@resources/practitioner/types/practitioner.model'
import { ArrowUpDown, ArrowRight } from 'lucide-react'
import { contentES as content } from './practitionerTable.content'

const practitionerTableColumns = (
    navigate: NavigateFn
): DataTableColumnDef<PhysicianType>[] => [
    {
        accessorKey: 'firstName',
        header: ({ column }) => {
            return (
                <button
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    <span className="flex items-center gap-2">
                        {content.labelUserName}
                        <ArrowUpDown size="12" />
                    </span>
                </button>
            )
        },
    },
    {
        accessorKey: 'lastName',
        header: ({ column }) => {
            return (
                <button
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    <span className="flex items-center gap-2">
                        {content.labelUserLastName}
                        <ArrowUpDown size="12" />
                    </span>
                </button>
            )
        },
    },
    {
        accessorKey: 'specialty',
        header: ({ column }) => {
            return (
                <button
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    <span className="flex items-center gap-2">
                        {content.labelSpecialty}
                        <ArrowUpDown size="12" />
                    </span>
                </button>
            )
        },
    },
    {
        accessorKey: 'id',
        header: content.labelEdit,
        cell: ({ row }) => {
            const id = row.original.id
            return (
                <button onClick={() => navigate({ to: `/practitioner/${id}` })}>
                    <ArrowRight size="16" />
                </button>
            )
        },
    },
]

export default practitionerTableColumns
