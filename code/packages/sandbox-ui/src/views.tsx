import { Text, styled } from 'tamagui'

export const Tag = styled(Text, {
  className: 'hero-tag text-decoration-none',
  // @ts-ignore
  fontFamily: 'inherit',
  // @ts-ignore
  fontSize: 'inherit',
  borderRadius: '2',
  cursor: 'pointer',
  color: 'color hover:color',
  backgroundColor: 'color-2 hover:color-3',
  variants: {
    active: {
      true: {
        color: 'color-10 hover:color-12',
        backgroundColor: 'color-5 hover:color-5',
      },
    },
  },
})
