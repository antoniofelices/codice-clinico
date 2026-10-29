// import { useQuery } from '@tanstack/react-query'
import { PatientContext } from '@resources/patient/context/patientContext'

type PatientProviderProps = {
    patientId: string
    children: React.ReactNode
}

const PatientProvider = ({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    patientId,
    children,
    ...props
}: PatientProviderProps) => {
    // const { data, isPending, isError, error, refetch } = useQuery({
    //     queryKey: ['singleHealthConsumerQuery', patientId],
    //     queryFn: () => getSinglePatient(patientId),
    //     enabled: !!patientId,
    // })

    // const value = {
    //     patientData: data || null,
    //     patientHistory: data?.medical_patient_history || null,
    //     clinicalHistory: data?.medical_clinical_history || null,
    //     patientLoading: isPending,
    //     patientError: isError,
    //     patientErrorType: error || null,
    //     refetchPatient: refetch,
    // }

    return (
        <PatientContext.Provider {...props} value={undefined}>
            {children}
        </PatientContext.Provider>
    )
}

export default PatientProvider
