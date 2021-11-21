import { Paragraph, XStack, YStack } from 'tamagui'

const getBarColor = (name) => {
  switch (name) {
    case 'Tamagui':
      return '$blue9'
    case 'Stitches':
      return '$violet9'
    case 'Stitches 0.1.9':
      return '$violet4'
    case 'styled-components':
      return '$orange9'
    case 'Emotion':
      return '$green9'
    default:
      return 'gray'
  }
}

export function BenchmarkChart({ data }) {
  const maxValue = Math.max(...data.map((r) => r.value))

  return (
    <XStack space="$2" mt="$4">
      <YStack>
        {data.map((result) => (
          <Paragraph
            key={result.name}
            size="$2"
            my="$1"
            lineHeight="$5"
            whiteSpace="nowrap"
            ta="right"
            fontWeight={result.name === 'Tamagui' ? '500' : '400'}
          >
            {result.name}
          </Paragraph>
        ))}
      </YStack>
      <YStack flex={1}>
        {data.map((result) => (
          <XStack ai="center" key={result.name} space="$2" my="$1" paddingRight="57px">
            <YStack
              height="$3"
              bc={getBarColor(result.name)}
              width={`${(result.value / maxValue) * 100}%`}
              position="relative"
              jc="center"
            >
              <Paragraph
                size="$1"
                lineHeight="$sizes$5"
                whiteSpace="nowrap"
                position="absolute"
                right="$-1"
                transform="translateX(100%)"
              >
                {result.value}ms
              </Paragraph>
            </YStack>
          </XStack>
        ))}
      </YStack>
    </XStack>
  )
}
