import { useState } from 'react'
import { ScrollView } from 'react-native'
import { Text, View, XStack, YStack, styled } from 'tamagui'

// tab pill that changes bg + border on press. mirrors 3pc CategoryPills +
// Tamagui Button outline/selected variant. the backdrop view is absolutely
// positioned behind the text so any stuck press state is visible as a
// colored panel behind the label.

const PillBackdrop = styled(View, {
  name: 'PillBackdrop',
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  zIndex: -1,
  borderRadius: 16,
  borderWidth: 1.5,
  borderColor: 'transparent',
  backgroundColor: 'transparent',
})

const Pill = styled(View, {
  name: 'Pill',
  height: 36,
  paddingHorizontal: 16,
  alignItems: 'center',
  justifyContent: 'center',
  pressStyle: {
    backgroundColor: '#ff0000',
  },
})

const PILLS = [
  'General',
  'Bellator',
  'Boxing',
  'Techniques',
  'Fighters',
  'Feedback',
  'News',
  'MMA',
  'Wrestling',
  'Muay Thai',
]

export function PressStyleScrollStuck() {
  const [log, setLog] = useState<string[]>([])
  const [pressed, setPressed] = useState<Record<string, number>>({})
  const [pressedOut, setPressedOut] = useState<Record<string, number>>({})

  const append = (line: string) => setLog((prev) => [line, ...prev].slice(0, 20))

  return (
    <YStack flex={1} padding="$4" gap="$3" testID="press-scroll-stuck-root">
      <Text fontSize="$5" fontWeight="bold">
        Press + Horizontal Scroll
      </Text>
      <Text fontSize="$2" color="$gray11">
        Press any pill, then drag sideways into a scroll. Pills should return to their
        rest color when the finger lifts.
      </Text>

      <ScrollView
        testID="pill-scroll"
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingHorizontal: 12 }}
      >
        {PILLS.map((name) => (
          <Pill
            key={name}
            testID={`pill-${name}`}
            onPressIn={() => {
              append(`in ${name}`)
              setPressed((p) => ({ ...p, [name]: (p[name] ?? 0) + 1 }))
            }}
            onPressOut={() => {
              append(`out ${name}`)
              setPressedOut((p) => ({ ...p, [name]: (p[name] ?? 0) + 1 }))
            }}
            onPress={() => append(`press ${name}`)}
          >
            <PillBackdrop testID={`pill-backdrop-${name}`} />
            <Text color="white">{name}</Text>
          </Pill>
        ))}
      </ScrollView>

      <XStack gap="$2" flexWrap="wrap">
        {PILLS.map((name) => (
          <Text key={name} testID={`pill-count-${name}`} fontSize="$2" color="$gray11">
            {name}: {pressed[name] ?? 0}
          </Text>
        ))}
      </XStack>

      <XStack gap="$2" flexWrap="wrap">
        {PILLS.map((name) => (
          <Text
            key={name}
            testID={`pill-out-count-${name}`}
            fontSize="$2"
            color="$gray11"
          >
            {name} out: {pressedOut[name] ?? 0}
          </Text>
        ))}
      </XStack>

      <YStack gap="$1">
        <Text fontSize="$3" fontWeight="bold">
          Log
        </Text>
        <YStack testID="press-log" gap={2}>
          {log.map((line, i) => (
            <Text key={i} fontSize="$1">
              {line}
            </Text>
          ))}
        </YStack>
      </YStack>
    </YStack>
  )
}
