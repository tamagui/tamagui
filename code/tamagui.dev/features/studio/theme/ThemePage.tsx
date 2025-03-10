import { ChevronLeft, ChevronRight } from '@tamagui/lucide-icons'
import type { TamaguiElement } from '@tamagui/web'
import { lazy, memo, Suspense, useEffect, useMemo, useRef } from 'react'
import {
  AnimatePresence,
  Button,
  ScrollView,
  Separator,
  Spacer,
  styled,
  Theme,
  View,
  XStack,
  YStack,
} from 'tamagui'
import { HeadInfo } from '~/components/HeadInfo'
import { ThemeNameEffectNoTheme } from '~/features/site/theme/ThemeNameEffect'
import { Dialogs } from '~/features/studio/components/Dialogs'
import { StudioAIBar } from '~/features/studio/theme/StudioAIBar'
import { StudioPreviewComponentsSkeleton } from '~/features/studio/theme/StudioPreviewComponents'
import { useBaseThemePreview } from '~/features/studio/theme/steps/2-base/useBaseThemePreview'
import {
  themeBuilderStore,
  useThemeBuilderStore,
} from '~/features/studio/theme/store/ThemeBuilderStore'
import { lastInserted } from '~/features/studio/theme/updatePreviewTheme'
import { useUser } from '~/features/user/useUser'
import { weakKey } from '~/helpers/weakKey'
import type { ThemeSuiteItemData } from './types'

const StudioPreviewComponentsBar = lazy(
  () => import('~/features/studio/theme/StudioPreviewComponentsBar')
)

const StudioPreviewComponents = lazy(
  () => import('~/features/studio/theme/StudioPreviewComponents')
)

export type Props = {
  search: string
  id: number
  theme: ThemeSuiteItemData
}

export function ThemePage(props: Props) {
  const { theme, id, search } = props
  const user = useUser()
  const { updateGenerate } = useThemeBuilderStore()

  useEffect(() => {
    if (theme) {
      updateGenerate(theme, search, id, user.data?.userDetails?.full_name)
    }
  }, [theme])

  return (
    <>
      <HeadInfo
        title={`${search || 'Tamagui Theme Builder'} - Tamagui Theme`}
        description={search ? `Tamagui Theme for ${search}` : `Tamagui Theme Builder`}
        openGraph={{
          images: [
            {
              url: `https://tamagui.dev/api/theme/open-graph?id=${id || '0'}`,
            },
          ],
        }}
      />

      <Dialogs />

      <YStack flexShrink={0} mb="$10">
        <Suspense fallback={null}>
          <ThemeBuilderModal />
        </Suspense>

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
            <StudioAIBar initialTheme={{ themeSuite: props.theme }} />
            <StudioPreviewComponentsBar
              scrollView={typeof window !== 'undefined' ? document.documentElement : null}
            />
            <PreviewTheme>
              <YStack gap="$6">
                <Suspense fallback={<StudioPreviewComponentsSkeleton />}>
                  <StudioPreviewComponents />
                </Suspense>
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
  return (
    <XStack p="$4" py="$3" ai="center" zi={100} bg="$background02">
      <CurrentStepActionBar />
      <Spacer flex />
      <ThemeStudioStepButtonsBar />
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

const ThemeStudioStepButtonsBar = () => {
  const store = useThemeBuilderStore()
  const {
    canGoBackward,
    canGoForward,
    backward,
    forward,
    currentSection,
    disableForward,
  } = store

  const forwardOrFinish = () => {
    if (!canGoForward) {
      console.warn('done')
    } else {
      forward()
    }
  }

  return (
    <XStack gap="$2">
      {typeof location !== 'undefined' &&
        location.host === 'localhost' &&
        lastInserted && (
          <>
            <a
              href={`start-chat-dev://theme?value=${btoa(JSON.stringify(lastInserted))}`}
            >
              <Button size="$3">Chat</Button>
            </a>
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

      {canGoBackward && (
        <Button
          chromeless
          size="$3"
          // disabled={disableBackward}
          // opacity={disableBackward ? 0.5 : 1}
          icon={ChevronLeft}
          onPress={backward}
        >
          {currentSection.prevTitle || 'Back'}
        </Button>
      )}

      {canGoForward && (
        <Button
          themeInverse={!disableForward}
          size="$3"
          disabled={disableForward}
          opacity={disableForward ? 0.5 : 1}
          cursor={disableForward ? 'not-allowed' : undefined}
          iconAfter={canGoForward ? ChevronRight : null}
          onPress={forwardOrFinish}
        >
          {currentSection.nextTitle || 'Next'}
        </Button>
      )}
    </XStack>
  )
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
