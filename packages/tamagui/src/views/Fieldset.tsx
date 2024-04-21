import type { GetProps } from '@tamagui/core'
import { styled } from '@tamagui/core'
import { YStack } from '@tamagui/stacks'

export const Fieldset = styled(
  YStack,
  {
    tag: 'fieldset',

    variants: {
      horizontal: {
        true: {
          flexDirection: 'row',
          alignItems: 'center',
        },
      },
    } as const,
  },
  {
    name: 'Fieldset',
  }
)

export type FieldsetProps = GetProps<typeof Fieldset>
