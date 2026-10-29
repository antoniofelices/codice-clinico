import { useSyncExternalStore } from 'react'

const BREAKPOINT = 768
const QUERY = `(max-width: ${BREAKPOINT - 1}px)`

const subscribe = (onChange: () => void) => {
    const mql = window.matchMedia(QUERY)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
}

const getSnapshot = () => window.innerWidth < BREAKPOINT

export function useIsMobile() {
    return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
