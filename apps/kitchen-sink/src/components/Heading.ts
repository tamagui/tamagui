import { Text, styled } from '@tamagui/core'

const Heading = styled(Text, {
  name: 'Heading',
  fontFamily: '$heading',
  color: '$color',

  variants: {
    size: {
      h1: {
        fontSize: '$5',
        fontWeight: '$bold',
      },
      h2: {
        fontSize: '$5',
        fontWeight: '$bold',
      },
      h3: {
        fontSize: '$5',
        fontWeight: '$medium',
      },
    },
  } as const,
})

export default Heading
