import { InitialPathContext, SeasonProvider } from '@tamagui/logo'
import { SchemeProvider, useUserScheme } from '@vxrn/color-scheme'
import { TamaguiProvider } from 'tamagui'
import tamaConf from '~/config/tamagui.config'
import { PostHogProvider } from '~/features/posthog/PostHogProvider'
import { SearchProvider } from '~/features/site/search/SearchProvider'
import { ToastProvider } from '~/features/studio/ToastProvider'

export const Providers = (props: { children: any }) => {
  return (
    <InitialPathContext.Provider value={3}>
      <SchemeProvider>
        <PostHogProvider>
          <SeasonProvider>
            <WebsiteTamaguiProvider>
              <SearchProvider>{props.children}</SearchProvider>
            </WebsiteTamaguiProvider>
          </SeasonProvider>
        </PostHogProvider>
      </SchemeProvider>
    </InitialPathContext.Provider>
  )
}

function WebsiteTamaguiProvider(props: { children: any }) {
  const { value } = useUserScheme()

  return (
    <TamaguiProvider disableInjectCSS defaultTheme={value} config={tamaConf}>
      <ToastProvider>{props.children}</ToastProvider>
    </TamaguiProvider>
  )
}
