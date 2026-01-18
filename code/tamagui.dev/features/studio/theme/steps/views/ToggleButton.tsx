import { Button, styled } from 'tamagui'

export const ToggleButton = styled(Button, {
  size: '$2.5',
  rounded: '$0',
  flex: 1,

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
