import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from '@tamagui/lucide-icons'
import { useState } from 'react'
import type { PopoverProps } from '@tamagui/ui'
import {
  Adapt,
  Button,
  H1,
  H2,
  Input,
  isWeb,
  Label,
  Paragraph,
  Popover,
  XStack,
  YStack,
} from '@tamagui/ui'

export function PopoverCase() {
  const [shouldAdapt, setShouldAdapt] = useState(false)

  return (
    <YStack gap="$4" padding="$4" maxWidth={1200} margin="auto">
      <YStack gap="$2">
        <H1>Popover Component Tests</H1>
        <Paragraph>
          This page contains various Popover components for testing different scenarios.
        </Paragraph>
      </YStack>

      <YStack gap="$4">
        <YStack gap="$2">
          <h2>Basic Popover Tests</h2>
          <XStack gap="$2" flex={1} justifyContent="center" alignItems="center">
            <Demo
              shouldAdapt={shouldAdapt}
              placement="left"
              Icon={ChevronLeft}
              Name="left-popover"
              dataTestId="popover-left"
            />
            <Demo
              shouldAdapt={shouldAdapt}
              placement="bottom"
              Icon={ChevronDown}
              Name="bottom-popover"
              dataTestId="popover-bottom"
            />
            <Demo
              shouldAdapt={shouldAdapt}
              placement="top"
              Icon={ChevronUp}
              Name="top-popover"
              dataTestId="popover-top"
            />
            <Demo
              shouldAdapt={shouldAdapt}
              placement="right"
              Icon={ChevronRight}
              Name="right-popover"
              dataTestId="popover-right"
            />
          </XStack>
        </YStack>

        <YStack gap="$2">
          <H2>Simple Popover Test</H2>
          <SimplePopoverTest />
        </YStack>

        {!isWeb && (
          <Button onPress={() => setShouldAdapt(!shouldAdapt)}>
            Adapt to Sheet: {`${shouldAdapt}`}
          </Button>
        )}
      </YStack>
    </YStack>
  )
}

function Demo({
  Icon,
  Name,
  shouldAdapt,
  dataTestId,
  ...props
}: PopoverProps & {
  Icon?: any
  Name?: string
  shouldAdapt?: boolean
  dataTestId?: string
}) {
  return (
    <Popover
      size="$5"
      allowFlip
      stayInFrame
      offset={15}
      resize
      data-testid={dataTestId}
      {...props}
    >
      <Popover.Trigger asChild>
        <Button icon={Icon} id={`${dataTestId}-trigger`} />
      </Popover.Trigger>

      {shouldAdapt && (
        <Adapt when="maxMd" platform="touch">
          <Popover.Sheet modal dismissOnSnapToBottom>
            <Popover.Sheet.Frame padding="$4">
              <Adapt.Contents />
            </Popover.Sheet.Frame>
            <Popover.Sheet.Overlay backgroundColor="$shadowColor" />
          </Popover.Sheet>
        </Adapt>
      )}

      <Popover.Content
        borderWidth={1}
        borderColor="$borderColor"
        animation="100ms"
        width={300}
        height={300}
        enterStyle={{
          y: -10,
          opacity: 0,
        }}
        exitStyle={{
          y: -10,
          opacity: 0,
        }}
        elevate
        id={`${dataTestId}-content`}
      >
        <Popover.Arrow borderWidth={1} borderColor="$borderColor" />

        <YStack gap="$3">
          <XStack gap="$3">
            <Label size="$3" htmlFor={Name}>
              Name
            </Label>
          </XStack>

          <Popover.Close asChild>
            <Button
              size="$3"
              id={`${dataTestId}-close`}
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

function SimplePopoverTest() {
  return (
    <Popover>
      <Popover.Trigger asChild>
        <Button id="simple-popover-trigger">Simple Popover</Button>
      </Popover.Trigger>
      <Popover.Content id="simple-popover-content">
        <YStack gap="$2">
          <Paragraph>This is a simple popover</Paragraph>
          <Popover.Close asChild>
            <Button size="$2" id="simple-popover-close">
              Close
            </Button>
          </Popover.Close>
        </YStack>
      </Popover.Content>
    </Popover>
  )
}
