import { memo } from 'react'
import { XStack, YStack, SizableText } from 'tamagui'
import { Button } from '~/components/Button'
import { Trash2 } from '@tamagui/lucide-icons-2'
import type { BuildTheme } from '../../types'

type BuildThemeItemProps = {
  theme: BuildTheme
  isActive: boolean
  enableEditLabel?: boolean
  label: string
  onUpdate?: (theme: Partial<BuildTheme>) => void
  onDelete?: () => void
  onPress?: () => void
}

export const BuildThemeItem = memo((props: BuildThemeItemProps) => {
  const { theme, isActive, label, onDelete, onPress } = props

  return (
    <Button
      size="4"
      theme={isActive ? 'accent' : undefined}
      onPress={onPress}
      borderWidth={1}
      borderColor={isActive ? 'color-8' : 'color-5'}
      bg={isActive ? 'color-3 press:color-2' : 'color-1 press:color-2'}
    >
      <XStack flex={1} items="center" justify="space-between" gap="3">
        <YStack flex={1} items="flex-start">
          <SizableText size="3" fontWeight="600">
            {label}
          </SizableText>
          <SizableText size="2" color="color-10">
            {theme.type === 'theme' ? `Palette: ${theme.palette}` : 'Mask theme'}
          </SizableText>
        </YStack>

        {onDelete && (
          <Button
            size="2"
            icon={Trash2}
            circular
            variant="quiet"
            onPress={(e) => {
              e.stopPropagation()
              onDelete()
            }}
          />
        )}
      </XStack>
    </Button>
  )
})

BuildThemeItem.displayName = 'BuildThemeItem'
