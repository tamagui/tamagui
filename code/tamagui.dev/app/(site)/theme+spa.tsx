import { ChevronLeft, ChevronRight } from '@tamagui/lucide-icons'
import type { TamaguiElement } from '@tamagui/web'
import { useParams, useRouter } from 'one'
import { memo, startTransition, useEffect, useMemo, useRef, useState } from 'react'
import type { ComponentType } from 'react'
import {
  AnimatePresence,
  Button,
  ScrollView,
  Separator,
  Spacer,
  Theme,
  View,
  XStack,
  YStack,
  styled,
} from 'tamagui'
import { ThemeNameEffectNoTheme } from '~/features/site/theme/ThemeNameEffect'
import { Dialogs } from '~/features/studio/components/Dialogs'
import { StudioAIBar } from '~/features/studio/theme/StudioAIBar'
import { StudioPreviewComponents } from '~/features/studio/theme/StudioPreviewComponents'
import { StudioPreviewComponentsBar } from '~/features/studio/theme/StudioPreviewComponentsBar'
import { useBaseThemePreview } from '~/features/studio/theme/steps/2-base/useBaseThemePreview'
import {
  themeBuilderStore,
  useThemeBuilderStore,
} from '~/features/studio/theme/store/ThemeBuilderStore'
import { weakKey } from '~/helpers/weakKey'
import { lastInserted } from '../../features/studio/theme/previewTheme'
import { useUser } from '~/features/user/useUser'
import { useSupabaseClient } from '~/features/auth/useSupabaseClient'

export default function ThemePage() {
  const [loaded, setLoaded] = useState(false)
  const router = useRouter()
  const params = useParams<any>()

  useEffect(() => {
    // give it a bit to load many dynamic charts that animate etc
    themeBuilderStore.load(params.state as string | undefined).then(() => {
      startTransition(() => {
        setLoaded(true)
      })
    })

    const onSave = () => {
      router.setParams({
        state: themeBuilderStore.serializedState,
      })
    }

    themeBuilderStore.listeners.add(onSave)

    return () => {
      themeBuilderStore.listeners.delete(onSave)
    }
  }, [])

  // const previewKey = `${loaded}${themeName.replace(/(dark|light)_?/, '')}`

  return (
    <>
      <Dialogs />

      <YStack flexShrink={0} mb="$10">
        <ThemeBuilderModal />

        <XStack
          w="100%"
          h="max-content"
          pr={540}
          pt={10}
          $lg={{ pr: 0 }}
          jc="flex-end"
          ov="hidden"
        >
          <YStack
            gap="$6"
            p="$4"
            f={1}
            maw="calc(min(100vw, 1300px))"
            group="content"
            $md={{
              maw: `calc(min(100vw, 900px))`,
              p: '$4',
            }}
          >
            <StudioAIBar />
            <StudioPreviewComponentsBar scrollView={document.documentElement} />
            <PreviewTheme>
              <YStack gap="$6">
                <StudioPreviewComponents />
              </YStack>
            </PreviewTheme>
          </YStack>
        </XStack>
      </YStack>
    </>
  )
}

const PreviewTheme = (props: { children: any; noKey?: any }) => {
  const { name: baseStepThemeName } = useBaseThemePreview()

  return (
    <>
      <Theme forceClassName name={baseStepThemeName}>
        <ThemeNameEffectNoTheme />
        <YStack f={1}>{props.children}</YStack>
      </Theme>
    </>
  )
}

const Empty = () => null

