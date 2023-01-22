import { styled } from '@tamagui/core'

import Box from './Box'

const Card = styled(Box, {
  name: 'Card',

  backgroundColor: '$background',
  borderRadius: '$md',
  shadow: 'md',
  px: '$md',
  py: '$md',
})

export default Card
