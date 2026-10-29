import type { DataTableColumnDef } from '@shared/components/ui/DataTable.features'
import type { NavigateFn } from '@tanstack/react-router'
import type { AppointmentType } from '@resources/appointment/types/appointment.model'
import { ArrowUpDown, ArrowRight } from 'lucide-react'
import { transformTime } from '@shared/utils/utils'
import { contentES as content } from './appointmentByPractitionerTable.content'

const appointmentByPractitionerTableColumns = (
    navigate: NavigateFn
): DataTableColumnDef<AppointmentType>[] => [
    {
        id: 'hour',
        accessorKey: 'start',
        header: ({ column }) => (
            <button
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === 'asc')
                }
            >
                <span className="flex items-center gap-2">
                    {content.labelHour}
                    <ArrowUpDown size="12" />
                </span>
            </button>
        ),
        cell: ({ row }) => transformTime(row.getValue('hour')),
    },
    {
        accessorKey: 'patientName',
        header: ({ column }) => {
            return (
                <button
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    <span className="flex items-center gap-2">
                        {content.labelPatientName}
                        <ArrowUpDown size="12" />
                    </span>
                </button>
            )
        },
    },
    {
        accessorKey: 'status',
        header: ({ column }) => (
            <button
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === 'asc')
                }
            >
                <span className="flex items-center gap-2">
                    {content.labelStatus}
                    <ArrowUpDown size="12" />
                </span>
            </button>
        ),
        cell: ({ row }) => row.original.status,
    },
    {
        accessorKey: 'patientId',
        header: content.labelEdit,
        cell: ({ row }) => (
            <button
                onClick={() =>
                    navigate({ to: `/patient/${row.original.patientId}` })
                }
            >
                <ArrowRight size="16" />
            </button>
        ),
    },
]

export default appointmentByPractitionerTableColumns
