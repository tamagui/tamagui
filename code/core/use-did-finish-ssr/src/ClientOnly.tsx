import { createContext, useContext } from 'react'

export const ClientOnlyContext: React.Context<boolean> = createContext(false)

export const ClientOnly = ({
  children,
  enabled,
}: { children: any; enabled?: boolean }): React.ReactNode => {
  const existingValue = useContext(ClientOnlyContext)
  return (
    <ClientOnlyContext.Provider value={enabled ?? existingValue}>
      {children}
    </ClientOnlyContext.Provider>
  )
}
