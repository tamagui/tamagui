import { forwardRef, useState } from 'react'
import {
  Button,
  GetProps,
  H1,
  Stack,
  TamaguiElement,
  Text,
  XStack,
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

const Frame = styled(Stack, {
  context: StyledContext,
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'row',
  gap: '$1',
  w: 100,
  h: 100,
  bg: '$blue10',

  paddingVertical: '$2',
  paddingHorizontal: '$4',

  outlineWidth: 0,

  // this fixes a flex bug where it overflows container
  minWidth: 0,
  height: '$10',

  borderWidth: 5,
  borderRadius: '$10',
  variants: {
    isError: {
      true: {
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0,
        // borderBottomEndRadius: 0,
        // borderBottomRightRadius: 0,
        // borderWidth: 0,
        borderBottomWidth: 0,

        hoverStyle: {
          borderBottomWidth: 0,
        },
      },
    },

    isInvalid: {
      true: {
        borderColor: '$red10',
        borderWidth: 5,

        hoverStyle: {
          borderColor: '$red10',
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

const ForwardRefContainer = forwardRef<TamaguiElement, GetProps<typeof Frame>>(
  (propsIn, ref) => {
    return (
      <Stack>
        <Frame ref={ref} {...propsIn} />
      </Stack>
    )
  }
)

const ContainerWithStaticProperty = withStaticProperties(ForwardRefContainer, {})

// TODO this is a great test: media + animation + space (test without animation too)
// <Stack
//       animation="bouncy"
//       space="$4"
//       debug="verbose"
//       backgroundColor="blue"
//       $sm={{
//         backgroundColor: 'yellow',
//       }}
//       $md={{
//         space: '$5',
//         backgroundColor: 'red',
//       }}
//     >
//       <Square size={20} bc="red" />
//       <Square size={20} bc="red" />
//       <Square size={20} bc="red" />
//     </Stack>

export const Sandbox = () => {
  const [isError, setIsError] = useState(false)
  const [isFocus, setIsFocus] = useState(false)
  const [isInvalid, setIsInvalid] = useState(false)
  return (
    <Stack>
      <Button onPress={() => setIsInvalid(!isInvalid)}>
        Toggle invalid {isInvalid ? 'true' : 'false'}
      </Button>
      <Button onPress={() => setIsError(!isError)}>
        Toggle error {isError ? 'true' : 'false'}
      </Button>
      <Button onPress={() => setIsFocus(!isFocus)}>
        Toggle focus {isFocus ? 'true' : 'false'}
      </Button>
      <XStack>
        <Stack>
          <Text>With Styled Context</Text>
          <StyledContext.Provider
            isFocused={isFocus}
            isInvalid={isInvalid || isError}
            isError={isError}
          >
            <Stack>
              <FrameContainer />
              <ContainerWithStaticProperty />
              <Frame />
              <ForwardRefContainer />
            </Stack>
          </StyledContext.Provider>
        </Stack>
        <Stack>
          <Text>Without Styled Context</Text>
          <Stack>
            <FrameContainer
              isFocused={isFocus}
              isInvalid={isInvalid || isError}
              isError={isError}
            />
            <ContainerWithStaticProperty
              isFocused={isFocus}
              isInvalid={isInvalid || isError}
              isError={isError}
            />
            <Frame
              isFocused={isFocus}
              isInvalid={isInvalid || isError}
              isError={isError}
            />
            <ForwardRefContainer
              isFocused={isFocus}
              isInvalid={isInvalid || isError}
              isError={isError}
            />
          </Stack>
        </Stack>
      </XStack>
    </Stack>
  )
}
