import { Button, styled } from 'tamagui'

export const ToggleButton = styled(Button, {
  size: '$2.5',
  rounded: '$0',
  flex: 1,
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
