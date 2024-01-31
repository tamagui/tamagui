import { H4, styled } from 'tamagui'

export const NavHeading = styled(H4, {
  size: '$2',
  px: '$4',
  ml: 'auto',
  pt: '$1',
  pb: '$2',
  ls: 2,
  color: '$gray7',

  variants: {
    inMenu: {
      true: {},
      false: {
        // ta: 'right',
        // bc: 'red',
        // f: 1,
        // w: '100%',
      },
    },
  } as const,
})
