import { Stack, Text, YStack, styled } from 'tamagui'

const CustomYStack = styled(YStack, {
  backgroundColor: 'yellow',
  hoverStyle: {
    backgroundColor: 'red',
  },
})

export function PseudoStyleMerge() {
  return (
    <Stack f={1} ai="center" jc="center">
      <CustomYStack
        width={100}
        height={100}
        hoverStyle={{
          scale: 2,
        }}
        animation="quick"
      >
        <Text>hi</Text>
      </CustomYStack>
    </Stack>
  )
}
