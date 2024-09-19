import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from '@tamagui/lucide-icons'
import { useState } from 'react'
import type { PopoverProps } from 'tamagui'
import { Adapt, Button, Input, isWeb, Label, Popover, XStack, YStack } from 'tamagui'

export function PopoverDemo() {
  const [shouldAdapt, setShouldAdapt] = useState(true)

  return (
    <YStack gap="$4">
      <XStack gap="$2" flex={1} justifyContent="center" alignItems="center">
        <Demo
          shouldAdapt={shouldAdapt}
          placement="left"
          Icon={ChevronLeft}
          Name="left-popover"
        />
        <Demo
          shouldAdapt={shouldAdapt}
          placement="bottom"
          Icon={ChevronDown}
          Name="bottom-popover"
        />
        <Demo
          shouldAdapt={shouldAdapt}
          placement="top"
          Icon={ChevronUp}
          Name="top-popover"
        />
        <Demo
          shouldAdapt={shouldAdapt}
          placement="right"
          Icon={ChevronRight}
          Name="right-popover"
        />
      </XStack>

      {!isWeb && (
        <Button onPress={() => setShouldAdapt(!shouldAdapt)}>
          Adapt to Sheet: {`${shouldAdapt}`}
        </Button>
      )}
    </YStack>
  )
}

export function Demo({
  Icon,
  Name,
  shouldAdapt,
  ...props
}: PopoverProps & { Icon?: any; Name?: string; shouldAdapt?: boolean }) {
  return (
    <Popover size="$5" allowFlip {...props}>
      <Popover.Trigger asChild>
        <Button icon={Icon} />
      </Popover.Trigger>

      {shouldAdapt && (
        <Adapt when="sm" platform="touch">
          <Popover.Sheet modal dismissOnSnapToBottom>
            <Popover.Sheet.Frame padding="$4">
              <Adapt.Contents />
            </Popover.Sheet.Frame>
            <Popover.Sheet.Overlay
              animation="lazy"
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
            />
          </Popover.Sheet>
        </Adapt>
      )}

      <Popover.Content
        borderWidth={1}
        borderColor="$borderColor"
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
        <Popover.Arrow borderWidth={1} borderColor="$borderColor" />

        <YStack gap="$3">
          <XStack gap="$3">
            <Label size="$3" htmlFor={Name}>
              Name
            </Label>
            <Input f={1} size="$3" id={Name} />
          </XStack>

          <Popover.Close asChild>
            <Button
              size="$3"
              onPress={() => {
                /* Custom code goes here, does not interfere with popover closure */
              }}
            >
              Submit
            </Button>
          </Popover.Close>
        </YStack>
      </Popover.Content>
    </Popover>
  )
}
