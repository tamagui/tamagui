import { styled } from '@tamagui/core'
import { getButtonSized } from '@tamagui/get-button-sized'
import type { GetProps } from '@tamagui/web'
import { ThemeableStack } from './ThemeableStack'
import { bordered, circular, elevate } from './variants'

/**
 * @deprecated v3 no longer uses SizableStack in its behavior packages. Kept as a
 * compat shim for external consumers. Prefer `styled(YStack, { … })` + a size
 * variant, or the copied Surface fixture.
 */
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
