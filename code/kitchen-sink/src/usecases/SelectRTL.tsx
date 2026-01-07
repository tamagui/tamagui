import React from 'react'
import { Button, Select, Text, YStack } from 'tamagui'
import { Check, ChevronDown, ChevronUp } from '@tamagui/lucide-icons'

import { TEST_IDS } from '../constants/test-ids'

const items = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry']

/**
 * Test case for GitHub issue #3627: Select RTL positioning
 *
 * When the document direction is set to RTL, the Select.Content
 * should be positioned correctly on first open.
 */
export function SelectRTL() {
  const [value, setValue] = React.useState('Apple')
  const [isRTL, setIsRTL] = React.useState(false)

  const toggleRTL = () => {
    const newValue = !isRTL
    setIsRTL(newValue)
    if (typeof document !== 'undefined') {
      document.documentElement.dir = newValue ? 'rtl' : 'ltr'
    }
  }

  return (
    <YStack gap="$4" padding="$4">
      <Text fontWeight="bold" fontSize="$6">
        Select RTL Positioning Test (Issue #3627)
      </Text>
      <Text>
        Click the RTL toggle, then open the Select. The dropdown should appear
        correctly positioned on first open.
      </Text>

      <Button id={TEST_IDS.selectRTLToggle} onPress={toggleRTL}>
        {isRTL ? 'Set LTR' : 'Set RTL'}
      </Button>

      <Text>Current direction: {isRTL ? 'RTL' : 'LTR'}</Text>
      <Text>Current value: {value}</Text>

      <Select value={value} onValueChange={setValue} dir={isRTL ? 'rtl' : 'ltr'}>
        <Select.Trigger id={TEST_IDS.selectRTLTrigger} width={250}>
          <Select.Value placeholder="Select a fruit..." />
        </Select.Trigger>

        <Select.Content zIndex={200000}>
          <Select.ScrollUpButton>
            <ChevronUp size={20} />
          </Select.ScrollUpButton>

          <Select.Viewport>
            <Select.Group>
              <Select.Label>Fruits</Select.Label>
              {items.map((item, index) => (
                <Select.Item key={item} index={index} value={item}>
                  <Select.ItemText>{item}</Select.ItemText>
                  <Select.ItemIndicator>
                    <Check size={16} />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Group>
          </Select.Viewport>

          <Select.ScrollDownButton>
            <ChevronDown size={20} />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select>
    </YStack>
  )
}
