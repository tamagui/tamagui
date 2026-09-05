import { YStack, styled } from 'tamagui'

export const Card = styled(YStack, {
  displayName: 'Card',
  className: 'transition all ease-in ms100',
  rounded: '2',
  borderWidth: 2,
  borderColor: 'transparent',
  bg: 'background hover:background-hover press:background-press',
  shrink: 1,
  y: 'hover:-4px press:0px',
  boxShadow: '0 6px 12px shadow-color hover:0 10px 20px shadow-color press:none',
})
