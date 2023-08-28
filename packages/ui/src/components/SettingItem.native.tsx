import { ChevronRight } from '@tamagui/lucide-icons'
import { ListItem, SizableText, YGroup, YStack } from 'tamagui'
import { SettingItemProps } from './SettingItem'

export const SettingItem = ({
  icon: Icon,
  children,
  accentColor,
  rightLabel,
  ...props
}: SettingItemProps) => {
  return (
    <YGroup.Item>
      <ListItem cursor="pointer" gap="$4" hoverTheme pressTheme {...props}>
        <YStack backgroundColor={accentColor} padding="$2" borderRadius="$3">
          <Icon color="white" size={18} />
        </YStack>
        <SizableText color="$color" fontSize={18} flex={1}>
          {children}
        </SizableText>
        {rightLabel ? (
          <SizableText color="$color11" textTransform="capitalize">
            {rightLabel}
          </SizableText>
        ) : (
          <ChevronRight size={20} color="$color9" />
        )}
      </ListItem>
    </YGroup.Item>
  )
}
