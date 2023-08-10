import { Stack, styled } from '@tamagui/core'

const Parent = styled(Stack, {
  width: 24,
  height: 24,

  variants: {
    variant: {
      green: {
        backgroundColor: 'green',
      },
    },
  },
})

const Child = styled(Parent, {
  backgroundColor: 'red',
})

export const Sandbox = () => {
  return (
    <Stack flex={1}>
      {/* this should be red */}
      <Child />
      {/* this should be red too, because backgroundColor: 'red' must override styles from variant */}
      <Child variant="green" />
    </Stack>
  )
}
