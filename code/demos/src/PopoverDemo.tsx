import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from '@tamagui/lucide-icons'
import { useState } from 'react'
import type { PopoverProps } from 'tamagui'
import {
  Adapt,
  Button,
  Input,
  isWeb,
  Label,
  Popover,
  Sheet,
  styled,
  XStack,
  YStack,
} from 'tamagui'

export function PopoverDemo() {
  const [shouldAdapt, setShouldAdapt] = useState(true)

  return (
    <YStack gap="$4">
      <XStack gap="$2" flex={1} justify="center" items="center">
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
    <Popover size="$5" allowFlip stayInFrame offset={15} resize {...props}>
      <Popover.Trigger asChild>
        <Button icon={Icon} />
      </Popover.Trigger>

      {shouldAdapt && (
        <Adapt when="maxMd" platform="touch">
          <Sheet transition="medium" modal dismissOnSnapToBottom>
            <Sheet.Frame p="$4">
              <Adapt.Contents />
            </Sheet.Frame>
            <Sheet.Overlay
              bg="$shadowColor"
              transition="lazy"
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
            />
          </Sheet>
        </Adapt>
      )}

      <Popover.Content
        borderWidth={1}
        borderColor="$borderColor"
        width={300}
        height={200}
        enterStyle={{ y: -10, opacity: 0 }}
        exitStyle={{ y: -10, opacity: 0 }}
        elevate
        transition={[
          'quick',
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}
      >
        <Popover.Arrow borderWidth={1} borderColor="$borderColor" />

        <XStack gap="$3" mb="$3">
          <Label size="$3" htmlFor={Name}>
            Name
          </Label>
          <Input flex={1} size="$3" id={Name} />
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
      </Popover.Content>
    </Popover>
  )
}
