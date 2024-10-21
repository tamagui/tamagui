import { styled, View } from 'tamagui'

export const PageContainer = styled(View, {
  w: '100%',
  maw: 600,
  mx: 'auto',
  bg: '$color1',

  '$platform-web': {
    py: '$4',
  },
})
