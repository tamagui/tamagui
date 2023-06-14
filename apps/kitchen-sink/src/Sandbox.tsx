import { useState } from 'react'
import { Button, H1, Stack, styled, useProps } from 'tamagui'

const Frame = styled(Stack, {
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'row',
  gap: '$1',

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
      <FrameContainer
        width={200}
        height={200}
        bg="$blue10"
        isFocused={isFocus}
        isInvalid={isInvalid || isError}
        isError={isError}
      />
      <Frame
        width={200}
        height={200}
        bg="$blue10"
        isFocused={isFocus}
        isInvalid={isInvalid || isError}
        isError={isError}
      />
    </Stack>
  )
}
