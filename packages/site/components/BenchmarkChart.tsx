import { Paragraph, XStack, YStack } from 'tamagui'

const getBarColor = (name) => {
  switch (name) {
    case 'Tamagui':
      return '$yellow9'
    case 'Stitches':
      return '$violet9'
    case 'Stitches 0.1.9':
      return '$violet4'
    case 'styled-components':
      return '$red9'
    case 'react-native-web':
      return '$pink9'
    case 'Emotion':
      return '$green9'
    case 'Dripsy':
      return '$blue9'
    case 'NativeBase':
      return '$orange9'
    default:
      return 'gray'
  }
}

export function BenchmarkChart({ data }) {
  const maxValue = Math.max(...data.map((r) => r.value))

  return (
    <YStack space="$2" my="$4">
      {data.map((result, i) => (
        <XStack space key={i}>
          <YStack w={120}>
            <Paragraph
              key={result.name}
              size="$2"
              whiteSpace="nowrap"
              ta="right"
              my={-2}
              fontWeight={result.name === 'Tamagui' ? '700' : '400'}
            >
              {result.name}
            </Paragraph>
          </YStack>
          <XStack pr={70} flex={1} ai="center">
            <YStack
              bc={getBarColor(result.name)}
              width={`${(result.value / maxValue) * 100}%`}
              height="100%"
              position="relative"
              jc="center"
            >
              <Paragraph
                size="$1"
                whiteSpace="nowrap"
                position="absolute"
                right="$-1"
                transform="translateX(100%)"
              >
                {result.value}ms
              </Paragraph>
            </YStack>
          </XStack>
        </XStack>
      ))}
    </YStack>
  )
}
