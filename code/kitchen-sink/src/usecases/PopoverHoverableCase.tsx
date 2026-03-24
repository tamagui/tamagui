import { Popover, YStack, SizableText, XStack } from 'tamagui'

// each case is isolated for clean testing

export function PopoverHoverableDelayCase() {
  return (
    <YStack padding="$10" alignItems="center" gap="$4">
      <SizableText size="$3" color="$color9">
        Hover delay: open should delay 400ms, close should delay 400ms
      </SizableText>
      <Popover placement="bottom" hoverable={{ delay: 400 }} offset={8}>
        <Popover.Trigger asChild>
          <XStack
            id="delay-trigger"
            px="$4"
            py="$2"
            bg="$color3"
            rounded="$4"
            cursor="pointer"
          >
            <SizableText>Hover me (delay: 400ms)</SizableText>
          </XStack>
        </Popover.Trigger>
        <Popover.Content
          id="delay-content"
          disableFocusScope
          unstyled
          transition="200ms"
          animateOnly={['opacity', 'transform']}
          enterStyle={{ opacity: 0, y: -4 }}
          exitStyle={{ opacity: 0, y: -4 }}
          bg="$color4"
          rounded="$4"
          px="$4"
          py="$3"
        >
          <SizableText>Popover content (delay test)</SizableText>
        </Popover.Content>
      </Popover>
    </YStack>
  )
}

export function PopoverHoverableRestMsCase() {
  return (
    <YStack padding="$10" alignItems="center" gap="$4">
      <SizableText size="$3" color="$color9">
        restMs: opens after 400ms rest, exit should NOT have extra delay
      </SizableText>
      <Popover placement="bottom" hoverable={{ restMs: 400 }} offset={8}>
        <Popover.Trigger asChild>
          <XStack
            id="restms-trigger"
            px="$4"
            py="$2"
            bg="$color3"
            rounded="$4"
            cursor="pointer"
          >
            <SizableText>Hover me (restMs: 400ms)</SizableText>
          </XStack>
        </Popover.Trigger>
        <Popover.Content
          id="restms-content"
          disableFocusScope
          unstyled
          transition="200ms"
          animateOnly={['opacity', 'transform']}
          enterStyle={{ opacity: 0, y: -4 }}
          exitStyle={{ opacity: 0, y: -4 }}
          bg="$color4"
          rounded="$4"
          px="$4"
          py="$3"
        >
          <SizableText>Popover content (restMs test)</SizableText>
        </Popover.Content>
      </Popover>
    </YStack>
  )
}

// tests restMs re-hover and safePolygon (hovering content via the gap)
export function PopoverHoverableSafePolygonCase() {
  return (
    <YStack padding="$10" alignItems="center" gap="$4">
      <SizableText size="$3" color="$color9">
        restMs: 60, offset: 20 - should be able to hover content through gap
      </SizableText>
      <Popover placement="bottom" hoverable={{ restMs: 260, delay: 0 }} offset={80}>
        <Popover.Trigger asChild>
          <XStack
            id="safepoly-trigger"
            px="$4"
            py="$2"
            bg="$color3"
            rounded="$4"
            cursor="pointer"
          >
            <SizableText>Hover me (safePolygon test)</SizableText>
          </XStack>
        </Popover.Trigger>
        <Popover.Content
          id="safepoly-content"
          disableFocusScope
          unstyled
          transition="200ms"
          animateOnly={['opacity', 'transform']}
          enterStyle={{ opacity: 0, y: -4 }}
          exitStyle={{ opacity: 0, y: -4 }}
          bg="$color4"
          rounded="$4"
          px="$4"
          py="$3"
        >
          <SizableText id="safepoly-text">Popover content (safePolygon)</SizableText>
        </Popover.Content>
      </Popover>
    </YStack>
  )
}

export function PopoverHoverableExitAnimCase() {
  return (
    <YStack padding="$10" alignItems="center" gap="$4">
      <SizableText size="$3" color="$color9">
        Exit animation: should animate out (not instant disappear)
      </SizableText>

      {/* target to move mouse to - far from popover */}
      <XStack id="away-target" position="absolute" bottom="$4" left="$4" opacity={0.01}>
        <SizableText>away</SizableText>
      </XStack>

      <Popover placement="bottom" hoverable offset={8}>
        <Popover.Trigger asChild>
          <XStack
            id="exitanim-trigger"
            px="$4"
            py="$2"
            bg="$color3"
            rounded="$4"
            cursor="pointer"
          >
            <SizableText>Hover me (exit animation)</SizableText>
          </XStack>
        </Popover.Trigger>
        <Popover.Content
          id="exitanim-content"
          disableFocusScope
          unstyled
          transition="500ms"
          animateOnly={['opacity', 'transform']}
          opacity={1}
          enterStyle={{ opacity: 0, y: -4 }}
          exitStyle={{ opacity: 0, y: -4 }}
          bg="$color4"
          rounded="$4"
          px="$4"
          py="$3"
        >
          <SizableText>Popover content (exit anim test)</SizableText>
        </Popover.Content>
      </Popover>
    </YStack>
  )
}
