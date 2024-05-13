import { TamaguiProvider } from 'tamagui'
import { SearchProvider } from '~/features/site/search/SearchProvider'
import { UserThemeProvider, useUserTheme } from '~/features/site/theme/useUserTheme'
import tamaConf from './tamagui.config'
import { ToastProvider } from '@tamagui/toast'

export const Providers = (props: { children: any }) => {
  return (
    <SearchProvider>
      <UserThemeProvider>
        <WebsiteTamaguiProvider>{props.children}</WebsiteTamaguiProvider>
      </UserThemeProvider>
    </SearchProvider>
  )
}

function WebsiteTamaguiProvider(props: { children: any }) {
  const [{ resolvedTheme }] = useUserTheme()

  return (
    <TamaguiProvider disableInjectCSS defaultTheme={resolvedTheme} config={tamaConf}>
      <ToastProvider swipeDirection="horizontal">{props.children}</ToastProvider>
    </TamaguiProvider>
  )
}
