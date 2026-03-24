import { useState, useCallback, useRef } from 'react'
import { Popover, YStack, SizableText, XStack } from 'tamagui'

// test case: rapidly moving across many side-by-side triggers with short restMs
// should track the hovered trigger, not get "stuck" on a past one

type NavId = 'a' | 'b' | 'c' | 'd' | 'e' | 'f'
const NAV_IDS: NavId[] = ['a', 'b', 'c', 'd', 'e', 'f']

export function PopoverHoverableRapidCase() {
  const [open, setOpen] = useState(false)
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
        Rapid hover across many triggers - should track current trigger
      </SizableText>

      <YStack height={60} />

      <Popover
        scope="rapid"
        open={open}
        onOpenChange={setOpen}
        hoverable={{ restMs: 60, delay: 0 }}
        offset={8}
        placement="bottom"
      >
        {/* larger gaps to expose the race condition - mouse must cross gap */}
        <XStack gap="$6" id="rapid-triggers">
          {NAV_IDS.map((id) => (
            <Popover.Trigger
              key={id}
              scope="rapid"
              display="contents"
              asChild="except-style"
              onMouseEnter={() => handleEnter(id)}
            >
              <XStack
                id={`rapid-trigger-${id}`}
                px="$4"
                py="$2"
                bg={open && displayId === id ? '$color5' : '$color3'}
                rounded="$4"
                cursor="pointer"
                hoverStyle={{ bg: '$color4' }}
              >
                <SizableText>{id.toUpperCase()}</SizableText>
              </XStack>
            </Popover.Trigger>
          ))}
        </XStack>

        <Popover.Content
          id="rapid-content"
          scope="rapid"
          unstyled
          disableFocusScope
          transition="100ms"
          animateOnly={['transform', 'opacity']}
          opacity={1}
          enterStyle={{ y: -4, opacity: 0 }}
          exitStyle={{ y: 4, opacity: 0 }}
          width={200}
          height={80}
        >
          <YStack
            bg="$color2"
            rounded="$5"
            outlineColor="$color4"
            outlineWidth={1}
            outlineStyle="solid"
            width={200}
            height={80}
            overflow="hidden"
            position="relative"
            alignItems="center"
            justifyContent="center"
          >
            {displayId && (
              <SizableText id="rapid-panel-label" size="$5" fontWeight="600">
                Panel {displayId.toUpperCase()}
              </SizableText>
            )}
          </YStack>
        </Popover.Content>
      </Popover>
    </YStack>
  )
}
