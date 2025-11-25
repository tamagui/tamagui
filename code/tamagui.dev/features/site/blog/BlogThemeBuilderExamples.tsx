import { Paragraph, Separator, XStack, YStack } from 'tamagui'

const PaletteExample = ({
  showIndices,
  showNegativeIndices,
  theme,
}: {
  showIndices?: boolean | undefined
  showNegativeIndices?: boolean | undefined
  theme?: string | undefined
}) => (
  <YStack gap="$2">
    {theme && (
      <XStack items="center" theme={theme as any} gap="$4">
        <Separator />
        <Paragraph text="center" size="$2" color="$color10">
          {theme[0].toUpperCase() + theme.slice(1)}
        </Paragraph>
        <Separator />
      </XStack>
    )}
    {showNegativeIndices && (
      <XStack rounded="$5" overflow="hidden">
        {new Array(12).fill(0).map((_, i) => (
          <Paragraph flex={1} text="center" key={i}>
            -{11 - i}
          </Paragraph>
        ))}
      </XStack>
    )}
    <XStack rounded="$5" overflow="hidden" borderWidth={1} borderColor="$borderColor">
      {new Array(12).fill(0).map((_, i) => (
        <XStack key={i} height={40} flex={1} bg={`$${theme || 'blue'}${i}` as any} />
      ))}
    </XStack>
    {showIndices && (
      <XStack rounded="$5" overflow="hidden">
        {new Array(12).fill(0).map((_, i) => (
          <Paragraph flex={1} text="center" key={i}>
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
    <YStack my="$4" gap="$2">
      {showLabels && (
        <XStack justify="space-between">
          <Paragraph size="$2" theme="alt2">
            Background
          </Paragraph>
          <Paragraph size="$2" theme="alt2">
            Foreground
          </Paragraph>
        </XStack>
      )}
      <PaletteExample
        showIndices={showIndices ?? false}
        showNegativeIndices={showNegativeIndices ?? false}
        theme={theme ?? ''}
      />
    </YStack>
  )
}

export const ExampleTemplate = () => {
  return (
    <YStack my="$4" gap="$2">
      <XStack justify="space-between">
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
