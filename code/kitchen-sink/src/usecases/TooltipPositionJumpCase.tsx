import { Button, Paragraph, Tooltip, TooltipGroup, XStack, YStack, SizableText, Square } from 'tamagui'
import { useState, useEffect, useRef } from 'react'

/**
 * Test case for tooltip position jump bug
 *
 * Issue: When rapidly hovering/moving/unhovering between tooltips,
 * the tooltip occasionally "jumps" - sometimes all the way to 0,0,
 * sometimes just slightly off position.
 *
 * This reproduces the PromoLinksRow pattern from tamagui.dev
 */

// position observer to detect jumps
function usePositionObserver(testId: string, onJump: (data: JumpData) => void) {
  const lastPosition = useRef<{ x: number; y: number } | null>(null)
  const observerRef = useRef<MutationObserver | null>(null)

  useEffect(() => {
    const checkPosition = () => {
      const el = document.querySelector(`[data-testid="${testId}"]`) as HTMLElement
      if (!el) {
        lastPosition.current = null
        return
      }

      const transform = getComputedStyle(el).transform
      const rect = el.getBoundingClientRect()

      let x = rect.left
      let y = rect.top

      // also check translate values from transform matrix
      if (transform && transform !== 'none') {
        const match = transform.match(/matrix\([^,]+,[^,]+,[^,]+,[^,]+,([^,]+),([^)]+)\)/)
        if (match) {
          x = parseFloat(match[1])
          y = parseFloat(match[2])
        }
      }

      if (lastPosition.current) {
        const dx = Math.abs(x - lastPosition.current.x)
        const dy = Math.abs(y - lastPosition.current.y)

        // detect significant jumps (more than 50px in either direction)
        // or jumps to near 0,0
        const isJumpToOrigin = (x < 50 && y < 50) && (lastPosition.current.x > 100 || lastPosition.current.y > 100)
        const isLargeJump = dx > 50 || dy > 50

        if (isJumpToOrigin || isLargeJump) {
          onJump({
            from: lastPosition.current,
            to: { x, y },
            dx,
            dy,
            isJumpToOrigin,
            timestamp: Date.now(),
          })
        }
      }

      lastPosition.current = { x, y }
    }

    // observe style changes on the tooltip
    const observer = new MutationObserver(() => {
      checkPosition()
    })

    // also poll periodically to catch animation frames
    const interval = setInterval(checkPosition, 16) // ~60fps

    // observe document body for tooltip appearing
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    })

    observerRef.current = observer

    return () => {
      observer.disconnect()
      clearInterval(interval)
    }
  }, [testId, onJump])
}

type JumpData = {
  from: { x: number; y: number }
  to: { x: number; y: number }
  dx: number
  dy: number
  isJumpToOrigin: boolean
  timestamp: number
}

export function TooltipPositionJumpCase() {
  const [jumps, setJumps] = useState<JumpData[]>([])
  const [hoverCount, setHoverCount] = useState(0)

  const handleJump = (data: JumpData) => {
    setJumps(prev => [...prev.slice(-9), data]) // keep last 10
  }

  // observe all possible tooltip content positions
  usePositionObserver('tooltip-jump-content-1', handleJump)
  usePositionObserver('tooltip-jump-content-2', handleJump)
  usePositionObserver('tooltip-jump-content-3', handleJump)
  usePositionObserver('tooltip-jump-content-4', handleJump)

  return (
    <YStack flex={1} gap="$4" p="$4" bg="$background">
      <SizableText fontWeight="bold">Tooltip Position Jump Test</SizableText>
      <SizableText size="$2" color="$gray11">
        Rapidly hover between buttons. Watch for position jumps.
      </SizableText>

      {/* row of tooltips similar to PromoLinksRow */}
      <TooltipGroup delay={{ open: 0, close: 100 }} timeoutMs={300}>
        <XStack gap="$3" justifyContent="center" flexWrap="wrap">
          {[1, 2, 3, 4].map((i) => (
            <Tooltip
              key={i}
              groupId={String(i)}
              placement="bottom"
              restMs={0}
            >
              <Tooltip.Trigger
                data-testid={`tooltip-jump-trigger-${i}`}
                onMouseEnter={() => setHoverCount(c => c + 1)}
              >
                <Button size="$3" circular>
                  {i}
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content
                data-testid={`tooltip-jump-content-${i}`}
                enterStyle={{ y: 5, opacity: 0 }}
                exitStyle={{ y: 5, opacity: 0 }}
                transition="quick"
              >
                <Tooltip.Arrow />
                <Paragraph size="$2" p="$2">Tooltip {i}</Paragraph>
              </Tooltip.Content>
            </Tooltip>
          ))}
        </XStack>
      </TooltipGroup>

      {/* stats panel */}
      <YStack gap="$2" p="$3" bg="$gray3" borderRadius="$3">
        <XStack gap="$4">
          <SizableText size="$2">Hover count: <SizableText fontWeight="bold" data-testid="hover-count">{hoverCount}</SizableText></SizableText>
          <SizableText size="$2">Jumps detected: <SizableText fontWeight="bold" color={jumps.length > 0 ? '$red10' : '$green10'} data-testid="jump-count">{jumps.length}</SizableText></SizableText>
        </XStack>

        {jumps.length > 0 && (
          <YStack gap="$1" mt="$2">
            <SizableText size="$1" fontWeight="bold">Jump log:</SizableText>
            {jumps.map((jump, i) => (
              <SizableText key={i} size="$1" fontFamily="$mono" data-testid={`jump-log-${i}`}>
                {jump.isJumpToOrigin ? '⚠️ ORIGIN ' : '⚡ '}
                ({jump.from.x.toFixed(0)},{jump.from.y.toFixed(0)}) →
                ({jump.to.x.toFixed(0)},{jump.to.y.toFixed(0)})
                Δ({jump.dx.toFixed(0)},{jump.dy.toFixed(0)})
              </SizableText>
            ))}
          </YStack>
        )}
      </YStack>

      {/* additional test: rapid show/hide same tooltip */}
      <YStack gap="$2" mt="$4">
        <SizableText fontWeight="bold">Single Tooltip Rapid Toggle</SizableText>
        <Tooltip placement="right" restMs={0} delay={0}>
          <Tooltip.Trigger data-testid="tooltip-jump-single-trigger">
            <Button>Hover rapidly on/off</Button>
          </Tooltip.Trigger>
          <Tooltip.Content
            data-testid="tooltip-jump-single-content"
            enterStyle={{ x: -5, opacity: 0 }}
            exitStyle={{ x: -5, opacity: 0 }}
            transition="quick"
          >
            <Tooltip.Arrow />
            <Paragraph size="$2" p="$2">Single tooltip</Paragraph>
          </Tooltip.Content>
        </Tooltip>
      </YStack>
    </YStack>
  )
}
