import { XStack } from 'tamagui'

export const Example1 = () => {
  return (
    <XStack br="$5" ov="hidden" bw={1} boc="$borderColor" my="$4">
      {new Array(13).fill(0).map((_, i) => (
        <XStack key={i} h={40} f={1} bc={`$blue${i}`} />
      ))}
    </XStack>
  )
}
