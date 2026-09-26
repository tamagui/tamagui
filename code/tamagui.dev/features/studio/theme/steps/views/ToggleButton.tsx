import { styled } from 'tamagui'
import { Button } from '~/components/Button'

export const ToggleButton = styled(Button, {
  size: 'sm',
  rounded: '0',
  flex: 1,
  variants: {
    // the active theme is set by the caller: variants hold styles only
    active: {
      false: {
        variant: 'quiet',
      },
    },
  } as const,
})
