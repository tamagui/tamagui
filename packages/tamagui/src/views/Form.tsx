import { Stack, styled } from '@tamagui/core'
import { TextInput } from 'react-native'

import { getSize } from './InteractiveFrame'
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

    variants: {
      size: {
        '...size': inputSizeVariant,
      },
    },
  },
  {
    isText: true,
    isReactNativeWeb: true,
  }
)

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
    isReactNativeWeb: true,
  }
)
