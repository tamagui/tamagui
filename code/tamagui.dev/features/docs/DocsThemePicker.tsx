import { CheckCircle, Copy } from '@tamagui/local-icons'
import useSWR from 'swr'
import { TooltipSimple, XStack } from 'tamagui'
import { useClipboard } from '~/hooks/useClipboard'
import { generateThemeBuilderCode } from '../studio/api/generateThemeBuilderCode'
import { defaultThemeSuiteItem } from '../studio/theme/defaultThemeSuiteItem'
import {
  themeBuilderStore,
  useThemeBuilderStore,
} from '../studio/theme/store/ThemeBuilderStore'
import { PickerSelect } from './DocsVersionPicker'
import { freeThemes, type FreeTheme } from './freeThemes'

export function DocsThemePicker() {
  const { currentThemeId } = useThemeBuilderStore()
  const { hasCopied, onCopy } = useClipboard()
  const { data } = useSWR<{ themes: FreeTheme[] }>('/api/theme/free', async (url) => {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to load free themes: ${response.status}`)
    }
    return response.json()
  })

  return (
    <XStack width="100%" pr="8" items="center" gap="1-5">
      <PickerSelect
        label="Theme"
        testID="docs-theme"
        value={currentThemeId || 'default'}
        showLabel
        items={[
          { value: 'default', label: 'Default' },
          ...freeThemes.map((theme) => ({
            value: String(theme.id),
            label: theme.label,
          })),
        ]}
        onValueChange={(value) => {
          if (value === 'default') {
            themeBuilderStore.clearTheme()
            return
          }

          const theme = data?.themes.find((option) => String(option.id) === value)
          if (theme) {
            themeBuilderStore.updateGenerate(theme.themeData, theme.searchQuery, theme.id)
          }
        }}
      />

      {/* the site Button wraps itself in a Button sub-theme, so color-9 there
          lands brighter than the picker's chevron. this is a bare 28px square
          instead, so the icon can sit at the same weight as that chevron */}
      <TooltipSimple label={hasCopied ? 'Copied' : 'Copy theme config'}>
        <XStack
          render="button"
          testID="docs-theme-copy"
          aria-label="Copy theme config to clipboard"
          items="center"
          justify="center"
          width={28}
          height={28}
          rounded="4"
          borderWidth={0}
          cursor="pointer"
          bg="transparent hover:color-3"
          onPress={async () => {
            // clearTheme leaves the last selected palettes on the store, so the
            // default entry generates from the defaults rather than from those
            onCopy(
              await generateThemeBuilderCode(
                currentThemeId
                  ? themeBuilderStore.getWorkingThemeSuite()
                  : defaultThemeSuiteItem
              )
            )
          }}
        >
          {hasCopied ? (
            <CheckCircle size={13} color="color-11" />
          ) : (
            <Copy size={13} color="color-9" />
          )}
        </XStack>
      </TooltipSimple>
    </XStack>
  )
}
