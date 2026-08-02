import { ChevronLeft, ChevronRight, X } from '@tamagui/lucide-icons-2'
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
import { Button } from '~/components/Button'
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
import { useBannerHeight } from '~/components/PromoBanner'

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

      <YStack shrink={0} flexBasis="auto" mb="10">
        <Suspense fallback={null}>
          <ThemeBuilderModal />
        </Suspense>

        <XStack
          width="100%"
          height="max-content"
          pr="540px lg:0px"
          pt={10}
          justify="flex-end"
          overflow="hidden"
          z={100}
        >
          <YStack
            p="4 md:4"
            flex={1}
            flexBasis="auto"
            maxW="calc(min(100vw, 1300px)) md:calc(min(100vw, 900px))"
            group="content"
            container
            containerName="content"
          >
            <PreviewTheme>
              <YStack gap="6">
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
        <YStack flex={1} flexBasis="auto">
          {props.children}
        </YStack>
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
  const bannerHeight = useBannerHeight()

  useEffect(() => {
    if (gtLg) {
      setHide(false)
    }
  }, [gtLg])

  return (
    <YStack
      position="fixed"
      t={70 + bannerHeight}
      r={0}
      b={0}
      width={530}
      maxH="90vh"
      maxW="95vw"
      z={1000}
      x={hide ? 500 : 0}
      transition="medium"
    >
      <YStack
        position="absolute"
        inset={0}
        transition="medium"
        x={0}
        borderTopLeftRadius="6"
        borderBottomLeftRadius="6"
        borderWidth={0.5}
        borderColor="color6"
        bg="background06"
        backdropFilter="blur(60px)"
        {...(hide && {
          borderColor: 'color0',
          bg: 'color3',
        })}
        animateOnly={['transform']}
        ref={ref}
        elevation="5"
      >
        <XStack position="absolute" z={999} t="2" l="2" display="gtLg:none">
          <Button
            size="3"
            circular
            icon={hide ? ChevronLeft : ChevronRight}
            onPress={() => setHide(!hide)}
          />
        </XStack>

        <YStack
          transition={['medium', { opacity: { overshootClamping: true } }]}
          opacity={hide ? 0 : 1}
          gap="4"
          flex={1}
        >
          <AnimatePresence mode="wait" custom={{ going: store.direction }}>
            <Section
              flex={1}
              transition="75ms"
              animateOnly={['transform', 'opacity']}
              key={weakKey(StepComponent)}
            >
              {useMemo(() => {
                return (
                  <ScrollView flex={1} contentContainerStyle={{ flex: 1 }}>
                    <YStack flex={1}>
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
    <XStack
      paddingRight="4"
      paddingLeft="4"
      py="3"
      items="center"
      z={100}
      bg="background02"
    >
      <CurrentStepActionBar />
      <Spacer flex={1} />
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
    <XStack gap="2">
      {typeof location !== 'undefined' &&
        location.host === 'localhost' &&
        lastInserted && (
          <>
            <a
              href={`start-chat-dev://theme?value=${btoa(JSON.stringify(lastInserted))}`}
            >
              <Button size="4">Chat</Button>
            </a>
            <View flex={1} />
          </>
        )}

      <Button
        size="4"
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
          variant="quiet"
          size="4"
          // disabled={disableBackward}
          // opacity={disableBackward ? 0.5 : 1}
          icon={ChevronLeft}
          onPress={backward}
        >
          {currentSection.prevTitle || 'Back'}
        </Button>
      )}

      {canGoForward && (
        <Theme name={!disableForward ? 'accent' : undefined}>
          <Button
            size="4"
            disabled={disableForward}
            opacity={disableForward ? 0.5 : 1}
            cursor={disableForward ? 'not-allowed' : undefined}
            iconAfter={canGoForward ? ChevronRight : null}
            onPress={forwardOrFinish}
          >
            {currentSection.nextTitle || 'Next'}
          </Button>
        </Theme>
      )}
    </XStack>
  )
}

const Section = styled(YStack, {
  gap: '2',
  x: 0,
  opacity: 1,
  variants: {
    // 1 = right, 0 = nowhere, -1 = left
    going: {
      number: (going) => ({
        x: `enter:${going > 0 ? 20 : -20}px exit:${going < 0 ? 20 : -20}px`,
        opacity: 'enter:0 exit:0',
        zIndex: 'exit:0',
      }),
    },
  } as const,
})
