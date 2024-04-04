import { TamaguiProvider, useDidFinishSSR } from '@tamagui/core'
import tamaConf from '../tamagui.config'
import { UserThemeProvider, useUserTheme } from './features/theme/user-theme'

export const Providers = (props: { children: any }) => {
  return (
    <UserThemeProvider>
      <WebsiteTamaguiProvider>{props.children}</WebsiteTamaguiProvider>
    </UserThemeProvider>
  )
}

function WebsiteTamaguiProvider(props: { children: any }) {
  const [{ resolvedTheme }] = useUserTheme()

  return (
    <TamaguiProvider disableInjectCSS defaultTheme={resolvedTheme} config={tamaConf}>
      {props.children}
    </TamaguiProvider>
  )
}
