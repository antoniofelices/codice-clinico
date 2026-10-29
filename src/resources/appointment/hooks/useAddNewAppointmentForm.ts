import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { Appointment } from '@medplum/fhirtypes'
import { usePatients } from '@resources/patient/hooks/useGetPatient'
import { usePhysicians } from '@resources/practitioner/hooks/useGetPractitioner'
import {
    DEBOUNCE_MS,
    SLOT_INTERVAL,
} from '@resources/appointment/config/config'
import { useAvailableSlotsByDate } from '@resources/appointment/hooks/useAvailableSlotsByDate'
import { addNewAppointmentSchema } from '@resources/appointment/schemas/addNewAppointment.schema'
import { bookAppointment } from '@resources/appointment/services/bookAppointment'
import type {
    AddNewAppointmentType,
    UseAddNewAppointmentFormProps,
} from '@resources/appointment/types/appointment.model'
import { contentES as content } from '@resources/appointment/components/AddNewAppointmentForm.content'

export const useAddNewAppointmentForm = ({
    initialDate,
    onSuccess,
}: UseAddNewAppointmentFormProps = {}) => {
    const [patientSearch, setPatientSearch] = useState('')
    const [physicianSearch, setPhysicianSearch] = useState('')
    const [debouncedPatientSearch, setDebouncedPatientSearch] = useState('')
    const [debouncedPhysicianSearch, setDebouncedPhysicianSearch] = useState('')

    useEffect(() => {
        const timer = setTimeout(
            () => setDebouncedPatientSearch(patientSearch),
            DEBOUNCE_MS
        )
        return () => clearTimeout(timer)
    }, [patientSearch])

    useEffect(() => {
        const timer = setTimeout(
            () => setDebouncedPhysicianSearch(physicianSearch),
            DEBOUNCE_MS
        )
        return () => clearTimeout(timer)
    }, [physicianSearch])

    const form = useForm<AddNewAppointmentType>({
        resolver: zodResolver(addNewAppointmentSchema),
        defaultValues: {
            patient: '',
            physician: '',
            appointmentDate: initialDate ?? new Date(),
            appointmentTime: '10:00',
            notes: '',
        },
    })

    const physicianId = form.watch('physician')
    const appointmentDate = form.watch('appointmentDate')

    useEffect(() => {
        form.setValue('appointmentTime', '')
    }, [form, appointmentDate, physicianId])

    const { patients } = usePatients()
    const { physicians } = usePhysicians()
    const { slotOptions, isDateDisabled } = useAvailableSlotsByDate(physicianId, appointmentDate)

    const patientOptions = (patients ?? [])
        .filter((p) => {
            if (!debouncedPatientSearch) return true
            const fullName = `${p.firstName} ${p.lastName}`.toLowerCase()
            return fullName.includes(debouncedPatientSearch.toLowerCase())
        })
        .map((p) => ({ label: `${p.firstName} ${p.lastName}`, value: p.id }))

    const physicianOptions = (physicians ?? [])
        .filter((p) => {
            if (!debouncedPhysicianSearch) return true
            const fullName = `${p.firstName} ${p.lastName}`.toLowerCase()
            return fullName.includes(debouncedPhysicianSearch.toLowerCase())
        })
        .map((p) => ({ label: `${p.firstName} ${p.lastName}`, value: p.id }))

    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: async (data: AddNewAppointmentType) => {
            const [h, m] = data.appointmentTime.split(':').map(Number)
            const startDate = new Date(data.appointmentDate)
            startDate.setHours(h, m, 0, 0)
            const endDate = new Date(startDate)
            endDate.setMinutes(endDate.getMinutes() + SLOT_INTERVAL)

            return bookAppointment(
                startDate.toISOString(),
                endDate.toISOString(),
                data.patient,
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
                        actor: { reference: `Patient/${data.patient}` },
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
        patientOptions,
        physicianOptions,
        slotOptions,
        isDateDisabled,
        setPatientSearch,
        setPhysicianSearch,
    }
}
