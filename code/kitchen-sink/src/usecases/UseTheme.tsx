import { Text, useTheme } from '@tamagui/core'
import { YStack } from 'tamagui'

export function UseTheme() {
  const x = useTheme()
  console.info({
    label: 'usecases/UseTheme',
    test1: x.background.get(),
    test2: x.background.val,
    test3: x.blue1.get(),
    test4: x.blue1.val,
  })
  return (
    <YStack gap="$4">
      <YStack>
        <Text>x.background.get():</Text>
        <Text id="theme-get" fontFamily="$mono">
          {x.background.get()}
        </Text>
      </YStack>
      <YStack>
        <Text>x.background.val:</Text>
        <Text id="theme-val" fontFamily="$mono">
          {x.background.val}
        </Text>
      </YStack>
      <YStack>
        <Text>x.blue1.get():</Text>
        <Text id="token-get" fontFamily="$mono">
          {x.blue1.get()}
        </Text>
      </YStack>
      <YStack>
        <Text>x.blue1.val:</Text>
        <Text id="token-val" fontFamily="$mono">
          {x.blue1.val}
        </Text>
      </YStack>
    </YStack>
  )
}
