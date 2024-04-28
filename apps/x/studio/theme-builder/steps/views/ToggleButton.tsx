import { Button, styled } from 'tamagui'

export const ToggleButton = styled(Button, {
  size: '$2.5',
  br: '$0',
  f: 1,
  fontFamily: '$mono',
  fontSize: '$2',
  letterSpacing: 1,

  variants: {
    active: {
      true: {
        theme: 'active',
      },
      false: {
        chromeless: true,
      },
    },
  } as const,
})
