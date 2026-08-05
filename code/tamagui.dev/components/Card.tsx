import { YStack, styled } from 'tamagui'

export const Card = styled(YStack, {
  name: 'Card',
  className: 'transition all ease-in ms100',
  rounded: '2',
  borderWidth: 2,
  borderColor: 'transparent',
  bg: 'background hover:backgroundHover press:backgroundPress',
  shrink: 1,
  y: 'hover:-4px press:0px',
  boxShadow: '(0 4px 10px shadowColor) hover:(0 8px 18px shadowColor) press:none',
})
