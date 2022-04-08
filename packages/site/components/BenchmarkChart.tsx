import { Paragraph, XStack, YStack } from 'tamagui'

const getBarColor = (name: string) => {
  switch (name) {
    case 'Tamagui':
      return '$pink9'
    case 'Stitches':
      return '$violet9'
    case 'Stitches 0.1.9':
      return '$violet4'
    case 'Styled Components':
    case 'SC':
      return '$red9'
    case 'react-native-web':
    case 'RNW':
      return '$teal9'
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

export function BenchmarkChart({ data, large, skipOthers = false }) {
  const maxValue = Math.max(...data.map((r) => r.value))

  return (
    <YStack space="$1" my="$4">
      {data.map((result, i) => (
        <XStack space="$2" key={i}>
          <YStack w={large ? 120 : 70}>
            <Paragraph
              key={result.name}
              size="$2"
              whiteSpace="nowrap"
              ta="right"
              my={-3}
              fontWeight={result.name === 'Tamagui' ? '700' : '400'}
            >
              {result.name}
            </Paragraph>
          </YStack>
          <XStack pr={65} flex={1} ai="center">
            <YStack
              bc={getBarColor(result.name)}
              o={result.name === 'Tamagui' ? 1 : skipOthers ? 1 : 1}
              width={`${(result.value / maxValue) * 100}%`}
              height="100%"
              position="relative"
              jc="center"
              br="$1"
            >
              <Paragraph size="$1" whiteSpace="nowrap" position="absolute" right="$-1" x="100%">
                {result.value}ms
              </Paragraph>
            </YStack>
          </XStack>
        </XStack>
      ))}
    </YStack>
  )
}
