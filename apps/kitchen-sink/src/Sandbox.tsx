import { Stack, Text, styled } from '@tamagui/core'

const Parent = styled(Stack, {
  variants: {
    variant: {
      red: {
        backgroundColor: 'red',
      },
    },
  },
})

const Child = styled(Parent, {
  backgroundColor: 'yellow',
  variants: {
    otherVariant: {
      green: {
        backgroundColor: 'green',
      },
    },
  },
})

export const Sandbox = () => {
  return (
    <Stack flex={1}>
      <Child>
        <Text>This should be yellow</Text>
      </Child>
      <Child variant="red">
        <Text>This should be yellow too</Text>
      </Child>
      <Child otherVariant="green">
        <Text>This should be green</Text>
      </Child>
      <Child otherVariant="green" variant="red">
        <Text>This should also be green</Text>
      </Child>
      <Child variant="red" otherVariant="green">
        <Text>And this should be green too</Text>
      </Child>
      <Child backgroundColor="magenta" variant="red" otherVariant="green">
        <Text>This should be magenta</Text>
      </Child>
      <Child variant="red" backgroundColor="magenta" otherVariant="green">
        <Text>As well as this</Text>
      </Child>
      <Child variant="red" otherVariant="green" backgroundColor="magenta">
        <Text>And this</Text>
      </Child>
    </Stack>
  )
}
