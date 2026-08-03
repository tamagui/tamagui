import type { ThemeName } from 'tamagui'
import {
  Separator,
  SizableText,
  Theme,
  XStack,
  YStack,
  useThemeName,
} from 'tamagui'

import { useThemeBuilderStore } from '~/features/studio/theme/store/ThemeBuilderStore'
import { StudioThemesQuickPreviewSection } from '../views/StudioThemesQuickPreviewSection'
import { getStudioInternalThemeName } from '../../updatePreviewTheme'

export function StepSubThemesSidebar() {
  const store = useThemeBuilderStore()
  const hasAccent = store.subThemes[0]?.type === 'theme' && !!store.subThemes[0]?.accent
  const currentThemeName = useThemeName()
  const themeNameBase = getStudioInternalThemeName(store.baseTheme.id)
  const subThemeName = store.subThemes[0]?.name

  let topThemeName = themeNameBase
  let bottomThemeName = subThemeName as ThemeName

  // force re-render on every change
  store.themeSuiteVersion

  return (
    <YStack flex={1} pl={20}>
      <YStack p="4" flex={1} gap="4">
        <XStack items="center" gap="4">
          <Separator />
          <SizableText size="4" select="none">
            Parent theme: {currentThemeName}
          </SizableText>
          <Separator />
        </XStack>

        <Theme name={topThemeName}>
          <StudioThemesQuickPreviewSection scheme="light" hasAccent={hasAccent} />
        </Theme>

        <XStack items="center" gap="4">
          <Separator />
          <SizableText size="4" select="none">
            Sub theme: {subThemeName}
          </SizableText>
          <Separator />
        </XStack>

        <Theme name={topThemeName}>
          <Theme name={bottomThemeName}>
            <StudioThemesQuickPreviewSection scheme="dark" hasAccent={hasAccent} />
          </Theme>
        </Theme>

      </YStack>
    </YStack>
  )
}
