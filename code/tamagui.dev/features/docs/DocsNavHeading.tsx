import { H4, styled } from 'tamagui'

export const DocsNavHeading = styled(H4, {
  size: '$2',
  px: '$3',
  pt: '$4',
  pb: '$1',
  ls: 2,
  color: '$gray9',

  variants: {
    inMenu: {
      true: {},
      false: {
        ml: 'auto',
      },
    },
  } as const,
})
