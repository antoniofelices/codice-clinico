import type { DataTableColumnDef } from '@shared/components/ui/DataTable.features'
import type { NavigateFn } from '@tanstack/react-router'
import type { PatientType } from '@resources/patient/types/patient.model'
import { ArrowUpDown, ArrowRight } from 'lucide-react'
import { contentES as content } from './patientTable.content'

const patientTableColumns = (
    navigate: NavigateFn
): DataTableColumnDef<PatientType>[] => [
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
                        {content.labelName}
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
                        {content.labelLastName}
                        <ArrowUpDown size="12" />
                    </span>
                </button>
            )
        },
    },
    {
        accessorKey: 'dni',
        header: ({ column }) => {
            return (
                <button
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    <span className="flex items-center gap-2">
                        {content.labelDni}
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
                <button onClick={() => navigate({ to: `/patient/${id}` })}>
                    <ArrowRight size="16" />
                </button>
            )
        },
    },
]

export default patientTableColumns
