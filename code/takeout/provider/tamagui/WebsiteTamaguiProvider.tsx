import { TamaguiProvider } from 'tamagui'

import { useUserTheme } from '@tamagui/one-theme'

import tamaConf from '~/config/tamagui.config'

export function WebsiteTamaguiProvider(props: { children: any }) {
  const [{ resolvedTheme }] = useUserTheme()

  // <ToastProvider swipeDirection="horizontal">
  // </ToastProvider>

  return (
    <TamaguiProvider
      disableRootThemeClass
      disableInjectCSS
      defaultTheme={resolvedTheme}
      config={tamaConf}
    >
      {props.children}
    </TamaguiProvider>
  )
}
