import { SessionContext } from 'app/provider/auth/AuthProvider.native'
import { useContext } from 'react'

export const useSessionContext = () => useContext(SessionContext)
