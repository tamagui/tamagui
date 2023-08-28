import { forwardRef } from 'react'
import {
  GroupProps,
  H2,
  HeadingProps,
  Separator,
  TamaguiElement,
  XStack,
  YGroup,
  YStack,
  YStackProps,
  isWeb,
  withStaticProperties,
} from 'tamagui'
import { SettingItem } from './SettingItem'

const SettingsWrapper = forwardRef<TamaguiElement, YStackProps>(function SettingsWrapper(
  props,
  ref
) {
  return (
    <YStack
      ref={ref}
      // borderTopWidth="$0.25"
      // borderBottomWidth="$0.25"
      borderColor="$color4"
      gap="$5"
      f={1}
      {...props}
    />
  )
})

const SettingsItems = forwardRef<TamaguiElement, YStackProps>(function SettingsItems(props, ref) {
  return (
    <YStack
      {...(isWeb
        ? {
            separator: <Separator borderColor="$color3" mx="$-4" borderWidth="$0.25" />,
            gap: '$4',
            m: '$4',
          }
        : {
            gap: '$4',
            m: '$4',
          })}
      ref={ref}
      {...props}
    />
  )
})

const SettingsGroup = (props: GroupProps) => (
  <YGroup
    backgroundColor="transparent"
    // borderRadius="$4"
    disablePassBorderRadius={isWeb}
    separator={
      !isWeb ? (
        <XStack>
          <YStack width={20} backgroundColor="$color2" />
          <Separator borderColor="$color4" borderWidth="$0.25" />
        </XStack>
      ) : undefined
    }
    {...props}
  />
)

const SettingsTitle = forwardRef<TamaguiElement, HeadingProps>(function SettingsTitle(props, ref) {
  return <H2 mx={isWeb ? '$6' : '$4'} py="$4" ref={ref} {...props} />
})

export const Settings = withStaticProperties(SettingsWrapper, {
  Item: SettingItem,
  Items: SettingsItems,
  Group: SettingsGroup,
  Title: SettingsTitle,
})
