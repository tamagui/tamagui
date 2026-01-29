import React from 'react'
import type { GetProps, TamaguiElement } from 'tamagui'
import {
  Paragraph,
  Separator,
  View,
  Text,
  XStack,
  YStack,
  createStyledContext,
  styled,
  useProps,
  withStaticProperties,
} from 'tamagui'

const StyledContext = createStyledContext({
  isInvalid: false,
  isError: false,
  isFocused: false,
})

const Frame = styled(View, {
  context: StyledContext,
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'row',
  gap: '$1',
  width: 100,
  height: 100,
  bg: '$blue10',

  paddingVertical: '$2',
  paddingHorizontal: '$4',

  outlineWidth: 0,

  // this fixes a flex bug where it overflows container
  minWidth: 0,

  borderWidth: 5,
  borderRadius: '$10',
  variants: {
    isError: {
      true: {
        borderColor: '$red10',
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0,
        borderBottomWidth: 0,

        hoverStyle: {
          borderColor: '$red10',
          borderBottomWidth: 0,
        },
      },
    },

    isInvalid: {
      true: {
        borderColor: '$yellow10',
        borderWidth: 5,

        hoverStyle: {
          borderColor: '$yellow10',
          borderWidth: 5,
        },
      },
    },

    isFocused: {
      true: {
        borderColor: '$green10',
        borderWidth: 10,
      },
    },
  } as const,
})

const FrameContainer = Frame.styleable((propsIn, ref) => {
  const props = useProps(propsIn)
  return <Frame ref={ref} {...props} />
})

const ForwardRefContainer = React.forwardRef<TamaguiElement, GetProps<typeof Frame>>(
  (propsIn, ref) => {
    return (
      <View>
        <Frame ref={ref} {...propsIn} />
      </View>
    )
  }
)

const ContainerWithStaticProperty = withStaticProperties(ForwardRefContainer, {})

export function ComplexVariants() {
  return (
    <View>
      {[
        [false, false, false],
        [true, false, false],
        [false, true, false],
        [false, false, true],
        [true, true, true],
      ].map(([isFocus, isInvalid, isError], index) => (
        <YStack mt="$8" key={index}>
          <Separator />
          <XStack gap="$4">
            <Paragraph color="#fff" fontWeight="800" bg={isFocus ? '$green10' : '$red10'}>
              isFocus
            </Paragraph>
            <Paragraph
              color="#fff"
              fontWeight="800"
              bg={isInvalid ? '$green10' : '$red10'}
            >
              isInvalid
            </Paragraph>
            <Paragraph color="#fff" fontWeight="800" bg={isError ? '$green10' : '$red10'}>
              isError
            </Paragraph>
          </XStack>
          <>
            <Text>With Styled Context</Text>
            <StyledContext.Provider
              isFocused={isFocus}
              isInvalid={isInvalid}
              isError={isError}
            >
              <XStack>
                <FrameContainer />
                <ContainerWithStaticProperty />
                <Frame />
                <ForwardRefContainer />
              </XStack>
            </StyledContext.Provider>
          </>
          <View>
            <Text>Without Styled Context</Text>
            <XStack>
              <FrameContainer
                isFocused={isFocus}
                isInvalid={isInvalid}
                isError={isError}
              />

              <ContainerWithStaticProperty
                isFocused={isFocus}
                isInvalid={isInvalid}
                isError={isError}
              />

              <Frame isFocused={isFocus} isInvalid={isInvalid} isError={isError} />
              <ForwardRefContainer
                isFocused={isFocus}
                isInvalid={isInvalid}
                isError={isError}
              />
            </XStack>
          </View>
        </YStack>
      ))}
    </View>
  )
}
