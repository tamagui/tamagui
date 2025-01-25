import { ChevronLeft, ChevronRight } from '@tamagui/lucide-icons'
import type { TamaguiElement } from '@tamagui/web'
import { useParams, useRouter } from 'one'
import { memo, startTransition, useEffect, useMemo, useRef, useState } from 'react'
import {
  AnimatePresence,
  Button,
  ScrollView,
  Separator,
  Spacer,
  Theme,
  XStack,
  YStack,
  styled,
  useThemeName,
} from 'tamagui'
import { ThemeNameEffect } from '~/features/site/theme/ThemeNameEffect'
import { Dialogs } from '~/features/studio/components/Dialogs'
import { StudioAIBar } from '~/features/studio/theme/StudioAIBar'
import { StudioPreviewComponents } from '~/features/studio/theme/StudioPreviewComponents'
import { StudioPreviewComponentsBar } from '~/features/studio/theme/StudioPreviewComponentsBar'
import { useBaseThemePreview } from '~/features/studio/theme/steps/2-base/useBaseThemePreview'
import { steps } from '~/features/studio/theme/steps/steps'
import {
  themeBuilderStore,
  useThemeBuilderStore,
} from '~/features/studio/theme/store/ThemeBuilderStore'
import { weakKey } from '~/helpers/weakKey'

themeBuilderStore.setSteps(steps)

export default function ThemePage() {
  const [loaded, setLoaded] = useState(false)
  const store = useThemeBuilderStore()
  const themeName = useThemeName()
  const router = useRouter()
  const params = useParams<any>()

  useEffect(() => {
    // give it a bit to load many dynamic charts that animate etc
    store.load(params.state as string | undefined).then(() => {
      startTransition(() => {
        setLoaded(true)
      })
    })

    const onSave = () => {
      router.setParams({
        state: store.serializedState,
      })
    }

    store.listeners.add(onSave)

    return () => {
      store.listeners.delete(onSave)
    }
  }, [])

  const previewKey = `${loaded}${themeName.replace(/(dark|light)_?/, '')}`

  return (
    <>
      <Dialogs />

      <ThemeBuilderModal />

      <XStack w="100%" h="max-content" pr={540} $sm={{ pr: 0 }} jc="flex-end" ov="hidden">
        <YStack
          gap="$4"
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
          <PreviewTheme>
            <YStack gap="$6">
              <StudioPreviewComponentsBar scrollView={document.documentElement} />
              <StudioPreviewComponents />
            </YStack>
          </PreviewTheme>
        </YStack>
      </XStack>
    </>
  )
}

const PreviewTheme = (props: { children: any; noKey?: any }) => {
  const { name: baseStepThemeName, key } = useBaseThemePreview()

  return (
    <Theme key={props.noKey ? '' : key} forceClassName name={baseStepThemeName}>
      <YStack bg="$color1" fullscreen zi={0} scale={2} />
      <ThemeNameEffect />
      <YStack f={1}>{props.children}</YStack>
    </Theme>
  )
}

const Empty = () => null

const ThemeBuilderModal = memo(() => {
  const store = useThemeBuilderStore()
  const { currentSection } = store
  const StepComponent = currentSection?.children ?? Empty
  const ref = useRef<TamaguiElement>(null)
  // const [expanded, setExpanded] = useState(false)

  return (
    <YStack
      animation="slow"
      pos={'fixed' as any}
      t={90}
      r={0}
      b={0}
      w={530}
      mah="90vh"
      zi={100_000}
      $sm={{
        dsp: 'none',
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
        bg="$color2"
      >
        {/* <Button
          size="$2"
          t="$-3"
          l="$3"
          circular
          // icon={expanded ? ChevronRight : ChevronLeft}
          // onPress={() => setExpanded(!expanded)}
          $gtMd={{
            dsp: 'none',
          }}
        ></Button> */}

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
    <XStack p="$4" py="$3" ai="center" bc="$borderColor" btw={1} zi={100} bg="$color2">
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

  // useHotkeys('left', backward)
  // useHotkeys('right', forward)

  return (
    <XStack gap="$2">
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
