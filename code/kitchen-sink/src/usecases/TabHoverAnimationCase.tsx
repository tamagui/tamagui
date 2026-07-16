import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '../components/Button'
import {
  AnimatePresence,
  Paragraph,
  Popover,
  SizableText,
  styled,
  XStack,
  YStack,
} from 'tamagui'

const TABS = ['Tab A', 'Tab B', 'Tab C', 'Tab D', 'Tab E']

function useHoverableFromParams() {
  return useMemo(() => {
    if (typeof window === 'undefined') return true
    const params = new URLSearchParams(window.location.search)
    const delay = params.get('hoverDelay')
    const restMs = params.get('restMs')
    if (!delay && !restMs) return true
    const config: any = {}
    if (delay) config.delay = Number(delay)
    if (restMs) config.restMs = Number(restMs)
    return config
  }, [])
}

export function TabHoverAnimationCase() {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<string | null>(null)
  const [prevActiveTab, setPrevActiveTab] = useState<string | null>(null)
  const [going, setGoing] = useState(0)
  const hoverable = useHoverableFromParams()

  const displayTab = useLastValueIf(activeTab, !!activeTab) ?? activeTab

  // compute going synchronously during render (not in useEffect)
  // so exitStyle has the correct direction immediately
  if (activeTab && prevActiveTab && activeTab !== prevActiveTab) {
    const prevIdx = TABS.indexOf(prevActiveTab)
    const nextIdx = TABS.indexOf(activeTab)
    const nextGoing = nextIdx > prevIdx ? 1 : -1
    if (nextGoing !== going && prevIdx >= 0 && nextIdx >= 0) {
      setGoing(nextGoing)
    }
  }

  useEffect(() => {
    if (activeTab) {
      setPrevActiveTab(activeTab)
    }
  }, [activeTab])

  // track close events for test instrumentation
  const closeCountRef = useRef(0)
  const handleOpenChange = (val: boolean) => {
    if (!val && open) {
      closeCountRef.current++
      if (typeof window !== 'undefined') {
        ;(window as any).__popoverCloseCount = closeCountRef.current
      }
    }
    setOpen(val)
  }

  return (
    <YStack gap="$4" padding="$4">
      <SizableText id="going-direction" data-going={going}>
        Direction: {going}
      </SizableText>

      <Popover
        scope="tab-hover-test"
        open={open}
        onOpenChange={handleOpenChange}
        hoverable={hoverable}
        placement="top"
        offset={8}
      >
        <XStack gap="$2">
          {TABS.map((tab) => (
            <Popover.Trigger
              key={tab}
              scope="tab-hover-test"
              asChild="except-style"
              onMouseEnter={() => setActiveTab(tab)}
            >
              <Button
                id={`tab-${tab.replace(' ', '-').toLowerCase()}`}
                data-testid={`tab-${tab.replace(' ', '-').toLowerCase()}`}
                size="medium"
                theme={activeTab === tab ? 'blue' : undefined}
              >
                {tab}
              </Button>
            </Popover.Trigger>
          ))}
        </XStack>

        <Popover.Content
          id="hover-content"
          data-testid="hover-content"
          animatePosition
          disableFocusScope
          animateOnly={['transform', 'opacity']}
          opacity={1}
          enterStyle={{ opacity: 0, y: -4 }}
          exitStyle={{ opacity: 0, y: 6 }}
          transition="500ms"
        >
          <YStack
            width={250}
            height={120}
            rounded="$4"
            bg="$color3"
            elevation="$4"
            overflow="hidden"
          >
            <AnimatePresence initial={false} custom={{ going }}>
              {open && !!displayTab && (
                <SlideFrame
                  key={displayTab}
                  going={going}
                  id="slide-content"
                  data-testid="slide-content"
                  data-tab={displayTab}
                  data-going={going}
                  transition="200ms"
                >
                  <TabContent tab={displayTab} />
                </SlideFrame>
              )}
            </AnimatePresence>
          </YStack>
        </Popover.Content>
      </Popover>

      <ExitTracker />
    </YStack>
  )
}

const TabContent = memo(({ tab }: { tab: string }) => (
  <YStack gap="$2" padding="$2">
    <SizableText fontWeight="bold" data-testid="tab-content-title">
      {tab}
    </SizableText>
    <Paragraph size="$2">Preview content for {tab}</Paragraph>
  </YStack>
))

const SlideFrame = styled(YStack, {
  position: 'absolute',
  inset: 0,
  z: 1,
  x: 0,
  opacity: 1,

  variants: {
    going: {
      number: (going: number) => ({
        enterStyle: {
          x: going === 0 ? 0 : going > 0 ? 100 : -100,
          opacity: 0,
        },
        exitStyle: {
          x: going === 0 ? 0 : going < 0 ? 100 : -100,
          opacity: 0,
        },
      }),
    },
  } as const,
})

// tracks exit completions for test assertions
function ExitTracker() {
  const [exitCount, setExitCount] = useState(0)
  const [lastExitTime, setLastExitTime] = useState(0)

  useEffect(() => {
    const handler = () => {
      setExitCount((c) => c + 1)
      setLastExitTime(Date.now())
    }
    window.addEventListener('tab-hover-exit-complete', handler)
    return () => window.removeEventListener('tab-hover-exit-complete', handler)
  }, [])

  return (
    <YStack>
      <SizableText
        id="exit-count"
        data-testid="exit-count"
        data-count={exitCount}
        data-last-time={lastExitTime}
      >
        Exits: {exitCount}
      </SizableText>
    </YStack>
  )
}

// keeps the last truthy value
function useLastValueIf<T>(value: T, condition: boolean): T {
  const ref = useRef(value)
  if (condition) {
    ref.current = value
  }
  return ref.current
}
