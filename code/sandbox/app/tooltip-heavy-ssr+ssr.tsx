import React, { useState, useMemo } from 'react'
import {
  AnimatePresence,
  Paragraph,
  Tooltip,
  TooltipGroup,
  YStack,
  XStack,
  Button,
  useDidFinishSSR,
} from 'tamagui'

// simulates tamagui.dev homepage during hydration:
// - multiple elements with enter animations (glows, hero content)
// - PromoLinksRow tooltip pattern with scoped multi-trigger
// - heavy re-rendering from animation effects
//
// the bug: hovering tooltip triggers during the ~300ms hydration window
// (while enter animations run) causes the tooltip to get stuck on one
// trigger position and never reposition when switching triggers.

type NavId = 'a' | 'b' | 'c'
const LABELS: Record<NavId, string> = {
  a: 'Takeout — universal RN starter kit',
  b: 'Bento — Free + paid pre-made UI',
  c: 'Add Even — Expert React Native developers',
}

const tooltipDelay = { open: 0, close: 150 }

// heavy animated elements that run during hydration, simulating
// HomeGlow, hero animations, and other page load effects
function HeavyAnimatedContent() {
  const items = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: `anim-${i}`,
        x: (i % 4) * 200 - 300,
        y: Math.floor(i / 4) * 100 + 20,
        scale: 1 + (i % 3) * 0.5,
      })),
    []
  )

  return (
    <AnimatePresence>
      {items.map((item) => (
        <YStack
          key={item.id}
          data-testid={item.id}
          position="absolute"
          width={80}
          height={80}
          rounded="$10"
          bg="$color5"
          opacity={0.3}
          x={item.x}
          y={item.y}
          scale={item.scale}
          transition="slow"
          enterStyle={{ opacity: 0, scale: 0.5 }}
          exitStyle={{ opacity: 0, scale: 0.5 }}
        />
      ))}
    </AnimatePresence>
  )
}

// extra re-rendering component that triggers state updates during hydration
function HydrationRerenderer() {
  const [count, setCount] = useState(0)
  const didHydrate = useDidFinishSSR()

  React.useEffect(() => {
    // simulate state updates that happen during hydration on tamagui.dev
    // (theme detection, tint changes, layout measurements, etc.)
    const timers = [
      setTimeout(() => setCount(1), 10),
      setTimeout(() => setCount(2), 50),
      setTimeout(() => setCount(3), 100),
      setTimeout(() => setCount(4), 200),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <YStack opacity={0}>
      <Paragraph data-testid="rerender-count">{count}</Paragraph>
      <Paragraph data-testid="hydrated">{String(didHydrate)}</Paragraph>
    </YStack>
  )
}

export default function TooltipHeavySSRTest() {
  const [label, setLabel] = useState('')
  const didHydrate = useDidFinishSSR()

  return (
    <YStack
      p="$4"
      gap="$4"
      id="tooltip-heavy-ssr-root"
      data-hydrated={String(didHydrate)}
      height="100vh"
      position="relative"
    >
      {/* heavy animated background elements */}
      <YStack position="absolute" inset={0} overflow="hidden" pointerEvents="none">
        <HeavyAnimatedContent />
      </YStack>

      {/* re-rendering component */}
      <HydrationRerenderer />

      <YStack height={120} />

      {/* promo links row tooltip pattern — the component under test */}
      <TooltipGroup delay={tooltipDelay}>
        <Tooltip scope="heavy-tip" offset={20} placement="bottom">
          <XStack gap="$2" id="tip-triggers" justifyContent="center">
            <Tooltip.Trigger
              scope="heavy-tip"
              asChild
              onMouseEnter={() => setLabel(LABELS.a)}
            >
              <XStack id="tip-trigger-a">
                <Button size="$3">Starter Kit</Button>
              </XStack>
            </Tooltip.Trigger>

            <Tooltip.Trigger
              scope="heavy-tip"
              asChild
              onMouseEnter={() => setLabel(LABELS.b)}
            >
              <XStack id="tip-trigger-b">
                <Button size="$3">Copy-Paste UI</Button>
              </XStack>
            </Tooltip.Trigger>

            <Tooltip.Trigger
              scope="heavy-tip"
              asChild
              onMouseEnter={() => setLabel(LABELS.c)}
            >
              <XStack id="tip-trigger-c">
                <Button size="$3">Hire Us</Button>
              </XStack>
            </Tooltip.Trigger>
          </XStack>

          <Tooltip.Content
            id="tip-content"
            scope="heavy-tip"
            animatePosition
            transition="medium"
            bg="$background"
            elevation="$2"
            rounded="$4"
            px="$2.5"
            py="$1"
            enterStyle={{ y: -4, opacity: 0 }}
            exitStyle={{ y: -4, opacity: 0 }}
          >
            <Tooltip.Arrow scope="heavy-tip" id="tip-arrow" />
            <Paragraph id="tip-label" size="$3">
              {label}
            </Paragraph>
          </Tooltip.Content>
        </Tooltip>
      </TooltipGroup>
    </YStack>
  )
}
