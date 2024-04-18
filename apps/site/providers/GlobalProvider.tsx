import { createContext, useState } from 'react'
import type { TamaguiConfig } from 'tamagui'

type TamaguiConfigBuilt = {
  tamaguiConfig: TamaguiConfig
}

class DropTamaguiConfigStore {
  config: TamaguiConfigBuilt | null = null
  dragging = false
}

export const TamaguiConfigContext = createContext<{
  userTamaguiConfig: DropTamaguiConfigStore
  setUserTamaguiConfig: (config: Record<string, any>) => void
}>({} as any)

export function TamaguiConfigProvider({ children }: { children: any }) {
  const [userTamaguiConfig, setUserTamaguiConfig] = useState<DropTamaguiConfigStore>({
    config: {} as any,
    dragging: false,
  })

  return (
    <TamaguiConfigContext.Provider value={{ userTamaguiConfig, setUserTamaguiConfig }}>
      {children}
    </TamaguiConfigContext.Provider>
  )
}
