import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { Appointment } from '@medplum/fhirtypes'
import { usePhysicians } from '@resources/practitioner/hooks/useGetPractitioner'
import { SLOT_INTERVAL } from '@resources/appointment/config/config'
import { useAvailableSlotsByDate } from '@resources/appointment/hooks/useAvailableSlotsByDate'
import { addNewAppointmentByPatientSchema } from '@resources/appointment/schemas/addNewAppointmentByPatient.schema'
import { bookAppointment } from '@resources/appointment/services/bookAppointment'
import type {
    AddNewAppointmentByPatientType,
    UseAddNewAppointmentFormByPatientProps,
} from '@resources/appointment/types/appointment.model'
import { contentES as content } from '@resources/appointment/components/AddNewAppointmentFormByPatient.content'

export const useAddNewAppointmentFormByPatient = ({
    patientId,
    onSuccess,
}: UseAddNewAppointmentFormByPatientProps) => {
    const form = useForm<AddNewAppointmentByPatientType>({
        resolver: zodResolver(addNewAppointmentByPatientSchema),
        defaultValues: {
            physician: '',
            appointmentDate: new Date(),
            appointmentTime: '10:00',
            notes: '',
        },
    })

    const physicianId = form.watch('physician')
    const appointmentDate = form.watch('appointmentDate')

    useEffect(() => {
        form.setValue('appointmentTime', '')
    }, [form, appointmentDate, physicianId])

    const { physicians } = usePhysicians()
    const { slotOptions, isDateDisabled } = useAvailableSlotsByDate(
        physicianId,
        appointmentDate
    )

    const physicianOptions = (physicians ?? []).map((p) => ({
        label: `${p.firstName} ${p.lastName}`,
        value: p.id,
    }))

    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: async (data: AddNewAppointmentByPatientType) => {
            const [h, m] = data.appointmentTime.split(':').map(Number)
            const startDate = new Date(data.appointmentDate)
            startDate.setHours(h, m, 0, 0)
            const endDate = new Date(startDate)
            endDate.setMinutes(endDate.getMinutes() + SLOT_INTERVAL)

            return bookAppointment(
                startDate.toISOString(),
                endDate.toISOString(),
                patientId,
                data.physician,
                data.notes
            )
        },
        onMutate: async (data) => {
            const [h, m] = data.appointmentTime.split(':').map(Number)
            const startDate = new Date(data.appointmentDate)
            startDate.setHours(h, m, 0, 0)
            const endDate = new Date(startDate)
            endDate.setMinutes(endDate.getMinutes() + SLOT_INTERVAL)

            const optimisticAppointment: Appointment = {
                resourceType: 'Appointment',
                status: 'booked',
                start: startDate.toISOString(),
                end: endDate.toISOString(),
                participant: [
                    {
                        actor: { reference: `Patient/${patientId}` },
                        status: 'accepted',
                    },
                    {
                        actor: { reference: `Practitioner/${data.physician}` },
                        status: 'accepted',
                    },
                ],
            }

            await queryClient.cancelQueries({
                queryKey: ['appointments', data.physician],
            })

            const previousSlots = queryClient.getQueryData<Appointment[]>([
                'appointments',
                data.physician,
            ])

            queryClient.setQueryData<Appointment[]>(
                ['appointments', data.physician],
                (old) => [...(old ?? []), optimisticAppointment]
            )

            return { previousSlots, physicianId: data.physician }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['listAppointments'] })
            queryClient.invalidateQueries({ queryKey: ['appointmentsByPatient'] })
            queryClient.invalidateQueries({ queryKey: ['appointmentsByPractitioner'] })
            queryClient.invalidateQueries({ queryKey: ['appointments'] })
            toast.success(content.textToastSuccess)
            form.reset()
            onSuccess?.()
        },
        onError: (_, __, context) => {
            if (context?.previousSlots !== undefined) {
                queryClient.setQueryData(
                    ['appointments', context.physicianId],
                    context.previousSlots
                )
            }
            toast.error(content.textToastFail)
        },
    })

    const onSubmit = form.handleSubmit((data) => mutation.mutate(data))

    return {
        form,
        onSubmit,
        isSubmitting: mutation.isPending,
        physicianOptions,
        slotOptions,
        isDateDisabled,
    }
}
