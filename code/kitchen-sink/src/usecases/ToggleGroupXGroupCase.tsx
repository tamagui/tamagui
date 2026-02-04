import { useState } from 'react'
import { Button, ToggleGroup, XGroup, YStack, Text } from 'tamagui'
import { AlignLeft, AlignCenter, AlignRight } from '@tamagui/lucide-icons'

/**
 * Tests two patterns of combining ToggleGroup + XGroup:
 *
 * Pattern A: XGroup.Item wraps ToggleGroup.Item (demo pattern)
 * - XGroup provides border radius management
 * - ToggleGroup.Item handles toggle logic
 * - Radius styles should flow from XGroup.Item to ToggleGroup.Item
 *
 * Pattern B: ToggleGroup.Item asChild wraps XGroup.Item (showcase pattern)
 * - ToggleGroup.Item uses asChild to delegate rendering to XGroup.Item
 * - XGroup.Item wraps Button which renders the visual element
 * - Press events must flow from ToggleGroup.Item through XGroup.Item to Button
 */
export function ToggleGroupXGroupCase() {
  const [patternAValue, setPatternAValue] = useState<string>('')
  const [patternBValue, setPatternBValue] = useState<string>('')

  return (
    <YStack gap="$8" p="$4">
      {/* Pattern A: XGroup.Item > ToggleGroup.Item */}
      <YStack gap="$2">
        <Text>Pattern A: XGroup.Item wraps ToggleGroup.Item</Text>
        <Text fontSize="$2" color="$color10">
          value: {patternAValue || 'none'}
        </Text>
        <ToggleGroup
          type="single"
          value={patternAValue}
          onValueChange={setPatternAValue}
          testID="pattern-a-toggle-group"
        >
          <XGroup rounded="$10" testID="pattern-a-xgroup">
            <XGroup.Item>
              <ToggleGroup.Item
                value="left"
                aria-label="Left"
                testID="pattern-a-left"
                borderRadius="$10"
              >
                <AlignLeft size={16} />
              </ToggleGroup.Item>
            </XGroup.Item>
            <XGroup.Item>
              <ToggleGroup.Item
                value="center"
                aria-label="Center"
                testID="pattern-a-center"
                borderRadius="$10"
              >
                <AlignCenter size={16} />
              </ToggleGroup.Item>
            </XGroup.Item>
            <XGroup.Item>
              <ToggleGroup.Item
                value="right"
                aria-label="Right"
                testID="pattern-a-right"
                borderRadius="$10"
              >
                <AlignRight size={16} />
              </ToggleGroup.Item>
            </XGroup.Item>
          </XGroup>
        </ToggleGroup>
      </YStack>

      {/* Pattern B: ToggleGroup.Item asChild > XGroup.Item > Button */}
      <YStack gap="$2">
        <Text>Pattern B: ToggleGroup.Item asChild wraps XGroup.Item</Text>
        <Text fontSize="$2" color="$color10">
          value: {patternBValue || 'none'}
        </Text>
        <ToggleGroup
          type="single"
          value={patternBValue}
          onValueChange={setPatternBValue}
          testID="pattern-b-toggle-group"
        >
          <XGroup rounded="$10" testID="pattern-b-xgroup">
            <ToggleGroup.Item value="left" aria-label="Left" asChild>
              <XGroup.Item>
                <Button testID="pattern-b-left" size="$3" icon={AlignLeft} />
              </XGroup.Item>
            </ToggleGroup.Item>
            <ToggleGroup.Item value="center" aria-label="Center" asChild>
              <XGroup.Item>
                <Button testID="pattern-b-center" size="$3" icon={AlignCenter} />
              </XGroup.Item>
            </ToggleGroup.Item>
            <ToggleGroup.Item value="right" aria-label="Right" asChild>
              <XGroup.Item>
                <Button testID="pattern-b-right" size="$3" icon={AlignRight} />
              </XGroup.Item>
            </ToggleGroup.Item>
          </XGroup>
        </ToggleGroup>
      </YStack>
    </YStack>
  )
}
