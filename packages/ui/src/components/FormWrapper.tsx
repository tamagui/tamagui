import { forwardRef } from 'react'
import { ScrollView, TamaguiElement, YStack, YStackProps, withStaticProperties } from 'tamagui'

/**
 * this is pretty straightforward on web - check FormWrapper.native
 */
const Wrapper = forwardRef<TamaguiElement, YStackProps>(function Wrapper(props, ref) {
  return (
    <YStack
      ref={ref}
      gap="$4"
      flex={1}
      jc="center"
      $gtSm={{
        width: '100%',
        maxWidth: 600,
        als: 'center',
      }}
      // $gtSm={{ width: 500, mx: 'auto' }}
      $sm={{ jc: 'space-between' }}
      {...props}
    />
  )
})

const Body = forwardRef<TamaguiElement, YStackProps>(function Body(props, ref) {
  return (
    <ScrollView>
      <YStack p="$4" ref={ref} gap="$2" pb="$8" {...props} />
    </ScrollView>
  )
})

const Footer = forwardRef<TamaguiElement, YStackProps>(function Footer(props, ref) {
  return <YStack ref={ref} pb="$4" px="$4" gap="$4" {...props} />
})

export const FormWrapper = withStaticProperties(Wrapper, {
  Body,
  Footer,
})
