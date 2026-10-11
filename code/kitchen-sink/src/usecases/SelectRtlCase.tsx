import React from 'react'
import { Text, XStack, YStack } from 'tamagui'
import { Button } from '../components/Button'
import { Select } from '../components/Select'

// floating-ui flips a start placement to the right edge under rtl, so the
// list's x depends on its own width: the first open must measure the mounted
// list, not the empty shell. the document starts ltr and flips at runtime,
// the way an app switching locales does
const values = ['apple', 'banana', 'orange', 'carrot', 'broccoli']

function Items() {
  return values.map((item) => (
    <Select.Item key={item} value={item} testID={`rtl-item-${item}`}>
      <Select.ItemText>{item}</Select.ItemText>
    </Select.Item>
  ))
}

export function SelectRtlCase() {
  const [value, setValue] = React.useState('banana')
  const [dir, setDir] = React.useState<'ltr' | 'rtl'>('ltr')

  React.useLayoutEffect(() => {
    const previous = document.documentElement.dir
    document.documentElement.dir = dir
    return () => {
      document.documentElement.dir = previous
    }
  }, [dir])

  return (
    <YStack padding="4" gap="4" items="flex-start">
      <Text testID="rtl-status">{dir}</Text>
      <Button testID="rtl-toggle" onPress={() => setDir(dir === 'ltr' ? 'rtl' : 'ltr')}>
        toggle dir
      </Button>
      <XStack gap="4">
        <Select value={value} onValueChange={setValue}>
          <Select.Trigger testID="rtl-select-trigger" width={220}>
            <Select.Value />
            <Select.Icon />
          </Select.Trigger>
          <Select.Content>
            <Select.Viewport testID="rtl-select-viewport">
              <Items />
            </Select.Viewport>
          </Select.Content>
        </Select>

        <Select value={value} onValueChange={setValue} lazyMount>
          <Select.Trigger testID="rtl-lazy-trigger" width={220}>
            <Select.Value />
            <Select.Icon />
          </Select.Trigger>
          <Select.Content>
            <Select.Viewport testID="rtl-lazy-viewport">
              <Items />
            </Select.Viewport>
          </Select.Content>
        </Select>
      </XStack>
    </YStack>
  )
}
