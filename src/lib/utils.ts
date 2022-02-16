import { useLocation } from 'react-router-dom'
import { DateTime } from 'luxon'

export const usePathname = () => {
    const location = useLocation()
    console.info('current location: ', location)
    return location.pathname
}
export const getTimeFormatted = (dtm: string) => {
    return DateTime.fromISO(dtm).toLocaleString()
}
