import { GetProps, Stack, isWeb, styled } from '@tamagui/core'
import { TextInput } from 'react-native'

import { getSize } from './SizableFrame'
import { sizableTextSizeVariant } from './SizableText'

export const Form = styled(Stack, {
  tag: 'form',
})

const inputSizeFrame = getSize(0.75, 0.75)

const inputSizeVariant = (val = '4', props) => {
  const frame = inputSizeFrame(val, props)
  const font = sizableTextSizeVariant(val, props)
  return {
    ...frame,
    ...font,
  }
}

export const Input = styled(
  // @ts-ignore
  TextInput,
  {
    borderRadius: '$3',
    borderWidth: 1,
    borderColor: '$borderColor',
    backgroundColor: '$bg',
    paddingVertical: '$2',
    paddingHorizontal: '$2',

    // fixes flex bug:
    // <XStack space="$1">
    //   <Input flex={1} size="$1" placeholder="Size 1..." />
    //   <Button size="$1">Go</Button>
    // </XStack>
    // ...(isWeb && {
    // flex: 1,
    // width: '0%',
    // }),

    variants: {
      size: {
        '...size': inputSizeVariant,
      },
    },
  },
  {
    isText: true,
    isInput: true,
    isReactNativeWeb: true,
  }
)

export type InputProps = GetProps<typeof Input>

export const TextArea = styled(
  // @ts-ignore
  TextInput,
  {
    multiline: true,
    numberOfLines: 4,

    borderRadius: '$3',
    borderWidth: 1,
    borderColor: '$borderColor',
    backgroundColor: '$bg',
    paddingVertical: '$2',
    paddingHorizontal: '$2',

    variants: {
      size: {
        '...size': inputSizeVariant,
      },
    },
  },
  {
    isText: true,
    isInput: true,
    isReactNativeWeb: true,
  }
)

export type TextAreaProps = GetProps<typeof TextArea>
