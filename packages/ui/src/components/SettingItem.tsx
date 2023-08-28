import { IconProps } from '@tamagui/helpers-icon'
import { ListItem, ListItemProps, SizableText, XStack, YGroup, YStack } from 'tamagui'

export type SettingItemProps = {
  icon: React.FC<IconProps>
  rightLabel?: string
  accentColor?: ListItemProps['backgroundColor']
  /**
   * web only - to indicate the current page
   */
  isActive?: boolean
} & ListItemProps

export const SettingItem = ({
  icon: Icon,
  children,
  rightLabel,
  isActive,
  ...props
}: SettingItemProps) => {
  return (
    <YGroup.Item>
      <ListItem
        hoverTheme
        cursor="pointer"
        gap="$2"
        borderRadius="$10"
        backgroundColor={isActive ? '$backgroundFocus' : 'transparent'}
        {...props}
      >
        <YStack padding="$2" borderRadius="$3">
          <Icon opacity={0.6} size={18} />
        </YStack>
        <SizableText flex={1}>{children}</SizableText>
        {!!rightLabel && (
          <XStack borderRadius="$10" backgroundColor="$backgroundPress" px="$3" py="$1.5">
            <SizableText size="$1" textTransform="capitalize">
              {rightLabel}
            </SizableText>
          </XStack>
        )}
      </ListItem>
    </YGroup.Item>
  )
}
