import { TamaguiProvider, useDidFinishSSR } from '@tamagui/core'
import tamaConf from '../tamagui.config'

export const Providers = (props: { children: any }) => {
  const didHydrate = useDidFinishSSR()
  const isDark = didHydrate
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
    : false

  return (
    <TamaguiProvider
      disableInjectCSS
      disableRootThemeClass
      defaultTheme={isDark ? 'dark' : 'light'}
      config={tamaConf}
    >
      {props.children}
    </TamaguiProvider>
  )
}
