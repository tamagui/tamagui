import { useHeaderHeight as useHeaderHeightOG } from '@react-navigation/elements'
import { createContext, forwardRef, useContext, useState } from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
import {
  ScrollView,
  TamaguiElement,
  YStack,
  YStackProps,
  useWindowDimensions,
  withStaticProperties,
} from 'tamagui'

const useHeaderHeight = () => {
  try {
    return useHeaderHeightOG()
  } catch (error) {
    return 0
  }
}

const FormWrapperContext = createContext<{ height: number } | null>(null)
/**
 * this utility component is for creating forms where we want to
 * push the action button to the bottom of the screen on native
 * it also handles keyboard avoidance
 *
 * wrap the fields inside Body and the actions in Footer
 *
 * you may use asChild on the wrapper as well
 */
const Wrapper = forwardRef<TamaguiElement, YStackProps>(function Wrapper(props, ref) {
  const [height, setHeight] = useState(0)

  return (
    <FormWrapperContext.Provider value={{ height }}>
      <YStack
        onLayout={(event) => {
          setHeight(event.nativeEvent.layout.height)
        }}
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
    </FormWrapperContext.Provider>
  )
})

const Body = forwardRef<TamaguiElement, YStackProps>(function Body(props, ref) {
  return (
    <ScrollView>
      <YStack p="$4" ref={ref} gap="$2" pb="$8" {...props} />
    </ScrollView>
  )
})

/**
 * on native, this will be pushed to the bottom of the screen
 */
const Footer = forwardRef<TamaguiElement, YStackProps>(function Footer(props, ref) {
  const dimensions = useWindowDimensions()
  const headerHeight = useHeaderHeight()
  const formWrapperContext = useContext(FormWrapperContext)
  const modalOffsetFromTop = formWrapperContext
    ? dimensions.height - formWrapperContext.height
    : headerHeight

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={modalOffsetFromTop}
    >
      <YStack
        ref={ref}
        pb="$4"
        px="$4"
        gap="$4"
        // reverse the direction so that the primary button is on the bottom of the screen on mobile
        flexDirection="column-reverse"
        {...props}
      />
    </KeyboardAvoidingView>
  )
})

export const FormWrapper = withStaticProperties(Wrapper, {
  Body,
  Footer,
})
