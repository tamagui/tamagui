import { memo } from 'react'
import { Button, XStack, YStack, SizableText } from 'tamagui'
import { Trash2 } from '@tamagui/lucide-icons'
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
      size="$4"
      theme={isActive ? 'active' : undefined}
      onPress={onPress}
      borderWidth={1}
      borderColor={isActive ? '$color8' : '$color5'}
      backgroundColor={isActive ? '$color3' : '$color1'}
      pressStyle={{
        backgroundColor: '$color2',
      }}
    >
      <XStack f={1} ai="center" jc="space-between" gap="$3">
        <YStack f={1} ai="flex-start">
          <SizableText size="$3" fontWeight="600">
            {label}
          </SizableText>
          <SizableText size="$2" theme="alt1">
            {theme.type === 'theme' ? `Palette: ${theme.palette}` : 'Mask theme'}
          </SizableText>
        </YStack>

        {onDelete && (
          <Button
            size="$2"
            icon={Trash2}
            circular
            chromeless
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
