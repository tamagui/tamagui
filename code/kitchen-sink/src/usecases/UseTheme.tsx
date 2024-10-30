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
      <YStack id="theme-get">
        <Text>x.background.get():</Text>
        <Text fontFamily="$mono">{JSON.stringify(x.background.get())}</Text>
      </YStack>
      <YStack id="theme-val">
        <Text>x.background.val:</Text>
        <Text fontFamily="$mono">{x.background.val}</Text>
      </YStack>
      <YStack id="token-get">
        <Text>x.blue1.get():</Text>
        <Text fontFamily="$mono">{JSON.stringify(x.blue1.get())}</Text>
      </YStack>
      <YStack id="token-val">
        <Text>x.blue1.val:</Text>
        <Text fontFamily="$mono">{x.blue1.val}</Text>
      </YStack>
    </YStack>
  )
}
