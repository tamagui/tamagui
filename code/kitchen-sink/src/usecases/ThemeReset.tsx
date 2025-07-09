import React from 'react'
import { Button, Square, Theme, YStack, Text } from 'tamagui'

import { TEST_IDS } from '../constants/test-ids'

export function ThemeReset() {
  return (
    <YStack gap="$4" padding="$4">
      <Text fontWeight="bold" fontSize="$6">
        Theme Reset Test Cases
      </Text>

      {/* Test Case 1: Reset from nested themes */}
      <YStack gap="$2">
        <Text fontWeight="bold">Case 1: Reset from dark → pink → blue</Text>
        <Theme name="dark">
          <Theme name="pink">
            <Theme name="blue">
              <Theme reset>
                <Button id={TEST_IDS.resetButton1}>
                  Button should be dark (grandparent)
                </Button>
              </Theme>
            </Theme>
          </Theme>
        </Theme>
      </YStack>

      {/* Test Case 2: Reset from dark → pink (documentation example) */}
      <YStack gap="$2">
        <Text fontWeight="bold">Case 2: Reset from dark → pink (doc example)</Text>
        <Theme name="dark">
          <Theme name="pink">
            <Theme reset>
              <Square id={TEST_IDS.resetSquare1} bg="$background" size={50} />
            </Theme>
          </Theme>
        </Theme>
      </YStack>

      {/* Test Case 3: Reset from dark only */}
      <YStack gap="$2">
        <Text fontWeight="bold">Case 3: Reset from dark only</Text>
        <Theme name="dark">
          <Theme reset>
            <Square id={TEST_IDS.resetSquare2} bg="$background" size={50} />
          </Theme>
        </Theme>
      </YStack>

      {/* Test Case 4: Reset from dark with button */}
      <YStack gap="$2">
        <Text fontWeight="bold">Case 4: Reset from dark with button</Text>
        <Theme name="dark">
          <Button id={TEST_IDS.darkButton}>I was born in the dark</Button>
          <Theme reset>
            <Button id={TEST_IDS.resetButton2}>I want to go back to the light</Button>
          </Theme>
        </Theme>
      </YStack>
    </YStack>
  )
}
