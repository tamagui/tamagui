import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from '@tamagui/lucide-icons'
import { useState } from 'react'
import type { PopoverProps } from 'tamagui'
import {
  Button,
  Configuration,
  Popover,
  Text,
  XStack,
  YStack,
} from 'tamagui'
import { animationsCSS } from '../config/tamagui/animationsCSS'
import { animationsMotion } from '../config/tamagui/animationMotion'

/**
 * Test component for Popover transformOrigin feature.
 *
 * The transformOrigin middleware calculates the correct CSS transform-origin
 * based on placement and arrow position. This allows scale animations to
 * "grow" from the anchor point (where the arrow connects to the trigger).
 *
 * Expected behavior:
 * - When placement="bottom", content scales from top (near the trigger)
 * - When placement="top", content scales from bottom
 * - When placement="left", content scales from right
 * - When placement="right", content scales from left
 */
export function TestPopoverTransformOrigin() {
  return (
    <YStack gap="$4" p="$4">
      <Text fontWeight="bold" fontSize="$6">
        Popover transformOrigin Test
      </Text>
      <Text fontSize="$2" opacity={0.7}>
        Scale animation should originate from the arrow/anchor point
      </Text>

      {/* CSS Driver Test */}
      <YStack gap="$3" p="$4" bg="$background" borderWidth={1} borderColor="$borderColor">
        <Text fontWeight="bold">CSS Animation Driver</Text>
        <Configuration animationDriver={animationsCSS}>
          <PopoverPlacements />
        </Configuration>
      </YStack>

      {/* Motion Driver Test */}
      <YStack gap="$3" p="$4" bg="$background" borderWidth={1} borderColor="$borderColor">
        <Text fontWeight="bold">Motion Animation Driver</Text>
        <Configuration animationDriver={animationsMotion}>
          <PopoverPlacements />
        </Configuration>
      </YStack>
    </YStack>
  )
}

function PopoverPlacements() {
  return (
    <XStack gap="$4" justify="center" items="center" flexWrap="wrap">
      <PopoverWithScale placement="bottom" Icon={ChevronDown} label="Bottom" />
      <PopoverWithScale placement="top" Icon={ChevronUp} label="Top" />
      <PopoverWithScale placement="left" Icon={ChevronLeft} label="Left" />
      <PopoverWithScale placement="right" Icon={ChevronRight} label="Right" />
    </XStack>
  )
}

function PopoverWithScale({
  Icon,
  label,
  ...props
}: PopoverProps & { Icon: any; label: string }) {
  const [open, setOpen] = useState(false)

  return (
    <YStack items="center" gap="$2">
      <Popover
        size="$4"
        allowFlip={false}
        stayInFrame
        offset={10}
        open={open}
        onOpenChange={setOpen}
        {...props}
      >
        <Popover.Trigger asChild>
          <Button icon={Icon} size="$4">
            {label}
          </Button>
        </Popover.Trigger>

        <Popover.Content
          borderWidth={1}
          borderColor="$borderColor"
          p="$4"
          elevate
          transition={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          // Key animation: scale from 0.5 to 1
          // With transformOrigin, this should animate FROM the anchor point
          enterStyle={{ scale: 0.5, opacity: 0 }}
          exitStyle={{ scale: 0.5, opacity: 0 }}
        >
          <Popover.Arrow borderWidth={1} borderColor="$borderColor" />

          <YStack gap="$2" width={150}>
            <Text fontWeight="bold">Placement: {props.placement}</Text>
            <Text fontSize="$2" opacity={0.7}>
              Scale animation should grow from the arrow point
            </Text>
            <Popover.Close asChild>
              <Button size="$2" mt="$2">
                Close
              </Button>
            </Popover.Close>
          </YStack>
        </Popover.Content>
      </Popover>

      <Text fontSize="$1" opacity={0.5}>
        {props.placement}
      </Text>
    </YStack>
  )
}
