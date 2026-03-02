import { useState, useCallback, useRef } from 'react'
import { AnimatePresence, Popover, YStack, SizableText, XStack, styled } from 'tamagui'

// mirrors the WebsiteHeader pattern:
// - controlled open state
// - scope + multiple triggers
// - hoverable with delay/restMs
// - animated content panels with AnimatePresence inside

type NavId = 'about' | 'blog' | 'contact'
const NAV_IDS: NavId[] = ['about', 'blog', 'contact']

const PanelFrame = styled(YStack, {
  position: 'absolute',
  inset: 0,
  padding: '$4',
  opacity: 1,
  x: 0,
  variants: {
    going: {
      ':number': (going) => ({
        enterStyle: { x: going > 0 ? 80 : -80, opacity: 0 },
        exitStyle: { x: going < 0 ? 80 : -80, opacity: 0 },
      }),
    },
  } as const,
})

export function PopoverHoverableScopedCase() {
  const [open, setOpen] = useState(false)
  const [activeId, setActiveId] = useState<NavId | null>(null)
  const [going, setGoing] = useState(0)
  const prevIdRef = useRef<NavId | null>(null)
  const displayId = activeId || prevIdRef.current

  const handleEnter = useCallback(
    (id: NavId) => {
      if (id !== activeId) {
        if (activeId) {
          const pi = NAV_IDS.indexOf(activeId)
          const ni = NAV_IDS.indexOf(id)
          setGoing(ni > pi ? 1 : -1)
        }
        prevIdRef.current = activeId
        setActiveId(id)
      }
    },
    [activeId]
  )

  return (
    <YStack padding="$4" gap="$4">
      <SizableText size="$3" color="$color9">
        Scoped hoverable popover - mirrors WebsiteHeader pattern
      </SizableText>

      {/* large spacer so popover content opens in a clear area below triggers */}
      <YStack height={60} />

      <Popover
        scope="nav"
        open={open}
        onOpenChange={setOpen}
        hoverable={{ delay: 300, restMs: 300 }}
        offset={8}
        placement="bottom"
      >
        <XStack gap="$2" id="nav-triggers">
          {NAV_IDS.map((id) => (
            <Popover.Trigger
              key={id}
              scope="nav"
              display="contents"
              asChild="except-style"
              onMouseEnter={() => handleEnter(id)}
            >
              <XStack
                id={`nav-trigger-${id}`}
                px="$4"
                py="$2"
                bg={open && displayId === id ? '$color4' : '$color3'}
                rounded="$4"
                cursor="pointer"
                hoverStyle={{ bg: '$color4' }}
              >
                <SizableText>{id.charAt(0).toUpperCase() + id.slice(1)}</SizableText>
              </XStack>
            </Popover.Trigger>
          ))}
        </XStack>

        <Popover.Content
          id="nav-content"
          scope="nav"
          unstyled
          disableFocusScope
          animatePosition
          transition="500ms"
          animateOnly={['transform', 'opacity']}
          opacity={1}
          enterStyle={{ y: -6, opacity: 0 }}
          exitStyle={{ y: 4, opacity: 0 }}
          width={300}
          height={200}
        >
          {/* bounding wrapper so position:absolute panels don't escape to the portal root */}
          <YStack
            bg="$color2"
            rounded="$5"
            outlineColor="$color4"
            outlineWidth={1}
            outlineStyle="solid"
            width={300}
            height={200}
            overflow="hidden"
            position="relative"
          >
            <AnimatePresence initial={false} custom={{ going }}>
              {displayId && (
                <PanelFrame key={displayId} going={going}>
                  <SizableText id={`nav-panel-${displayId}`} size="$5" fontWeight="600">
                    {displayId.charAt(0).toUpperCase() + displayId.slice(1)} Panel
                  </SizableText>
                  <SizableText size="$3" color="$color9">
                    Content for {displayId}
                  </SizableText>
                </PanelFrame>
              )}
            </AnimatePresence>
          </YStack>
        </Popover.Content>
      </Popover>
    </YStack>
  )
}
