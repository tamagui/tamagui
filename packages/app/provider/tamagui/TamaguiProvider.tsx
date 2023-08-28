import { TamaguiProvider as TamaguiProviderOG } from '@my/ui'

import config from '../../tamagui.config'
import { useRootTheme } from '../theme/UniversalThemeProvider'

export const TamaguiProvider = ({ children }: { children: React.ReactNode }) => {
  const [rootTheme] = useRootTheme()

  return (
    <TamaguiProviderOG
      config={config}
      disableInjectCSS
      disableRootThemeClass
      defaultTheme={rootTheme}
    >
      {children}
    </TamaguiProviderOG>
  )
}
