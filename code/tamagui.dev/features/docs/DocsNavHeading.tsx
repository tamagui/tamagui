import { H4, styled } from 'tamagui'

export const DocsNavHeading = styled(H4, {
  fontFamily: 'mono',
  px: '3',
  pt: '4',
  pb: '1',
  letterSpacing: 2,
  color: 'gray9',
  size: '2',
  variants: {
    inMenu: {
      true: {},
      false: {
        ml: 'auto',
      },
    },
  } as const,
})
