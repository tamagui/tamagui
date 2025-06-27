import { createContext } from 'react'

export const ClientOnlyContext: React.Context<boolean> = createContext(false)

export const ClientOnly = ({ children }: { children: any }): React.ReactNode => {
  return <ClientOnlyContext.Provider value={true}>{children}</ClientOnlyContext.Provider>
}
