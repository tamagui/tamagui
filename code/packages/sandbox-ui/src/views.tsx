import { Text, styled } from 'tamagui'

export const Tag = styled(Text, {
className: 'hero-tag text-decoration-none',
// @ts-ignore
fontFamily: 'inherit',
// @ts-ignore
fontSize: 'inherit',
borderRadius: "2",
cursor: 'pointer',
color: "color hover:color",
backgroundColor: "color2 hover:color3",
variants: {
    active: {
      true: {
      color: "color10 hover:color12",
      backgroundColor: "color5 hover:color5"
      },
    },
  }
})
