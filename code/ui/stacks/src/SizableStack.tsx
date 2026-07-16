import { styled } from '@tamagui/core'
import { getButtonSized } from '@tamagui/get-button-sized'
import type { GetProps } from '@tamagui/web'
import { ThemeableStack } from './ThemeableStack'
import { bordered, circular, elevate } from './variants'

export const SizableStack = styled(ThemeableStack, {
  name: 'SizableStack',

  variants: {
    circular,
    elevate,

    bordered: {
      true: bordered,
    },

    size: {
      true: getButtonSized,
      Size: getButtonSized,
    },
  } as const,
})

export type SizableStackProps = GetProps<typeof SizableStack>
