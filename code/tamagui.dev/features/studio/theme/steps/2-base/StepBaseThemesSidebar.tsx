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
  const { name: themeNameBase } = useBaseThemePreview()

  // force re-render on every change
  themeBuilder.themeSuiteVersion

  return (
    <YStack flex={1} flexBasis="auto">
      {/* fixes some bug in updating first time */}
      <Contents key={themeBuilder.themeSuiteVersion} themeNameBase={themeNameBase} />
    </YStack>
  )
}

const Contents = ({ themeNameBase }: { themeNameBase: string }) => {
  const themeBuilder = useThemeBuilderStore()
  const { schemes, accentSetting } = themeBuilder
  const procedureStore = useStore(StudioProcedureStore)
  const [showAccent, setShowAccent] = useState(false)
  const themeName = (showAccent ? `${themeNameBase}_accent` : themeNameBase) as ThemeName

  return (
    <>
      <XStack position="absolute" t="$4" l={30} z={1000} gap="$4" scale={0.75}>
        {procedureStore.loading.createStudioThemes ? <Spinner size="small" /> : null}
      </XStack>

      <XStack position="absolute" t="$4" r="$4" z={1000}>
        <XStack
          opacity={accentSetting === 'off' ? 0.5 : 1}
          gap="$2"
          ml="auto"
          items="center"
          height="$2"
        >
          <Label size="$3" color="$color">
            Accent
          </Label>
          <Switch
            disabled={accentSetting === 'off'}
            checked={showAccent}
            onCheckedChange={setShowAccent}
            size="$1"
          >
            <Switch.Thumb transition="quickest" />
          </Switch>
        </XStack>
      </XStack>

      {/* offset a bit to cover the overlap edge */}
      <YStack items="center" flex={1} flexBasis="auto" x={-20} width="calc(100% + 20px)">
        {schemes.light && (
          <Theme name="light">
            <Theme name={themeName}>
              <YStack
                height="50%"
                gap="$3"
                items="center"
                justify="center"
                px="$4"
                pl={60}
              >
                <XStack items="center" gap="$4">
                  <Separator />
                  <SizableText size="$2" color="$color10" select="none">
                    {showAccent ? 'Accent' : 'Base'} Light Theme
                  </SizableText>
                  <Separator />
                </XStack>
                <YStack rounded="$9" bg="$background" p="$4" mx="$-2">
                  <StudioThemesQuickPreviewSection
                    scheme="light"
                    hasAccent={accentSetting !== 'off'}
                  />
                </YStack>
              </YStack>
            </Theme>
          </Theme>
        )}
        {schemes.dark && (
          <Theme name="dark">
            <Theme name={themeName}>
              <YStack
                height="50%"
                gap="$3"
                items="center"
                justify="center"
                px="$4"
                pl={60}
              >
                <XStack items="center" gap="$4">
                  <Separator />
                  <SizableText size="$2" color="$color10" select="none">
                    {showAccent ? 'Accent' : 'Base'} Dark Theme
                  </SizableText>
                  <Separator />
                </XStack>
                <YStack rounded="$9" bg="$background" p="$4" mx="$-2">
                  <StudioThemesQuickPreviewSection
                    scheme="dark"
                    hasAccent={accentSetting !== 'off'}
                  />
                </YStack>
              </YStack>
            </Theme>
          </Theme>
        )}
      </YStack>
    </>
  )
}
