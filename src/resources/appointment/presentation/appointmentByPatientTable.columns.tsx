import type { DataTableColumnDef } from '@shared/components/ui/DataTable.features'
import type { AppointmentType } from '@resources/appointment/types/appointment.model'
import { ArrowUpDown, Check } from 'lucide-react'
import { transformDate, transformTime } from '@shared/utils/utils'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@shared/components/ui/base/select'
import { Toggle } from '@shared/components/ui/base/toggle'
import { STATUS_OPTIONS } from '@resources/appointment/config/config'
import { contentES as content } from './appointmentByPatientTable.content'

const appointmentByPatientTableColumns = (
    onStatusChange: (appointmentId: string, newStatus: string) => void,
    onCalledChange: (appointmentId: string, called: boolean) => void
): DataTableColumnDef<AppointmentType>[] => [
    {
        id: 'day',
        accessorKey: 'start',
        header: ({ column }) => (
            <button
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === 'asc')
                }
            >
                <span className="flex items-center gap-2">
                    {content.labelDay}
                    <ArrowUpDown size="12" />
                </span>
            </button>
        ),
        cell: ({ row }) => transformDate(row.getValue('day')),
    },
    {
        id: 'hour',
        accessorFn: (row) => row.start,
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
        accessorKey: 'practitionerName',
        header: ({ column }) => (
            <button
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === 'asc')
                }
            >
                <span className="flex items-center gap-2">
                    {content.labelPractitionerName}
                    <ArrowUpDown size="12" />
                </span>
            </button>
        ),
    },
    {
        accessorKey: 'called',
        header: () => (
            <span className="flex items-center gap-2">
                {content.labelConfirmed}
            </span>
        ),
        cell: ({ row }) => (
            <Toggle
                aria-label="Toggle called"
                size="xs"
                variant="outline"
                className="rounded-full"
                pressed={row.original.called}
                onPressedChange={(pressed) =>
                    onCalledChange(row.original.id, pressed)
                }
            >
                <Check className="group-data-[state=on]/toggle:fill-foreground" />
                <span className="sr-only">{content.labelConfirmed}</span>
            </Toggle>
        ),
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
        cell: ({ row }) => (
            <Select
                value={row.original.status}
                onValueChange={(value) =>
                    onStatusChange(row.original.id, value)
                }
            >
                <SelectTrigger size="sm" className="w-40">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        ),
    },
]

export default appointmentByPatientTableColumns
