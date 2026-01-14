/**
 * Test case for v2 web alignment - verifying web-standard props work on native
 *
 * Tests that aria-*, role, and other web props correctly map to RN accessibility props.
 */

import React from 'react'
import { Button, Input, Stack, Text, XStack, YStack } from 'tamagui'

export function WebAlignment() {
  const [lastAction, setLastAction] = React.useState('')

  return (
    <YStack padding="$4" gap="$4" flex={1}>
      <Text fontSize="$6" fontWeight="bold">
        Web Alignment Test
      </Text>

      <Text fontSize="$3" color="$gray11">
        Tests that web-standard props (aria-*, role) work correctly on native
      </Text>

      {/* Test aria-label */}
      <YStack gap="$2">
        <Text fontWeight="bold">aria-label test:</Text>
        <Button
          testID="aria-label-button"
          aria-label="Press me to test aria-label"
          onPress={() => setLastAction('aria-label button pressed')}
        >
          Button with aria-label
        </Button>
      </YStack>

      {/* Test role="button" */}
      <YStack gap="$2">
        <Text fontWeight="bold">role="button" test:</Text>
        <Stack
          testID="role-button-stack"
          role="button"
          aria-label="Stack acting as button"
          backgroundColor="$blue5"
          padding="$3"
          borderRadius="$2"
          pressStyle={{ backgroundColor: '$blue6' }}
          onPress={() => setLastAction('role button pressed')}
        >
          <Text>Stack with role="button"</Text>
        </Stack>
      </YStack>

      {/* Test role="link" */}
      <YStack gap="$2">
        <Text fontWeight="bold">role="link" test:</Text>
        <Text
          testID="role-link-text"
          role="link"
          aria-label="Example link"
          color="$blue10"
          textDecorationLine="underline"
          onPress={() => setLastAction('role link pressed')}
        >
          Text with role="link"
        </Text>
      </YStack>

      {/* Test aria-disabled */}
      <YStack gap="$2">
        <Text fontWeight="bold">aria-disabled test:</Text>
        <Button
          testID="aria-disabled-button"
          aria-disabled={true}
          aria-label="Disabled button"
          opacity={0.5}
        >
          Disabled Button (aria-disabled)
        </Button>
      </YStack>

      {/* Test aria-hidden */}
      <YStack gap="$2">
        <Text fontWeight="bold">aria-hidden test:</Text>
        <XStack gap="$2" alignItems="center">
          <Stack
            testID="aria-hidden-element"
            aria-hidden={true}
            backgroundColor="$gray5"
            padding="$2"
            borderRadius="$2"
          >
            <Text>Hidden from accessibility</Text>
          </Stack>
          <Text fontSize="$2" color="$gray10">
            (aria-hidden=true)
          </Text>
        </XStack>
      </YStack>

      {/* Test tabIndex */}
      <YStack gap="$2">
        <Text fontWeight="bold">tabIndex test:</Text>
        <Stack
          testID="tabindex-focusable"
          tabIndex={0}
          aria-label="Focusable element"
          backgroundColor="$green5"
          padding="$3"
          borderRadius="$2"
          focusStyle={{ borderColor: '$green10', borderWidth: 2 }}
        >
          <Text>Focusable (tabIndex=0)</Text>
        </Stack>
      </YStack>

      {/* Test Input with aria props */}
      <YStack gap="$2">
        <Text fontWeight="bold">Input with aria props:</Text>
        <Input
          testID="aria-input"
          aria-label="Test input field"
          aria-required={true}
          placeholder="Input with aria-label and aria-required"
        />
      </YStack>

      {/* Status display */}
      <YStack
        marginTop="$4"
        padding="$3"
        backgroundColor="$backgroundHover"
        borderRadius="$2"
      >
        <Text fontWeight="bold">Last Action:</Text>
        <Text testID="last-action-text">{lastAction || 'None'}</Text>
      </YStack>
    </YStack>
  )
}
