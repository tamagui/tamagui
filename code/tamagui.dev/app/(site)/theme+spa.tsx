import { ChevronLeft, ChevronRight } from '@tamagui/lucide-icons'
import type { TamaguiElement } from '@tamagui/web'
import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
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

import { StudioPreviewComponents } from '~/features/studio/theme/StudioPreviewComponents'
import { StudioPreviewComponentsBar } from '~/features/studio/theme/StudioPreviewComponentsBar'
import { useBaseThemePreview } from '~/features/studio/theme/steps/2-base/useBaseThemePreview'
import { steps } from '~/features/studio/theme/steps/steps'
import {
  themeBuilderStore,
  useThemeBuilderStore,
} from '~/features/studio/theme/store/ThemeBuilderStore'
import { weakKey } from '~/helpers/weakKey'
// import { StudioPreviewFrame } from './views/StudioPreviewFrame'

themeBuilderStore.setSteps(steps)

export function loader() {}

export default memo(function StudioTheme() {
  const [loaded, setLoaded] = useState(false)
  const store = useThemeBuilderStore()
  const themeName = useThemeName()

  useEffect(() => {
    store.load().then(() => {
      setLoaded(true)
    })
  }, [])

  return (
    <ScrollView
      mt={-60}
      width="100%"
      contentContainerStyle={{
        flex: 1,
      }}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {loaded && <ThemeBuilderModal />}

      <YStack f={1}>
        <PreviewTheme key={`${loaded}${themeName}`}>
          <StudioPreviewComponentsBar scrollView={document.documentElement} />
          <StudioPreviewComponents />
        </PreviewTheme>
      </YStack>
    </ScrollView>
  )
})

const PreviewTheme = (props: { children: any }) => {
  const { name: baseStepThemeName } = useBaseThemePreview()

  return (
    <Theme key={baseStepThemeName} forceClassName name={baseStepThemeName}>
      <YStack bg="$background" f={1} pt={60}>
        {props.children}
      </YStack>
    </Theme>
  )
}

const Empty = () => null

const ThemeBuilderModal = memo(() => {
  const store = useThemeBuilderStore()
  const { sectionTitles, currentSection } = store
  const StepComponent = currentSection?.children ?? Empty
  const ref = useRef<TamaguiElement>(null)

  return (
    <YStack
      pos={'fixed' as any}
      animation="medium"
      animateOnly={['transform']}
      ref={ref}
      x={0}
      t={90}
      r={0}
      b={0}
      w={550}
      elevation="$5"
      btlr="$6"
      bblr="$6"
      ov="hidden"
      bw={0.5}
      mah="90vh"
      bc="$color6"
      zi={100_000}
      bg="$color2"
      $md={{
        x: 500,
      }}
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
  )
})

const StudioThemeBuilderTray = () => {
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
}

const StudioThemeBuilderBottomBar = () => {
  return (
    <XStack p="$4" py="$3" ai="center" bc="$borderColor" btw={1} zi={100} bg="$color2">
      <CurrentStepActionBar />
      <Spacer flex />
      <ThemeStudioStepButtonsBar />
    </XStack>
  )
}

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
