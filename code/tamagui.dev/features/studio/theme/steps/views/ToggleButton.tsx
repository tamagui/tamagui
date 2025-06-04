import { Button, styled } from 'tamagui'

export const ToggleButton = styled(Button, {
  size: '$2.5',
  br: '$0',
  f: 1,
  fontFamily: '$mono',
  fontSize: '$3',
  letterSpacing: 0.25,

  variants: {
    active: {
      true: {
        theme: 'accent',
      },
      false: {
        chromeless: true,
      },
    },
  } as const,
})
