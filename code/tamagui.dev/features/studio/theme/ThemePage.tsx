import { ChevronLeft, ChevronRight, X } from '@tamagui/lucide-icons'
import { useStore } from '@tamagui/use-store'
import type { TamaguiElement } from '@tamagui/web'
import {
  memo,
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  AnimatePresence,
  Button,
  ScrollView,
  Separator,
  Spacer,
  styled,
  Theme,
  useMedia,
  View,
  XStack,
  YStack,
} from 'tamagui'
import { ThemeNameEffectNoTheme } from '~/features/site/theme/ThemeNameEffect'
import { Dialogs } from '~/features/studio/components/Dialogs'
import { StudioAIBar } from '~/features/studio/theme/StudioAIBar'
import {
  StudioPreviewComponents,
  StudioPreviewComponentsSkeleton,
} from '~/features/studio/theme/StudioPreviewComponents'
import { StudioPreviewComponentsBar } from '~/features/studio/theme/StudioPreviewComponentsBar'
import { useBaseThemePreview } from '~/features/studio/theme/steps/2-base/useBaseThemePreview'
import { useThemeBuilderStore } from '~/features/studio/theme/store/ThemeBuilderStore'
import { lastInserted } from '~/features/studio/theme/updatePreviewTheme'
import { weakKey } from '~/helpers/weakKey'
import { type ThemePageProps, themePageStore, ThemePageStore } from './themePageStore'
import { router, useRouter } from 'one'

// TO avoid changing the entire React tree we can do this, better perf

export function ThemePageUpdater(props: ThemePageProps) {
  useLayoutEffect(() => {
    themePageStore.setProps(props)
  }, [props])

  return null
}

export function ThemePage() {
  const { curProps: props } = useStore(ThemePageStore)

  return (
    <>
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
          $maxXl={{ pr: 0 }}
          jc="flex-end"
          ov="hidden"
        >
          <YStack
            p="$4"
            f={1}
            maw="calc(min(100vw, 1300px))"
            group="content"
            $maxLg={{
              maw: `calc(min(100vw, 900px))`,
              p: '$4',
            }}
          >
            <PreviewTheme>
              <YStack gap="$6">
                <StudioAIBar initialTheme={{ themeSuite: props.theme }} />
                <StudioPreviewComponentsBar
                  scrollView={
                    typeof window !== 'undefined' ? document.documentElement : null
                  }
                />
                {typeof window !== 'undefined' ? (
                  <StudioPreviewComponents isReady={typeof window !== 'undefined'} />
                ) : (
                  <StudioPreviewComponentsSkeleton />
                )}
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
      <Theme name={baseStepThemeName}>
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
  const [hide, setHide] = useState(false)
  const { gtLg } = useMedia()

  useEffect(() => {
    if (gtLg) {
      setHide(false)
    }
  }, [gtLg])

  return (
    <YStack
      // animation="medium"
      pos={'fixed' as any}
      t={70}
      r={0}
      b={0}
      w={530}
      mah="90vh"
      maw="95vw"
      zi={100_000}
      x={hide ? 500 : 0}
      animation="medium"
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
        {...(hide && {
          bc: '$color0',
          bg: '$background0',
        })}
      >
        <XStack
          pos="absolute"
          zi={100000}
          t="$2"
          l="$2"
          $gtLg={{
            display: 'none',
          }}
        >
          <Button
            size="$2"
            circular
            icon={hide ? ChevronLeft : ChevronRight}
            onPress={() => setHide(!hide)}
          />
        </XStack>

        <YStack
          animation={['medium', { opacity: { overshootClamping: true } }]}
          opacity={hide ? 0 : 1}
          gap="$4"
          separator={<Separator bw={1} />}
          f={1}
        >
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
  const router = useRouter()
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
            router.navigate('/theme')
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
