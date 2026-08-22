import { Square, Theme, YStack, Text } from 'tamagui'

import { TEST_IDS } from '../constants/test-ids'
import { Button } from '../components/Button'

export function ThemeReset() {
  return (
    <YStack gap="4" padding="4">
      <Text fontWeight="bold" fontSize="6">
        Theme Reset Test Cases
      </Text>

      {/* Test Case 1: Reset from nested themes */}
      <YStack gap="2">
        <Text fontWeight="bold">Case 1: Reset from dark → pink → blue</Text>
        <Theme name="dark">
          <Button id="reset-case-1-reference">Dark reference</Button>
          <Theme name="pink">
            <Theme name="blue">
              <Theme reset>
                <Button id={TEST_IDS.resetButton1}>Button should reset to dark</Button>
              </Theme>
            </Theme>
          </Theme>
        </Theme>
      </YStack>

      {/* Test Case 2: Reset from dark → pink (documentation example) */}
      <YStack gap="2">
        <Text fontWeight="bold">Case 2: Reset from dark → pink (doc example)</Text>
        <Theme name="dark">
          <Square id="reset-case-2-reference" bg="background" size={50} />
          <Theme name="pink">
            <Theme reset>
              <Square id={TEST_IDS.resetSquare1} bg="background" size={50} />
            </Theme>
          </Theme>
        </Theme>
      </YStack>

      {/* Test Case 3: Reset from dark only */}
      <YStack gap="2">
        <Text fontWeight="bold">Case 3: Reset from dark only</Text>
        <Square id="reset-case-3-reference" bg="background" size={50} />
        <Theme name="dark">
          <Theme reset>
            <Square id={TEST_IDS.resetSquare2} bg="background" size={50} />
          </Theme>
        </Theme>
      </YStack>

      {/* Test Case 4: Reset from dark with button */}
      <YStack gap="2">
        <Text fontWeight="bold">Case 4: Reset from dark with button</Text>
        <Button id="reset-case-4-reference">Root reference</Button>
        <Theme name="dark">
          <Button id={TEST_IDS.darkButton}>I was born in the dark</Button>
          <Theme reset>
            <Button id={TEST_IDS.resetButton2}>I want to go back to the light</Button>
          </Theme>
        </Theme>
      </YStack>

      {/* Test Case 5: Deeper scheme alternation */}
      <YStack gap="2">
        <Text fontWeight="bold">Case 5: Deep light/dark alternation</Text>
        <Square id="reset-case-5-reference" bg="background" size={50} />
        <Theme name="dark">
          <Theme name="light">
            <Theme name="dark">
              <Theme name="light">
                <Square id="reset-case-5-target" bg="background" size={50} />
              </Theme>
            </Theme>
          </Theme>
        </Theme>
      </YStack>

      {/* Test Case 6: Full-name and relative selector agreement */}
      <YStack gap="2">
        <Text fontWeight="bold">Case 6: Nested light blue selector agreement</Text>
        <Theme name="blue">
          <Square id="reset-case-6-reference" bg="background" size={50} />
        </Theme>
        <Theme name="dark">
          <Theme name="light">
            <Theme name="blue">
              <Square id="reset-case-6-target" bg="background" size={50} />
            </Theme>
          </Theme>
        </Theme>
      </YStack>
    </YStack>
  )
}
