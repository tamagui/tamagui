import { memo, useState } from 'react'
import { ScrollView, Theme, YStack, useThemeName, useWindowDimensions } from 'tamagui'

import { MODAL_WIDTH } from '~/features/studio/constants'
import { useBaseThemePreview } from '../steps/2-base/useBaseThemePreview'
import { StudioPreviewComponentsBar } from '../StudioPreviewComponentsBar'
import { useThemeBuilderStore } from '~/features/studio/theme/store/ThemeBuilderStore'

const disableRouter = false
// typeof globalThis.location !== 'undefined'
//   ? location.search.includes('disableRouter')
//   : true

export const extraPad = 18

export const StudioPreviewContainer = (props: { children: any }) => {
  const store = useThemeBuilderStore()
  const dimensions = useWindowDimensions()
  const [lastWidth, setLastWidth] = useState(dimensions.width - MODAL_WIDTH)

  return (
    <YStack
      maxWidth={1250}
      animation="quick"
      x={store.isCentered ? 0 : -((MODAL_WIDTH + extraPad) / 2)}
      mx="auto"
      p={extraPad * 2}
      w={`calc(100% - ${MODAL_WIDTH}px)`}
      gap="$4"
      onLayout={(e) => {
        setLastWidth(e.nativeEvent.layout.width)
      }}
      // @ts-ignore
      // group="preview"
      data-tauri-drag-region
    >
      {props.children}
    </YStack>
  )
}

export const StudioPreviewFrame = memo(
  ({ children, showSettingsBar }: { children: any; showSettingsBar?: any }) => {
    const store = useThemeBuilderStore()
    const isParentDark = useThemeName().startsWith('dark')
    const hasBothLightDark = store.schemes.light && store.schemes.dark
    const isDark = hasBothLightDark ? isParentDark : store.schemes.dark
    const schemeTheme = isDark ? 'dark' : 'light'
    const version = store.themeSuiteVersion
    const { name: baseStepThemeName } = useBaseThemePreview()
    const themeResetKey = version > 2 ? 1 : version
    const [scrollView, setScrollView] = useState<any>(null)
    const isOnComponents = store.currentSection?.id === 'component'
    const themeName = !isOnComponents
      ? baseStepThemeName
      : store.componentParentTheme === 'accent'
        ? (`${baseStepThemeName}_accent` as any)
        : baseStepThemeName

    return (
      // for some reason we have to put a light/dark above it
      <YStack
        h="100%"
        w="100%"
        flex={0}
        data-tauri-drag-region
        className="font-smooth-aliased"
      >
        {showSettingsBar && <StudioPreviewComponentsBar scrollView={scrollView} />}

        <Theme key={themeResetKey} name={schemeTheme}>
          <Theme name={themeName}>
            <YStack
              fullscreen
              data-tauri-drag-region
              className="font-smooth-aliased"
              bg={disableRouter ? 'transparent' : '$background'}
              zi={0}
            />

            <ScrollView
              ref={setScrollView}
              width="100%"
              height="100%"
              id="preview-scroll-view"
            >
              <StudioPreviewContainer>
                <YStack pt="$12" data-tauri-drag-region>
                  {children}
                </YStack>
              </StudioPreviewContainer>
            </ScrollView>
          </Theme>
        </Theme>
      </YStack>
    )
  }
)
