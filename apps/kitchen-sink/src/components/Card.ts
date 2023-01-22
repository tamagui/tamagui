import { styled } from '@tamagui/core'

import Box from './Box'

const Card = styled(Box, {
  name: 'Card',

  backgroundColor: '$background',
  borderRadius: '$5',
  px: '$5',
  py: '$5',
})

export default Card
