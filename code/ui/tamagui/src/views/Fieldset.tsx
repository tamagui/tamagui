import type { GetProps } from '@tamagui/core'
import { styled } from '@tamagui/core'
import { YStack } from '@tamagui/stacks'

export const Fieldset = styled(YStack, {
  name: 'Fieldset',
  tag: 'fieldset',

  // remove browser default styling
  borderWidth: 0,

  variants: {
    horizontal: {
      true: {
        flexDirection: 'row',
        alignItems: 'center',
      },
    },
  } as const,
})

export type FieldsetProps = GetProps<typeof Fieldset>
