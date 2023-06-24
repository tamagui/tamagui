import { Paragraph, XStack, YStack } from 'tamagui'

const PaletteExample = () => (
  <XStack br="$5" ov="hidden" bw={1} boc="$borderColor">
    {new Array(13).fill(0).map((_, i) => (
      <XStack key={i} h={40} f={1} bc={`$blue${i}`} />
    ))}
  </XStack>
)

export const ExamplePalette = () => {
  return (
    <YStack my="$4" space="$2">
      <XStack jc="space-between">
        <Paragraph size="$2" theme="alt2">
          Background
        </Paragraph>
        <Paragraph size="$2" theme="alt2">
          Foreground
        </Paragraph>
      </XStack>
      <PaletteExample />
    </YStack>
  )
}

export const ExampleTemplate = () => {
  return (
    <YStack my="$4" space="$2">
      <XStack jc="space-between">
        <Paragraph size="$2" theme="alt2">
          Background
        </Paragraph>
        <Paragraph size="$2" theme="alt2">
          Foreground
        </Paragraph>
      </XStack>
      <PaletteExample />
    </YStack>
  )
}
