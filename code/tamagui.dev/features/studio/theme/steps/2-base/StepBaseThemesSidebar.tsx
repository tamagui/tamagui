import { useStore } from '@tamagui/use-store'
import { useState } from 'react'
import type { ThemeName } from 'tamagui'
import {
  Label,
  Separator,
  SizableText,
  Spinner,
  Switch,
  Theme,
  XStack,
  YStack,
} from 'tamagui'

import { StudioProcedureStore } from '../../callApi'
import { useThemeBuilderStore } from '../../store/ThemeBuilderStore'
import { StudioThemesQuickPreviewSection } from '../views/StudioThemesQuickPreviewSection'
import { useBaseThemePreview } from './useBaseThemePreview'

export function StepBaseThemesSidebar() {
  const themeBuilder = useThemeBuilderStore()
  const hasAccent = !!themeBuilder.baseTheme?.accent
  const { name: themeNameBase } = useBaseThemePreview()

  // force re-render on every change
  themeBuilder.themeSuiteVersion

  return (
    <YStack f={1}>
      {/* fixes some bug in updating first time */}
      <Contents
        key={themeBuilder.themeSuiteVersion}
        themeNameBase={themeNameBase}
        hasAccent={hasAccent}
      />
    </YStack>
  )
}

const Contents = ({
  themeNameBase,
  hasAccent,
}: {
  themeNameBase: string
  hasAccent: boolean
}) => {
  const themeBuilder = useThemeBuilderStore()
  const { selectedSchemes } = themeBuilder
  const procedureStore = useStore(StudioProcedureStore)

  const [showAccent, setShowAccent] = useState(false)
  const themeName = (showAccent ? `${themeNameBase}_accent` : themeNameBase) as ThemeName

  return (
    <>
      <XStack pos="absolute" t="$4" l={30} zi={1000} gap="$4" scale={0.75}>
        {procedureStore.loading.buildThemeSuite ? <Spinner size="small" /> : null}
      </XStack>

      <XStack pos="absolute" t="$4" r="$4" zi={1000}>
        <XStack o={hasAccent ? 1 : 0.5} gap="$2" ml="auto" ai="center" h="$2">
          <Label size="$3" color="$color">
            Accent
          </Label>
          <Switch
            disabled={!hasAccent}
            checked={showAccent}
            onCheckedChange={setShowAccent}
            size="$1"
          >
            <Switch.Thumb animation="quickest" />
          </Switch>
        </XStack>
      </XStack>

      {/* offset a bit to cover the overlap edge */}
      <YStack ai="center" f={1} x={-20} w="calc(100% + 20px)">
        {selectedSchemes.light && (
          <Theme name="light">
            <Theme name={themeName}>
              <YStack h="50%" gap="$3" ai="center" jc="center" px="$4" pl={60}>
                <XStack ai="center" gap="$4">
                  <Separator />
                  <SizableText size="$2" theme="alt1" selectable={false}>
                    {showAccent ? 'Accent' : 'Base'} Light Theme
                  </SizableText>
                  <Separator />
                </XStack>
                <YStack br="$9" bg="$background" p="$4" mx="$-2">
                  <StudioThemesQuickPreviewSection scheme="light" hasAccent={hasAccent} />
                </YStack>
              </YStack>
            </Theme>
          </Theme>
        )}
        {selectedSchemes.dark && (
          <Theme name="dark">
            <Theme name={themeName}>
              <YStack h="50%" gap="$3" ai="center" jc="center" px="$4" pl={60}>
                <XStack ai="center" gap="$4">
                  <Separator />
                  <SizableText size="$2" theme="alt1" selectable={false}>
                    {showAccent ? 'Accent' : 'Base'} Dark Theme
                  </SizableText>
                  <Separator />
                </XStack>
                <YStack br="$9" bg="$background" p="$4" mx="$-2">
                  <StudioThemesQuickPreviewSection scheme="dark" hasAccent={hasAccent} />
                </YStack>
              </YStack>
            </Theme>
          </Theme>
        )}
      </YStack>
    </>
  )
}
