import { styled } from 'tamagui'
import { Button } from '~/components/Button'

export const ToggleButton = styled(Button, {
  size: 'small',
  rounded: '$0',
  flex: 1,

  variants: {
    active: {
      true: {
        theme: 'accent',
      },
      false: {
        variant: 'quiet',
      },
    },
  } as const,
})