const ThemeBuilderModal = memo(() => {
  const store = useThemeBuilderStore()
  const { currentSection } = store
  const StepComponent = currentSection?.children ?? Empty
  const ref = useRef<TamaguiElement>(null)

  return (
    <YStack
      // animation="medium"
      pos={'fixed' as any}
      t={70}
      r={0}
      b={0}
      w={530}
      mah="90vh"
      zi={100_000}
      $lg={{
        x: '98%',
      }}
    >
      <YStack
        fullscreen
        animation="medium"
        animateOnly={['transform']}
        ref={ref}
        x={0}
        elevation="$5"
        btlr="$6"
        bblr="$6"
        bw={0.5}
        bc="$color6"
        bg="$background06"
        backdropFilter="blur(60px)"
      >
        {/* <TooltipSimple label="Show Drawer">
          <YStack
            animation="lazy"
            px="$2"
            py="$2"
            t="$-3"
            l={-20}
            br="$10"
            bg="$color2"
            bw={0.5}
            bc="$borderColor"
            elevation="$2"
            w={40}
            h={40}
            ai="center"
            jc="center"
            x={0}
            opacity={0}
            pressStyle={{
              bg: '$color3',
            }}
            $lg={{
              x: expanded ? 30 : -30,
              opacity: 1,
            }}
            // onPress={() => {
            //   setExpanded(!expanded)
            // }}
          >
            {expanded ? <ChevronRight x={0.5} /> : <ChevronLeft x={0.5} />}
          </YStack>
        </TooltipSimple> */}

        <YStack gap="$4" separator={<Separator bw={1} />} f={1}>
          <AnimatePresence exitBeforeEnter custom={{ going: store.direction }}>
            <Section
              f={1}
              animation="75ms"
              animateOnly={['transform', 'opacity']}
              key={weakKey(StepComponent)}
            >
              {useMemo(() => {
                return (
                  <ScrollView flex={1} contentContainerStyle={{ flex: 1 }}>
                    <YStack f={1}>
                      {/* @ts-ignore */}
                      <StepComponent />
                    </YStack>
                  </ScrollView>
                )
              }, [StepComponent])}
            </Section>
          </AnimatePresence>
        </YStack>

        <StudioThemeBuilderTray />

        {/* bottom */}
        <StudioThemeBuilderBottomBar />
      </YStack>
    </YStack>
  )
})

const StudioThemeBuilderTray = memo(() => {
  const store = useThemeBuilderStore()
  const Tray = store.currentSection?.tray

  if (!Tray) {
    return null
  }

  return (
    <>
      <Tray />
    </>
  )
})

const StudioThemeBuilderBottomBar = memo(() => {
  const store = useThemeBuilderStore()
  const userSwr = useUser()
  const supabase = useSupabaseClient()

  const handleSaveTheme = async () => {
    if (!userSwr.data?.user) {
      alert('Please login to save themes')
      return
    }

    const themeName = store.currentTheme?.name
    if (!themeName) {
      alert('No theme selected')
      return
    }

    const name = themeName.replace(/(dark|light)_?/, '')
    const isDark = themeName.startsWith('dark')

    try {
      const { error } = await supabase.from('themes').upsert(
        {
          user_id: userSwr.data.user.id,
          name,
          is_dark: isDark,
          query: window.location.search,
          theme_data: lastInserted,
        },
        {
          onConflict: 'user_id,name,is_dark',
        }
      )

      if (error) throw error
      alert('Theme saved successfully!')
    } catch (error) {
      console.error('Error saving theme:', error)
      alert('Error saving theme')
    }
  }

  return (
    <XStack p="$4" py="$3" ai="center" zi={100} bg="$background02">
      <CurrentStepActionBar />
      <Spacer flex />
      <XStack gap="$2">
        {location.hostname === 'localhost' && lastInserted && (
          <>
            <a href={`one-chat://theme?value=${btoa(JSON.stringify(lastInserted))}`}>
              <Button size="$3">Chat</Button>
            </a>
            <Button size="$3" onPress={handleSaveTheme}>
              Save Theme
            </Button>
            <View flex={1} />
          </>
        )}

        <Button
          size="$3"
          onPress={() => {
            if (confirm(`Reset theme builder state?`)) {
              store.reset()
            }
          }}
        >
          Reset
        </Button>

        {store.canGoBackward && (
          <Button chromeless size="$3" icon={ChevronLeft} onPress={store.backward}>
            {store.currentSection?.prevTitle || 'Back'}
          </Button>
        )}

        {store.canGoForward && (
          <Button
            themeInverse={!store.disableForward}
            size="$3"
            disabled={store.disableForward}
            opacity={store.disableForward ? 0.5 : 1}
            cursor={store.disableForward ? 'not-allowed' : undefined}
            iconAfter={store.canGoForward ? ChevronRight : null}
            onPress={() => {
              if (!store.canGoForward) {
                console.warn('done')
              } else {
                store.forward()
              }
            }}
          >
            {store.currentSection?.nextTitle || 'Next'}
          </Button>
        )}
      </XStack>
    </XStack>
  )
})

const CurrentStepActionBar = () => {
  const { currentSection } = useThemeBuilderStore()
  const ActionComponent = currentSection?.actions as any

  if (!ActionComponent) {
    return null
  }

  return <ActionComponent />
}

const Section = styled(YStack, {
  gap: '$2',
  x: 0,
  opacity: 1,

  variants: {
    // 1 = right, 0 = nowhere, -1 = left
    going: {
      ':number': (going) => ({
        enterStyle: {
          x: going > 0 ? 20 : -20,
          opacity: 0,
        },
        exitStyle: {
          zIndex: 0,
          x: going < 0 ? 20 : -20,
          opacity: 0,
        },
      }),
    },
  } as const,
})
