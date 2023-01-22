import { Text, styled } from '@tamagui/core'

const Heading = styled(Text, {
  name: 'Heading',
  fontFamily: '$heading',
  color: '$color',

  variants: {
    size: {
      h1: {
        fontSize: '$xxl',
        fontWeight: '$bold',
      },
      h2: {
        fontSize: '$xl',
        fontWeight: '$bold',
      },
      h3: {
        fontSize: '$lg',
        fontWeight: '$medium',
      },
    },
  } as const,
})

export default Heading
