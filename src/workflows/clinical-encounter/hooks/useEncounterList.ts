import { useQuery } from '@tanstack/react-query'
import { useLogger } from '@shared/hooks/useLogger'
import { fetchEncounterList } from '@workflows/clinical-encounter/services/fetchEncounterList'
import type { EncounterWithConditionType } from '@workflows/clinical-encounter/types/clinicalEncounter.model'

export const useEncounterList = (patientId: string) => {
    const { logError } = useLogger('EncounterList')

    const { data, isPending, isError, refetch } = useQuery({
        queryKey: ['encounterList', patientId],
        queryFn: async (): Promise<EncounterWithConditionType[]> => {
            try {
                const { encounters, conditions } =
                    await fetchEncounterList(patientId)

                return encounters.map((encounter) => {
                    const encounterRef = `Encounter/${encounter.id}`
                    const condition = conditions.find(
                        (c) => c.encounter?.reference === encounterRef
                    )
                    return { encounter, condition }
                })
            } catch (err) {
                logError(
                    'Failed to load encounter list',
                    err,
                    'useEncounterList'
                )
                throw err
            }
        },
    })

    return {
        items: data ?? [],
        loading: isPending,
        error: isError ? 'Failed to load encounters' : null,
        reload: refetch,
    }
}
