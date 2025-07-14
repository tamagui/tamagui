import { createContext } from 'react'

export const ClientOnlyContext: React.Context<boolean> = createContext(false)

export const ClientOnly = ({
  children,
  value = true,
}: { children: any; value?: boolean }): React.ReactNode => {
  return <ClientOnlyContext.Provider value={value}>{children}</ClientOnlyContext.Provider>
}
