import { Image } from '@tamagui/image-next'
import './_layout.css'
import './tamagui.css'

import { SchemeProvider, useColorScheme } from '@vxrn/color-scheme'
import { LoadProgressBar, Slot } from 'one'
import { isWeb, TamaguiProvider, XStack, YStack } from 'tamagui'
import { ToggleThemeButton } from '~/components/ToggleThemeButton'
import config from '~/config/tamagui/tamagui.config'
import oneBall from '~/public/app-icon.png'

export default function Layout() {
  return (
    <>
      {isWeb && (
        <>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=5"
          />
          <link rel="icon" href="/favicon.svg" />
        </>
      )}

      <LoadProgressBar />

      <SchemeProvider>
        <TamaguiRootProvider>
          <YStack bg="$color1" mih="100%" gap="$4" f={1}>
            <XStack ai="center" jc="center" gap="$4" py="$4">
              <Image src={oneBall} width={42} height={42} />
              <ToggleThemeButton />
            </XStack>

            <YStack>
              <Slot />
            </YStack>
          </YStack>
        </TamaguiRootProvider>
      </SchemeProvider>
    </>
  )
}

const TamaguiRootProvider = ({ children }: { children: React.ReactNode }) => {
  const [scheme] = useColorScheme()

  return (
    <TamaguiProvider
      disableInjectCSS
      config={config}
      defaultTheme={scheme}
      disableRootThemeClass
    >
      {children}
    </TamaguiProvider>
  )
}
