import { Image } from '@tamagui/image-next'
import './_layout.css'
import './tamagui.css'

import { Toast, ToastProvider, ToastViewport, useToastState } from '@tamagui/toast'
import { SchemeProvider, useColorScheme } from '@vxrn/color-scheme'
import { LoadProgressBar, SafeAreaView, Slot } from 'one'
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
        <ToastProvider swipeDirection="horizontal">
          <TamaguiRootProvider>
            <YStack bg="$color1" mih="100%" gap="$4" f={1}>
              <SafeAreaView>
                <ToastViewport portalToRoot top={0} left={0} right={0} />
                <CustomToast />

                <XStack ai="center" jc="center" gap="$4" py="$4">
                  <Image src={oneBall} width={42} height={42} />
                  <ToggleThemeButton />
                </XStack>

                <YStack>
                  <Slot />
                </YStack>
              </SafeAreaView>
            </YStack>
          </TamaguiRootProvider>
        </ToastProvider>
      </SchemeProvider>
    </>
  )
}

export const CustomToast = () => {
  const currentToast = useToastState()

  if (!currentToast || currentToast.isHandledNatively) {
    return null
  }

  return (
    <Toast
      key={currentToast.id}
      duration={currentToast.duration}
      viewportName={currentToast.viewportName}
      enterStyle={{ opacity: 0, scale: 0.5, y: -25 }}
      exitStyle={{ opacity: 0, scale: 1, y: -20 }}
      y={0}
      opacity={1}
      scale={1}
      animation="quick"
    >
      <YStack py="$1.5" px="$2">
        <Toast.Title lh="$1">{currentToast.title}</Toast.Title>
        {!!currentToast.message && (
          <Toast.Description>{currentToast.message}</Toast.Description>
        )}
      </YStack>
    </Toast>
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
