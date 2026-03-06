import { useState, useCallback, useRef } from 'react'
import { Tooltip, YStack, SizableText, XStack } from 'tamagui'

// test case: single scoped tooltip with multiple triggers
// rapidly hovering between them should:
// 1. keep the arrow centered on the tooltip content (no displacement)
// 2. close properly when cursor leaves all triggers

type NavId = 'a' | 'b' | 'c'
const NAV_IDS: NavId[] = ['a', 'b', 'c']
const LABELS: Record<NavId, string> = { a: 'First', b: 'Second', c: 'Third' }

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

      <Tooltip scope="multi-tip" delay={0} restMs={60} placement="bottom">
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
                px="$4"
                py="$2"
                bg="$color3"
                rounded="$4"
                cursor="pointer"
                hoverStyle={{ bg: '$color4' }}
              >
                <SizableText>{LABELS[id]}</SizableText>
              </XStack>
            </Tooltip.Trigger>
          ))}
        </XStack>

        <Tooltip.Content
          id="tip-content"
          scope="multi-tip"
          enterStyle={{ y: -4, opacity: 0 }}
          exitStyle={{ y: 4, opacity: 0 }}
        >
          <Tooltip.Arrow scope="multi-tip" id="tip-arrow" />
          {displayId && (
            <SizableText id="tip-label" size="$3">
              Tooltip {LABELS[displayId || 'a']}
            </SizableText>
          )}
        </Tooltip.Content>
      </Tooltip>
    </YStack>
  )
}
