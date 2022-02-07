import { Box, styled } from 'tamagui'

export const Card = styled(Box, {
  className: 'transition all ease-in ms100',
  borderRadius: '$2',
  backgroundColor: '$bg',
  flexShrink: 1,
  elevation: '$2',
  hoverStyle: {
    backgroundColor: '$bg2',
    elevation: '$4',
    y: -4,
  },
})
