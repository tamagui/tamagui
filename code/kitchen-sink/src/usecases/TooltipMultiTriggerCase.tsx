import { useState, useCallback, useRef } from 'react'
import { Tooltip, TooltipGroup, YStack, SizableText, XStack } from 'tamagui'

// test case: matches production PromoLinksRow on tamagui.dev
// single scoped tooltip with multiple triggers, animatePosition, TooltipGroup
// rapidly hovering between them should:
// 1. keep the arrow centered on the tooltip content (no displacement)
// 2. close properly when cursor leaves all triggers

type NavId = 'a' | 'b' | 'c'
const NAV_IDS: NavId[] = ['a', 'b', 'c']
const LABELS: Record<NavId, string> = {
  a: 'Takeout — universal RN starter kit',
  b: 'Bento — Free + paid pre-made UI',
  c: 'Add Even — Expert React Native developers',
}
const SHORT: Record<NavId, string> = { a: 'First', b: 'Second', c: 'Third' }

const tooltipDelay = { open: 0, close: 150 }

export function TooltipMultiTriggerCase() {
  const [activeId, setActiveId] = useState<NavId | null>(null)
  const prevIdRef = useRef<NavId | null>(null)
  const displayId = activeId || prevIdRef.current

  const handleEnter = useCallback(
    (id: NavId) => {
      if (id !== activeId) {
        prevIdRef.current = activeId
        setActiveId(id)
      }
    },
    [activeId]
  )

  return (
    <YStack padding="$4" gap="$4">
      <SizableText size="$3" color="$color9">
        Tooltip multi-trigger rapid hover test
      </SizableText>

      <YStack height={80} />

      <TooltipGroup delay={tooltipDelay}>
        <Tooltip scope="multi-tip" offset={20} placement="bottom">
          <XStack gap="$6" id="tip-triggers">
            {NAV_IDS.map((id) => (
              <Tooltip.Trigger
                key={id}
                scope="multi-tip"
                asChild="except-style"
                onMouseEnter={() => handleEnter(id)}
              >
                <XStack
                  id={`tip-trigger-${id}`}
                  px="$6"
                  py="$3"
                  bg="$color3"
                  rounded="$4"
                  cursor="pointer"
                  hoverStyle={{ bg: '$color4' }}
                >
                  <SizableText>{SHORT[id]}</SizableText>
                </XStack>
              </Tooltip.Trigger>
            ))}
          </XStack>

          <Tooltip.Content
            id="tip-content"
            scope="multi-tip"
            animatePosition
            transition="medium"
            enterStyle={{ y: -4, opacity: 0 }}
            exitStyle={{ y: -4, opacity: 0 }}
          >
            <Tooltip.Arrow scope="multi-tip" id="tip-arrow" />
            {displayId && (
              <SizableText id="tip-label" size="$3">
                {LABELS[displayId || 'a']}
              </SizableText>
            )}
          </Tooltip.Content>
        </Tooltip>
      </TooltipGroup>
    </YStack>
  )
}
