import React from 'react'
import { Popover, Button, Input, Label, YStack, XStack, TextArea } from '@tamagui/ui'
import { ChevronDown } from '@tamagui/lucide-icons'

export function PopoverFocusScopeCase() {
  return (
    <YStack padding="$4" gap="$4">
      {/* Basic Popover with Focus Trap */}
      <Popover>
        <Popover.Trigger asChild>
          <Button data-testid="basic-popover-trigger" iconAfter={ChevronDown}>
            Open Basic Popover
          </Button>
        </Popover.Trigger>
        <Popover.Content
          enterStyle={{ y: -10, opacity: 0 }}
          exitStyle={{ y: -10, opacity: 0 }}
          elevate
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
        >
          <YStack gap="$3" padding="$4" data-testid="basic-popover-content">
            <Label htmlFor="popover-name">Name</Label>
            <Input
              id="popover-name"
              data-testid="popover-name-input"
              placeholder="Enter your name"
              autoComplete="name"
            />

            <Label htmlFor="popover-email">Email</Label>
            <Input
              id="popover-email"
              data-testid="popover-email-input"
              placeholder="your@email.com"
              autoComplete="email"
            />

            <Label htmlFor="popover-notes">Notes</Label>
            <TextArea
              id="popover-notes"
              data-testid="popover-notes-textarea"
              placeholder="Add some notes..."
              size="$4"
            />

            <XStack gap="$3" justifyContent="flex-end">
              <Popover.Close asChild>
                <Button variant="outlined" data-testid="popover-cancel-button">
                  Cancel
                </Button>
              </Popover.Close>
              <Button theme="blue" data-testid="popover-save-button">
                Save
              </Button>
            </XStack>
          </YStack>
        </Popover.Content>
      </Popover>

      {/* Popover without Focus Trap */}
      <Popover>
        <Popover.Trigger asChild>
          <Button data-testid="no-trap-popover-trigger" iconAfter={ChevronDown}>
            Open Popover (No Focus Trap)
          </Button>
        </Popover.Trigger>
        <Popover.Content
          trapFocus={false}
          enterStyle={{ y: -10, opacity: 0 }}
          exitStyle={{ y: -10, opacity: 0 }}
          elevate
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
        >
          <YStack gap="$3" padding="$4" data-testid="no-trap-popover-content">
            <Label htmlFor="no-trap-input">Input Field</Label>
            <Input
              id="no-trap-input"
              data-testid="no-trap-input"
              placeholder="Focus can leave this popover"
            />

            <Popover.Close asChild>
              <Button data-testid="no-trap-close-button">Close</Button>
            </Popover.Close>
          </YStack>
        </Popover.Content>
      </Popover>

      {/* Nested Popovers */}
      <Popover>
        <Popover.Trigger asChild>
          <Button data-testid="parent-popover-trigger" iconAfter={ChevronDown}>
            Open Nested Popovers
          </Button>
        </Popover.Trigger>
        <Popover.Content
          enterStyle={{ y: -10, opacity: 0 }}
          exitStyle={{ y: -10, opacity: 0 }}
          elevate
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
        >
          <YStack gap="$3" padding="$4" data-testid="parent-popover-content">
            <Label htmlFor="parent-popover-input">Parent Input</Label>
            <Input
              id="parent-popover-input"
              data-testid="parent-popover-input"
              placeholder="Parent popover input"
            />

            {/* Nested Popover */}
            <Popover>
              <Popover.Trigger asChild>
                <Button data-testid="nested-popover-trigger" size="$3">
                  Open Nested
                </Button>
              </Popover.Trigger>
              <Popover.Content
                enterStyle={{ y: -10, opacity: 0 }}
                exitStyle={{ y: -10, opacity: 0 }}
                elevate
                animation={[
                  'quick',
                  {
                    opacity: {
                      overshootClamping: true,
                    },
                  },
                ]}
              >
                <YStack gap="$3" padding="$3" data-testid="nested-popover-content">
                  <Input data-testid="nested-popover-input" placeholder="Nested input" />
                  <Popover.Close asChild>
                    <Button data-testid="nested-popover-close" size="$3">
                      Close Nested
                    </Button>
                  </Popover.Close>
                </YStack>
                <Popover.Arrow />
              </Popover.Content>
            </Popover>

            <Popover.Close asChild>
              <Button data-testid="parent-popover-close">Close Parent</Button>
            </Popover.Close>
          </YStack>
        </Popover.Content>
      </Popover>
    </YStack>
  )
}
