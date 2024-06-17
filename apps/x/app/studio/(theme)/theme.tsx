import { ChevronLeft, ChevronRight } from '@tamagui/lucide-icons'
import { memo, useEffect, useMemo } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import {
  AnimatePresence,
  Button,
  PortalItem,
  ScrollView,
  Separator,
  SizableText,
  Spacer,
  XStack,
  YStack,
  styled,
  useIsomorphicLayoutEffect,
} from 'tamagui'
import { router } from 'vxs'

import { ThemeBuilderModalFrame } from '~/features/studio/theme/ThemeBuilderModalFrame'
import { useThemeBuilderStore } from '~/features/studio/theme/store/ThemeBuilderStore'
import { weakKey } from '~/helpers/weakKey'
import { StudioStepTip } from '~/features/studio/StudioStepTip'
// import { StudioPreviewComponents } from './StudioPreviewComponents'
// import { StudioThemeBuilderActionBar } from './StudioThemeBuilderActionBar'
// import { ThemeBuilderModalFrame } from './ThemeBuilderModalFrame'
import { themeBuilderStore } from '~/features/studio/theme/store/ThemeBuilderStore'
import { StudioThemeBuilderActionBar } from '~/features/studio/theme/StudioThemeBuilderActionBar'
import { steps } from '~/features/studio/theme/steps/steps'
// import { StudioPreviewFrame } from './views/StudioPreviewFrame'

let lastLoadThemeId = ''
export async function loadTheme(params) {
  if (!params.themeId) return
  if (params.themeId === lastLoadThemeId) return
  lastLoadThemeId = params.themeId
  themeBuilderStore.setThemeSuiteId(params.themeId)
}

export default memo(function StudioTheme({
  themeId,
  step,
}: {
  themeId: string
  step: string
}) {
  // const missing = !useThemeBuilderStore().themeSuiteId
  // TODO just insert new on missing
  // const notFound = !themeId || missing
  // useEffect(() => {
  //   if (notFound) {
  //     navigate('/', { replace: true })
  //   }
  // }, [notFound])

  useEffect(() => {
    // ensure no circular imports by having this set onto the store from the root of ThemeBuilder
    themeBuilderStore.setSteps(steps)
  }, [])

  const store = useThemeBuilderStore()

  useEffect(() => {
    store.load()
  }, [])

  // yucky two way sync here
  useIsomorphicLayoutEffect(() => {
    const numStep = Number(step)
    if (numStep !== store.step) {
      store.setStep(numStep)
    }
  }, [step])

  // yucky two way sync here
  useEffect(() => {
    if (!store.hasSetStepOnce) return
    if (step !== `${store.step}`) {
      router.replace(`/builder/${themeId}/${store.step}`)
    }
  }, [store.step])

  return (
    <YStack fullscreen zi={100} pe="auto">
      {store.loaded && <ThemeBuilderModal />}

      <PortalItem hostName="studio-header">
        <StudioThemeBuilderActionBar />
      </PortalItem>

      <Preview />
    </YStack>
  )
})

const Preview = memo(() => {
  const store = useThemeBuilderStore()
  const { currentSection } = store

  if (!currentSection) {
    return null
  }

  const hasCustomPreview = !!currentSection?.preview

  // TODO
  const StudioPreviewComponents = () => null
  const StudioPreviewFrame = ({ children, showSettingsBar }) => <>{children}</>
  const Inner = currentSection?.preview || StudioPreviewComponents
  return (
    <StudioPreviewFrame showSettingsBar={!hasCustomPreview}>
      <Inner />
    </StudioPreviewFrame>
  )
})

const Empty = () => null

const ThemeBuilderModal = memo(() => {
  const store = useThemeBuilderStore()
  const { isCentered, sectionTitles, currentSection } = store
  const enterVariant =
    store.direction === 1 || store.direction === 0 ? 'isRight' : 'isLeft'
  const exitVariant = store.direction === 1 ? 'isLeft' : 'isRight'

  const StepComponent = currentSection?.children ?? Empty
  const StepSidebar = currentSection?.sidebar ?? Empty

  console.log('StepComponent', store)

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

  return (
    <ThemeBuilderModalFrame
      isCentered={isCentered}
      sidebar={StepSidebar ? <StepSidebar /> : undefined}
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
                <SizableText selectable={false} size="$2">
                  {idx + 1}
                </SizableText>
              </YStack>

              <SizableText
                ff="$mono"
                o={0.5}
                tt="uppercase"
                ls={3}
                pe="none"
                selectable={false}
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
        <AnimatePresence
          enterVariant={enterVariant}
          exitVariant={exitVariant}
          exitBeforeEnter
        >
          <Section
            f={1}
            animation="100ms"
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
    </ThemeBuilderModalFrame>
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
      {/* <ThemeStudioStepButtonsBar /> */}
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
      router.push('/builder')
    } else {
      forward()
    }
  }

  useHotkeys('left', backward)
  useHotkeys('right', forward)

  return (
    <XStack space="$2">
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

      <Button
        themeInverse={!disableForward}
        size="$3"
        disabled={disableForward}
        opacity={disableForward ? 0.5 : 1}
        cursor={disableForward ? 'not-allowed' : undefined}
        iconAfter={canGoForward ? ChevronRight : null}
        onPress={forwardOrFinish}
      >
        {currentSection.nextTitle || (canGoForward ? 'Next' : 'Back to Menu')}
      </Button>
    </XStack>
  )
}

const Section = styled(YStack, {
  space: '$2',
  opacity: 1,
  x: 0,

  variants: {
    isLeft: { true: { x: -15, opacity: 0 } },
    isRight: { true: { x: 15, opacity: 0 } },
  } as const,
})
