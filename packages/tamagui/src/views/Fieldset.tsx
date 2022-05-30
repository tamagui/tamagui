import { GetProps, styled } from '@tamagui/core'
import { ThemeableStack, YStack } from '@tamagui/stacks'

export const Fieldset = styled(YStack, {
  name: 'Fieldset',

  variants: {
    horizontal: {
      true: {
        flexDirection: 'row',
        alignItems: 'center',
      },
    },

    // TODO see core/styled.ts bug
  } as const,
})

export type FieldsetProps = GetProps<typeof Fieldset>
