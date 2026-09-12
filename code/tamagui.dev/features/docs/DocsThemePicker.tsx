import useSWR from 'swr'
import { XStack } from 'tamagui'
import {
  themeBuilderStore,
  useThemeBuilderStore,
} from '../studio/theme/store/ThemeBuilderStore'
import { PickerSelect } from './DocsVersionPicker'
import { freeThemes, type FreeTheme } from './freeThemes'

export function DocsThemePicker() {
  const { currentThemeId } = useThemeBuilderStore()
  const { data } = useSWR<{ themes: FreeTheme[] }>('/api/theme/free', async (url) => {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to load free themes: ${response.status}`)
    }
    return response.json()
  })

  return (
    <XStack width="100%" pr="6">
      <PickerSelect
        label="Theme"
        testID="docs-theme"
        value={currentThemeId || 'default'}
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
    </XStack>
  )
}
