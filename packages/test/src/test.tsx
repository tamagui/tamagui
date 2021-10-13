import { Shorthands, Stack, styled } from '@tamagui/core'

type x2 = Shorthands['bg']
type x = Shorthands['p']
type x3 = Shorthands['s']
type y = Shorthands

const YStack = styled(Stack, {
  variants: {
    bg: {
      'ok wut': {
        backgroundColor: 'red',
      },
    },
  },
})

export const x = () => {
  return (
    <YStack p={10} borderColor="$red" backgroundColor="red" bg="ok wut" aok="err">
      <div />
      <div />
      <div />
    </YStack>
  )
}
