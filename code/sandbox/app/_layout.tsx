import { animationsMotion } from '@tamagui/config/v5-motion'
import { Image } from '@tamagui/image'
import './_layout.css'
import './tamagui.generated.css'

// import { Toaster } from '@tamagui/toast'
import { SchemeProvider, useUserScheme } from '@vxrn/color-scheme'
import { LoadProgressBar, SafeAreaView, Slot } from 'one'
import { Configuration, isWeb, TamaguiProvider, XStack, YStack } from 'tamagui'
import { ToggleThemeButton } from '~/components/ToggleThemeButton'
import config from '~/config/tamagui/tamagui.config'

const oneBall = '/app-icon.png'

export default function Layout() {
  return (
    <html lang="en-US">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        <link rel="icon" href="/favicon.svg" />
      </head>

      <body>
        <LoadProgressBar />

        <SchemeProvider>
          <TamaguiRootProvider>
            <YStack bg="$color1" minH="100%" gap="$4" flex={1}>
              <SafeAreaView>
                {/* <Toaster position="top-center" /> */}

                <XStack items="center" justify="center" gap="$4" py="$4">
                  <Image src={oneBall} width={42} height={42} />
                  <ToggleThemeButton />
                </XStack>

                <Configuration animationDriver={animationsMotion}>
                  <Slot />
                </Configuration>
              </SafeAreaView>
            </YStack>
          </TamaguiRootProvider>
        </SchemeProvider>
      </body>
    </html>
  )
}

const TamaguiRootProvider = ({ children }: { children: React.ReactNode }) => {
  const userScheme = useUserScheme()

  return (
    <TamaguiProvider disableInjectCSS config={config} defaultTheme={userScheme.value}>
      {children}
    </TamaguiProvider>
  )
}
