import { getDocsSection, InitialPathContext } from '@tamagui/logo'
import { SchemeProvider, useColorScheme } from '@vxrn/color-scheme'
import { usePathname } from 'one'
import { TamaguiProvider } from '@tamagui/ui'
import tamaConf from '~/config/tamagui.config'
import { SearchProvider } from '~/features/site/search/SearchProvider'
import { ToastProvider } from '~/features/studio/ToastProvider'

export const Providers = (props: { children: any }) => {
  const pathname = usePathname()
  const section = getDocsSection(pathname)
  let initial = 3
  if (section) {
    initial = section === 'compiler' ? 5 : section === 'core' ? 4 : 6
  }

  return (
    <InitialPathContext.Provider value={initial}>
      <SchemeProvider>
        <WebsiteTamaguiProvider>
          <SearchProvider>{props.children}</SearchProvider>
        </WebsiteTamaguiProvider>
      </SchemeProvider>
    </InitialPathContext.Provider>
  )
}

function WebsiteTamaguiProvider(props: { children: any }) {
  const [scheme] = useColorScheme()

  return (
    <TamaguiProvider disableInjectCSS defaultTheme={scheme} config={tamaConf}>
      <ToastProvider>{props.children}</ToastProvider>
    </TamaguiProvider>
  )
}
