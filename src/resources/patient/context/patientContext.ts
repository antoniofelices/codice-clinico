import { createContext } from 'react'

type PatientContextType = object
export const PatientContext = createContext<PatientContextType | undefined>(
    undefined
)
