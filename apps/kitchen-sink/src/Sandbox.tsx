// import './wdyr'

import { forwardRef } from 'react'
import { Platform } from 'react-native'
import { Button, Paragraph, TamaguiElement, YStack, withStaticProperties } from 'tamagui'

export const LinkButton = withStaticProperties(
  forwardRef(function LinkButton(
    { ...props }: Omit<React.ComponentProps<typeof Button>, 'href' | 'target'>,
    ref: React.Ref<TamaguiElement>
  ) {
    return (
      <Button
        ref={ref}
        {...props}
        {...(props.disabled && Platform.OS === 'web' && { href: undefined })}
        tag="a"
      />
    )
  }),
  {
    Text: Button.Text,
    Icon: Button.Icon,
  }
)

export const Sandbox = () => {
  return (
    <YStack>
      <Paragraph size="$10" ta="center">
        Text test with bold
      </Paragraph>
      <Paragraph ta="center" fontSize={40} lh={40}>
        Text test default
      </Paragraph>
    </YStack>
  )
}
