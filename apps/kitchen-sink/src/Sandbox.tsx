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
      <Paragraph debug="verbose" fontSize={100} ta="center" fontWeight={'900'}>
        Text test with bold
      </Paragraph>
      <Paragraph fontSize={100} ta="center" fontWeight={'100'}>
        Text test default
      </Paragraph>
    </YStack>
  )
}
