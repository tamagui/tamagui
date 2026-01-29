import { View, Text, YStack, styled } from 'tamagui'

const CustomYStack = styled(YStack, {
  backgroundColor: 'yellow',
  hoverStyle: {
    backgroundColor: 'red',
  },
})

export function PseudoStyleMerge() {
  return (
    <View flex={1} items="center" justify="center">
      <CustomYStack
        width={100}
        height={100}
        hoverStyle={{
          scale: 2,
        }}
        transition="quick"
      >
        <Text>hi</Text>
      </CustomYStack>
    </View>
  )
}
