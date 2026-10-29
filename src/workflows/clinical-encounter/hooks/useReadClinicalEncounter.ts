import { useQuery } from '@tanstack/react-query'
import { useLogger } from '@shared/hooks/useLogger'
import { fetchClinicalEncounter } from '@workflows/clinical-encounter/services/fetchClinicalEncounter'

export const useReadClinicalEncounter = (encounterId: string | null) => {
    const { logError } = useLogger('ReadClinicalEncounter')

    const { data, isPending, isError } = useQuery({
        queryKey: ['clinicalEncounter', encounterId],
        queryFn: async () => {
            try {
                return await fetchClinicalEncounter(encounterId as string)
            } catch (err) {
                logError(
                    'Failed to load clinical encounter',
                    err,
                    'useReadClinicalEncounter'
                )
                throw err
            }
        },
        enabled: !!encounterId,
    })

    return {
        data: data ?? null,
        loading: isPending,
        error: isError ? 'Failed to load clinical encounter' : null,
    }
}
