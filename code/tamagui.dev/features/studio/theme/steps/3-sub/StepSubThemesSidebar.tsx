import { useStore } from '@tamagui/use-store'
import type { ThemeName } from 'tamagui'
import { Separator, SizableText, Spinner, Theme, XStack, YStack, useThemeName } from 'tamagui'

import { StudioProcedureStore } from '../../callApi'
import { useThemeBuilderStore } from '~/features/studio/theme/store/ThemeBuilderStore'
import { StudioThemesQuickPreviewSection } from '../views/StudioThemesQuickPreviewSection'
import { getStudioInternalThemeName } from '../../previewTheme'

export function StepSubThemesSidebar() {
  const procedureStore = useStore(StudioProcedureStore)
  const store = useThemeBuilderStore()
  const hasAccent = store.subTheme?.type === 'theme' && !!store.subTheme?.accent
  const currentThemeName = useThemeName()
  const themeNameBase = getStudioInternalThemeName(store.baseTheme.id)
  const subThemeName = store.subTheme?.name

  let topThemeName = themeNameBase
  let bottomThemeName = subThemeName as ThemeName

  // force re-render on every change
  store.themeSuiteVersion

  return (
    <YStack
      f={1}
      pl={20}
    >
      <YStack
        p="$4"
        f={1}
        gap="$4"
      >
        <XStack
          ai="center"
          gap="$4"
        >
          <Separator />
          <SizableText
            size="$4"
            selectable={false}
          >
            Parent theme: {currentThemeName}
          </SizableText>
          <Separator />
        </XStack>

        <Theme name={topThemeName}>
          <StudioThemesQuickPreviewSection
            scheme="light"
            hasAccent={hasAccent}
          />
        </Theme>

        <XStack
          ai="center"
          gap="$4"
        >
          <Separator />
          <SizableText
            size="$4"
            selectable={false}
          >
            Sub theme: {subThemeName}
          </SizableText>
          <Separator />
        </XStack>

        <Theme name={topThemeName}>
          <Theme name={bottomThemeName}>
            <StudioThemesQuickPreviewSection
              scheme="dark"
              hasAccent={hasAccent}
            />
          </Theme>
        </Theme>

        <YStack
          pointerEvents="none"
          f={1}
          pos="absolute"
          left={0}
          right={0}
          top={0}
          bottom={0}
          bc="rgba(0, 0, 0, 0.25)"
          ai="center"
          jc="center"
          opacity={procedureStore.loading.buildThemeSuite ? 1 : 0}
          zi={100}
        >
          <Spinner />
        </YStack>
      </YStack>
    </YStack>
  )
}
