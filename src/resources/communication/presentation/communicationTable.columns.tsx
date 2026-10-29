import type { DataTableColumnDef } from '@shared/components/ui/DataTable.features'
import type { CommunicationType } from '@resources/communication/types/communication.model'
import { ArrowUpDown } from 'lucide-react'
import { transformDate } from '@shared/utils/utils'
import { contentES as content } from './communicationTable.content'

const communicationTableColumns = (): DataTableColumnDef<CommunicationType>[] => [
    {
        accessorKey: 'title',
        header: ({ column }) => (
            <button
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === 'asc')
                }
            >
                <span className="flex items-center gap-2">
                    {content.labelTitle}
                    <ArrowUpDown size="12" />
                </span>
            </button>
        ),
    },
    {
        accessorKey: 'content',
        header: () => content.labelContent,
        cell: ({ row }) => {
            const value: string = row.getValue('content')
            return (
                <span className="block max-w-36 truncate" title={value}>
                    {value}
                </span>
            )
        },
    },
    {
        accessorKey: 'startDate',
        header: () => content.labelStartDate,
        cell: ({ row }) => transformDate(row.getValue('startDate')),
    },
    {
        accessorKey: 'endDate',
        header: () => content.labelEndDate,
        cell: ({ row }) => transformDate(row.getValue('endDate')),
    },
    {
        accessorKey: 'location',
        header: () => content.labelLocation,
    },
    {
        accessorKey: 'sent',
        header: ({ column }) => (
            <button
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === 'asc')
                }
            >
                <span className="flex items-center gap-2">
                    {content.labelSent}
                    <ArrowUpDown size="12" />
                </span>
            </button>
        ),
        cell: ({ row }) => transformDate(row.getValue('sent')),
    },
]

export default communicationTableColumns
