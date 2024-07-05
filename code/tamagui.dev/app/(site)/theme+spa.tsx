import { ChevronLeft, ChevronRight } from '@tamagui/lucide-icons'
import { TamaguiElement, View } from '@tamagui/web'
import { FC, memo, startTransition, useEffect, useMemo, useRef, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import {
  AnimatePresence,
  Button,
  ScrollView,
  Separator,
  SizableText,
  Spacer,
  Theme,
  XStack,
  YStack,
  isClient,
  styled,
  useIsomorphicLayoutEffect,
  useMedia,
} from 'tamagui'

import { StudioStepTip } from '~/features/studio/StudioStepTip'
import { StudioPreviewComponents } from '~/features/studio/theme/StudioPreviewComponents'
import { useBaseThemePreview } from '~/features/studio/theme/steps/2-base/useBaseThemePreview'
import { steps } from '~/features/studio/theme/steps/steps'
import {
  themeBuilderStore,
  useThemeBuilderStore,
} from '~/features/studio/theme/store/ThemeBuilderStore'
import { weakKey } from '~/helpers/weakKey'
// import { StudioPreviewFrame } from './views/StudioPreviewFrame'

let lastLoadThemeId = ''
export async function loadTheme(params) {
  if (!params.themeId) return
  if (params.themeId === lastLoadThemeId) return
  lastLoadThemeId = params.themeId
  themeBuilderStore.setThemeSuiteId(params.themeId)
}

themeBuilderStore.setSteps(steps)

export function loader() {}

const step = 0

export default memo(function StudioTheme() {
  // const missing = !useThemeBuilderStore().themeSuiteId
  // TODO just insert new on missing
  // const notFound = !themeId || missing
  // useEffect(() => {
  //   if (notFound) {
  //     navigate('/', { replace: true })
  //   }
  // }, [notFound])

  const store = useThemeBuilderStore()

  useEffect(() => {
    store.load()
  }, [])

  // yucky two way sync here
  useIsomorphicLayoutEffect(() => {
    if (typeof step !== 'number') {
      console.warn(`NO STEP?????`)
      return
    }
    const numStep = Number(step)
    if (numStep !== store.step) {
      store.setStep(numStep)
    }
  }, [step])

  // // yucky two way sync here
  // useEffect(() => {
  //   if (!store.hasSetStepOnce) return
  //   if (step !== `${store.step}`) {
  //     router.replace(`/builder/${themeId}/${store.step}`)
  //   }
  // }, [store.step])

  return (
    <ScrollView
      width="100%"
      contentContainerStyle={{
        flex: 1,
      }}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      <ThemeBuilderModal />
      <PreviewTheme>
        <Preview />
      </PreviewTheme>
    </ScrollView>
  )
})

const PreviewTheme = (props: { children: any }) => {
  const { name: baseStepThemeName } = useBaseThemePreview()
  console.info('baseStepThemeName', baseStepThemeName)

  return (
    <Theme forceClassName name={baseStepThemeName}>
      {props.children}
    </Theme>
  )
}

const Preview = memo(() => {
  const store = useThemeBuilderStore()
  const [shown, setShown] = useState(false)
  const { currentSection, themeSuite } = store

  useEffect(() => {
    startTransition(() => {
      setShown(true)
    })
  }, [])

  if (!currentSection) {
    return null
  }

  return (
    <Theme forceClassName name={(themeSuite?.baseTheme.name as any) || null}>
      <StudioPreviewComponents />
    </Theme>
  )
})

const Empty = () => null

const ThemeBuilderModal = memo(() => {
  const store = useThemeBuilderStore()
  const { sectionTitles, currentSection } = store
  const StepComponent = currentSection?.children ?? Empty
  const ref = useRef<TamaguiElement>(null)

  const contents = useMemo(() => {
    return (
      <ScrollView flex={1} contentContainerStyle={{ flex: 1 }}>
        <YStack f={1} px="$5">
          {/* @ts-ignore */}
          <StepComponent />
        </YStack>
      </ScrollView>
    )
  }, [StepComponent])

  // const media = useMedia()
  // useEffect(() => {
  //   if (!ref) return
  //   if (!isClient) return
  //   if (media.md) return

  //   let dispose: (() => void) | undefined = undefined
  //   let disposed = false

  //   import('../../helpers/sticksy').then(({ Sticksy }) => {
  //     if (disposed) {
  //       return
  //     }

  //     new Sticksy(ref.current as any)

  //     dispose = () => {
  //       Sticksy.disableAll()
  //     }
  //   })

  //   return () => {
  //     disposed = true
  //     dispose?.()
  //   }
  // }, [ref, media.gtMd])

  return (
    <YStack
      pos={'fixed' as any}
      animation="kindaBouncy"
      animateOnly={['transform']}
      ref={ref}
      x={0}
      t={80}
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
      <XStack
        px="$4"
        py="$3"
        gap="$2"
        bbw="$0.5"
        bc="$borderColor"
        bg="$color2"
        data-tauri-drag-region
      >
        {sectionTitles.map((title, idx) => {
          const isActive = idx + 1 <= currentSection.sectionIdx
          const isLastActive = idx === currentSection.sectionIdx
          const disabled = !isActive && (!store.canGoForward || store.disableForward)
          return (
            <XStack
              overflow="hidden"
              flex={isLastActive ? 1 : 0}
              key={idx}
              width={24}
              height={24}
              gap="$4"
              ai="center"
              data-tauri-drag-region
              pr="$2"
            >
              <YStack
                opacity={isLastActive ? 1 : 0.5}
                h={24}
                w={24}
                br={100}
                ai="center"
                jc="center"
                bg="$color2"
                borderColor="$borderColor"
                bw="$0.5"
                cursor={disabled ? 'not-allowed' : 'pointer'}
                onPress={() => {
                  store.setStep(
                    store.sectionsFlat.findIndex((step) => step.sectionIdx === idx)
                  )
                }}
                tag="button"
                disabled={disabled}
                focusStyle={{
                  backgroundColor: '$backgroundFocus',
                  borderColor: '$backgroundFocus',
                }}
              >
                <SizableText userSelect="none" size="$2">
                  {idx + 1}
                </SizableText>
              </YStack>

              <SizableText
                ff="$mono"
                o={0.5}
                tt="uppercase"
                ls={3}
                pe="none"
                userSelect="none"
              >
                {title}
              </SizableText>
            </XStack>
          )
        })}

        <StudioStepTip />
      </XStack>

      {/* content */}
      <YStack gap="$4" separator={<Separator bw={1} />} f={1}>
        <AnimatePresence exitBeforeEnter custom={{ going: store.direction }}>
          <Section
            f={1}
            animation="200ms"
            // debug="verbose"
            animateOnly={['transform', 'opacity']}
            key={weakKey(StepComponent)}
          >
            {contents}
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

  useHotkeys('left', backward)
  useHotkeys('right', forward)

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
