import { GetProps, styled } from '@tamagui/core'
import { YStack } from '@tamagui/stacks'

export const Fieldset = styled(YStack, {
  name: 'Fieldset',

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
