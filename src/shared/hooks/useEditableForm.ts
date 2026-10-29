import { useState, useCallback } from 'react'

export const useEditableForm = <T>(
    data: T | null,
    completenessCheck: (data: T) => boolean,
    onRefetch?: () => void
) => {
    const isDataComplete = Boolean(data && completenessCheck(data))
    const [isEditing, setIsEditing] = useState(!isDataComplete)

    const [prevIsDataComplete, setPrevIsDataComplete] =
        useState(isDataComplete)

    if (prevIsDataComplete !== isDataComplete) {
        setPrevIsDataComplete(isDataComplete)
        if (isDataComplete) {
            setIsEditing(false)
        }
    }

    const handleToggle = useCallback(() => {
        setIsEditing(!isEditing)
    }, [isEditing])

    const handleFormSuccess = useCallback(() => {
        onRefetch?.()
        setIsEditing(false)
    }, [onRefetch])

    return {
        isEditing,
        isDataComplete,
        handleToggle,
        handleFormSuccess,
    }
}
