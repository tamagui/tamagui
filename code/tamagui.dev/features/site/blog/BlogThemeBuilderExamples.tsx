import { Paragraph, Separator, XStack, YStack } from 'tamagui'

const PaletteExample = ({
  showIndices,
  showNegativeIndices,
  theme,
}: {
  showIndices?: boolean
  showNegativeIndices?: boolean
  theme?: string
}) => (
  <YStack gap="$2">
    {theme && (
      <XStack ai="center" theme={theme as any} gap="$4">
        <Separator />
        <Paragraph ta="center" size="$2" color="$color10">
          {theme[0].toUpperCase() + theme.slice(1)}
        </Paragraph>
        <Separator />
      </XStack>
    )}
    {showNegativeIndices && (
      <XStack br="$5" ov="hidden">
        {new Array(12).fill(0).map((_, i) => (
          <Paragraph f={1} ta="center" key={i}>
            -{11 - i}
          </Paragraph>
        ))}
      </XStack>
    )}
    <XStack br="$5" ov="hidden" bw={1} bc="$borderColor">
      {new Array(12).fill(0).map((_, i) => (
        <XStack key={i} h={40} f={1} bg={`$${theme || 'blue'}${i}` as any} />
      ))}
    </XStack>
    {showIndices && (
      <XStack br="$5" ov="hidden">
        {new Array(12).fill(0).map((_, i) => (
          <Paragraph f={1} ta="center" key={i}>
            {i}
          </Paragraph>
        ))}
      </XStack>
    )}
  </YStack>
)

export const ExamplePalette = ({
  showIndices,
  showNegativeIndices,
  showLabels,
  theme,
}: {
  showIndices?: boolean
  showNegativeIndices?: boolean
  showLabels?: boolean
  theme?: string
}) => {
  return (
    <YStack my="$4" space="$2">
      {showLabels && (
        <XStack jc="space-between">
          <Paragraph size="$2" theme="alt2">
            Background
          </Paragraph>
          <Paragraph size="$2" theme="alt2">
            Foreground
          </Paragraph>
        </XStack>
      )}
      <PaletteExample
        showIndices={showIndices}
        showNegativeIndices={showNegativeIndices}
        theme={theme}
      />
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
