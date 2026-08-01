import { Square, View, XStack, styled } from 'tamagui'

const GroupTest = styled(View, {
  group: 'testy',
  container: true,
})

const GroupChild = styled(View, {
  width: 100,
  height: 100,
  backgroundColor:
    'rgb(255,0,0) press:rgb(0,0,0) group-hover/testy:rgb(160, 32, 240) group-press/testy:rgb(255,255,0) @max-md:rgb(0,255,0) @max-md:group-hover/testy:rgb(160, 32, 240) @max-md:group-press/testy:rgb(255,255,0)',
})

const GroupChildMedia = styled(GroupChild, {
  width: 100,
  height: 100,
  backgroundColor:
    'rgb(255,0,0) group-hover/testy:rgb(160, 32, 240) group-press/testy:rgb(255,255,0) @max-md:rgb(0,255,0) @max-md:group-hover/testy:rgb(160, 32, 240) @max-md:group-press/testy:rgb(255,255,0)',
})

export function GroupProp() {
  return (
    <View margin={20}>
      <GroupTest>
        <GroupChild id="styled" />
      </GroupTest>

      <GroupTest width={1000}>
        <GroupChildMedia id="styled-media-unmatched" />
      </GroupTest>

      <GroupTest width={200}>
        <GroupChildMedia id="styled-media-matched" />
      </GroupTest>

      <XStack group="testy">
        <Square id="inline" bg="rgb(0,0,255)" size={100} />
      </XStack>
    </View>
  )
}
