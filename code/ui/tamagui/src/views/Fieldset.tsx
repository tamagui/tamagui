import type { GetProps } from '@tamagui/style'
import { styled } from '@tamagui/style'
import { YStack } from '@tamagui/stacks'

export const Fieldset = styled(YStack, {
  displayName: 'Fieldset',
  className: 'tm-fieldset',
  render: 'fieldset',

  // remove browser default styling
  display: 'flex',
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
