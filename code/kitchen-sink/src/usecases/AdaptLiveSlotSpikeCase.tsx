import { FocusScope as FocusScopeRaw } from '@tamagui/focus-scope'
import React from 'react'
import {
  Button as ButtonRaw,
  H2 as H2Raw,
  Input as InputRaw,
  Paragraph as ParagraphRaw,
  ScrollView as ScrollViewRaw,
  Sheet as SheetRaw,
  Text as TextRaw,
  XStack as XStackRaw,
  YStack as YStackRaw,
  isWeb,
  useIsomorphicLayoutEffect,
} from 'tamagui'

const Button = ButtonRaw as React.ComponentType<any>
const FocusScope = FocusScopeRaw as React.ComponentType<any>
const H2 = H2Raw as React.ComponentType<any>
const Input = InputRaw as React.ComponentType<any>
const Paragraph = ParagraphRaw as React.ComponentType<any>
const ScrollView = ScrollViewRaw as React.ComponentType<any>
const Sheet = SheetRaw as any
const Text = TextRaw as React.ComponentType<any>
const XStack = XStackRaw as React.ComponentType<any>
const YStack = YStackRaw as React.ComponentType<any>

type LiveSlotStore = {
  element: React.ReactNode
  version: number
  listeners: Set<() => void>
  publish: (element: React.ReactNode) => void
  notify: () => void
  subscribe: (listener: () => void) => () => void
  getSnapshot: () => number
}

const LiveSlotContext = React.createContext<LiveSlotStore | null>(null)
const DialogContext = React.createContext('missing-dialog-context')
const PortalContext = React.createContext('missing-portal-context')
const TargetContext = React.createContext('missing-target-context')

const measuredV2StateBaseline = {
  before: 'v2 instance: 1',
  adapted: 'v2 instance: 3',
  countAfterAdapt: 'v2 count: 0',
  countAfterReturn: 'v2 count: 0',
} as const

let nextStateProbeInstanceId = 0
let nextLiveSlotProofInstanceId = 0

const testProps = (id: string) =>
  ({
    testID: id,
    'data-testid': id,
  }) as const

function createLiveSlotStore(): LiveSlotStore {
  const store: LiveSlotStore = {
    element: null,
    version: 0,
    listeners: new Set(),
    publish(element) {
      store.element = element
    },
    notify() {
      store.version += 1
      for (const listener of store.listeners) {
        listener()
      }
    },
    subscribe(listener) {
      store.listeners.add(listener)
      return () => {
        store.listeners.delete(listener)
      }
    },
    getSnapshot() {
      return store.version
    },
  }

  return store
}

function LiveSlotProvider({ children }: { children: React.ReactNode }) {
  const storeRef = React.useRef<LiveSlotStore | null>(null)

  if (!storeRef.current) {
    storeRef.current = createLiveSlotStore()
  }

  return (
    <LiveSlotContext.Provider value={storeRef.current}>
      {children}
    </LiveSlotContext.Provider>
  )
}

function useLiveSlotStore() {
  const store = React.useContext(LiveSlotContext)

  if (!store) {
    throw new Error('LiveSlot spike components must be inside LiveSlotProvider')
  }

  return store
}

function LiveSlotPublisher({
  active,
  children,
}: {
  active: boolean
  children: React.ReactNode
}) {
  const store = useLiveSlotStore()
  const activeRef = React.useRef(active)

  activeRef.current = active

  // PR-A spike rule: publish the fresh element value on every render.
  // Do not memoize this handoff; stale element deps are the class of bug under test.
  store.publish(active ? children : null)

  useIsomorphicLayoutEffect(() => {
    store.notify()
  })

  useIsomorphicLayoutEffect(() => {
    return () => {
      if (activeRef.current) {
        store.publish(null)
        store.notify()
      }
    }
  }, [store])

  return active ? null : <>{children}</>
}

function LiveSlotContents() {
  const store = useLiveSlotStore()
  React.useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot)

  return <>{store.element}</>
}

export function AdaptLiveSlotSpikeCase() {
  const [liveActive, setLiveActive] = React.useState(true)
  const [liveRevision, setLiveRevision] = React.useState(0)
  const [slotAdapted, setSlotAdapted] = React.useState(false)

  return (
    // scrollable root: the case is far taller than a phone screen, and the
    // native Detox tests must be able to scroll each section into view (the
    // web tests get this for free via Playwright auto-scroll)
    <ScrollView {...testProps('adapt-live-slot-scroll')} flex={1}>
      <YStack p="$4" gap="$5" maxW={760}>
        <YStack gap="$3">
          <H2 size="$7">Adapt live slot spike</H2>
          <Paragraph size="$3">
            Local PR-A proof harness. It does not change Adapt core.
          </Paragraph>
          <XStack gap="$3" flexWrap="wrap">
            <Button
              {...testProps('live-slot-toggle')}
              onPress={() => setLiveActive((x) => !x)}
            >
              live slot active: {liveActive ? 'yes' : 'no'}
            </Button>
            <Button
              {...testProps('live-slot-update-prop')}
              onPress={() => setLiveRevision((x) => x + 1)}
            >
              update published prop
            </Button>
          </XStack>
        </YStack>

        <LiveSlotProof active={liveActive} revision={liveRevision} />

        <YStack gap="$3">
          <H2 size="$6">State preservation characterization</H2>
          <Paragraph size="$3">
            Measured v2 Adapt baseline vs the candidate live slot across inactive/active
            moves.
          </Paragraph>
          <XStack gap="$3" flexWrap="wrap">
            <Button
              {...testProps('slot-state-toggle')}
              onPress={() => setSlotAdapted((x) => !x)}
            >
              slot adapted: {slotAdapted ? 'yes' : 'no'}
            </Button>
          </XStack>

          <XStack gap="$4" flexWrap="wrap">
            <MeasuredV2StateBaselinePanel />
            <SlotStatePanel adapted={slotAdapted} />
          </XStack>
        </YStack>

        {/* keep the always-open native Sheet proof last: its absolutely
            positioned content must not share the viewport with the state
            panels while the Detox test scrolls/taps them */}
        <LiveSlotSheetTouchProof />
      </YStack>
    </ScrollView>
  )
}

function LiveSlotSheetTouchProof() {
  if (isWeb) {
    return null
  }

  return (
    <LiveSlotProvider>
      <DialogContext.Provider value="sheet-dialog-parent-ok">
        <YStack
          {...testProps('sheet-live-slot-target')}
          data-sheet-slot-target="true"
          height={360}
          p="$3"
          gap="$3"
          borderWidth={1}
          borderColor="$green8"
          rounded="$4"
        >
          <Paragraph size="$3" fontWeight="700">
            No-portal Sheet target subtree
          </Paragraph>
          <Sheet
            open
            modal={false}
            disableDrag
            snapPoints={[72]}
            dismissOnSnapToBottom={false}
          >
            <Sheet.Container
              {...testProps('sheet-live-slot-frame')}
              p="$4"
              gap="$3"
              data-sheet-live-slot-frame="no-portal-inline-sheet"
            >
              <Sheet.Background bg="$background" />
              <TargetContext.Provider value="sheet-target-ok">
                <LiveSlotContents />
              </TargetContext.Provider>
            </Sheet.Container>
          </Sheet>
        </YStack>

        <YStack
          {...testProps('sheet-live-slot-source')}
          data-sheet-slot-source="true"
          p="$3"
          gap="$3"
          borderWidth={1}
          borderColor="$blue8"
          rounded="$4"
        >
          <Paragraph size="$3" fontWeight="700">
            Sheet touch source branch
          </Paragraph>
          <LiveSlotPublisher active>
            <PortalContext.Provider value="sheet-portal-wrapper-ok">
              <SheetTouchProofContent />
            </PortalContext.Provider>
          </LiveSlotPublisher>
        </YStack>
      </DialogContext.Provider>
    </LiveSlotProvider>
  )
}

function SheetTouchProofContent() {
  const dialogContext = React.useContext(DialogContext)
  const portalContext = React.useContext(PortalContext)
  const targetContext = React.useContext(TargetContext)
  const [text, setText] = React.useState('')
  const [pressCount, setPressCount] = React.useState(0)

  const contextProof = `dialog-context: ${dialogContext}; portal-context: ${portalContext}; target-context: ${targetContext}; target: no-portal-inline-sheet`

  return (
    <YStack
      {...testProps('sheet-live-slot-content')}
      accessibilityLabel="No portal sheet live slot panel"
      accessibilityHint="Proof content rendered as plain Sheet.Container children"
      p="$3"
      gap="$3"
      rounded="$3"
      bg="$background"
      borderWidth={1}
      borderColor="$color8"
    >
      <Text {...testProps('sheet-live-slot-context')}>{contextProof}</Text>
      <Input
        {...testProps('sheet-live-slot-input')}
        accessibilityLabel="No portal sheet input"
        value={text}
        onChangeText={setText}
        placeholder="sheet touch input"
      />
      <Button
        {...testProps('sheet-live-slot-button')}
        accessibilityLabel="No portal sheet button"
        onPress={() => setPressCount((x) => x + 1)}
      >
        Press inside no-portal Sheet slot
      </Button>
      <Text {...testProps('sheet-live-slot-typed-value')}>
        sheet typed: {text || 'empty'}
      </Text>
      <Text {...testProps('sheet-live-slot-press-count')}>
        sheet press-count: {pressCount}
      </Text>
    </YStack>
  )
}

function LiveSlotProof({ active, revision }: { active: boolean; revision: number }) {
  return (
    <LiveSlotProvider>
      <DialogContext.Provider value="dialog-parent-ok">
        <YStack
          {...testProps('live-slot-target')}
          data-slot-target="true"
          p="$3"
          gap="$3"
          borderWidth={1}
          borderColor="$green8"
          rounded="$4"
        >
          <Paragraph size="$3" fontWeight="700">
            Candidate target subtree
          </Paragraph>
          <TargetContext.Provider value="target-context-ok">
            <LiveSlotContents />
          </TargetContext.Provider>
        </YStack>

        <YStack
          {...testProps('live-slot-source')}
          data-slot-source="true"
          p="$3"
          gap="$3"
          borderWidth={1}
          borderColor="$blue8"
          rounded="$4"
        >
          <Paragraph size="$3" fontWeight="700">
            Authored Dialog.Portal-like source
          </Paragraph>
          <LiveSlotPublisher active={active}>
            <PortalContext.Provider value="portal-wrapper-ok">
              <SlotProofContent revision={revision} />
            </PortalContext.Provider>
          </LiveSlotPublisher>
        </YStack>
      </DialogContext.Provider>
    </LiveSlotProvider>
  )
}

function SlotProofContent({ revision }: { revision: number }) {
  const dialogContext = React.useContext(DialogContext)
  const portalContext = React.useContext(PortalContext)
  const targetContext = React.useContext(TargetContext)
  const [text, setText] = React.useState('')
  const [pressCount, setPressCount] = React.useState(0)
  const instanceIdRef = React.useRef(0)

  if (!instanceIdRef.current) {
    nextLiveSlotProofInstanceId += 1
    instanceIdRef.current = nextLiveSlotProofInstanceId
  }

  const titleId = 'adapt-live-slot-title'
  const descriptionId = 'adapt-live-slot-description'
  const contextProof = `dialog-context: ${dialogContext}; portal-context: ${portalContext}; target-context: ${targetContext}; revision: ${revision}`

  return (
    <FocusScope enabled={isWeb} trapped={isWeb} loop focusOnIdle={16}>
      <YStack
        {...testProps('live-slot-content')}
        role={isWeb ? 'dialog' : undefined}
        aria-modal={isWeb ? true : undefined}
        aria-labelledby={isWeb ? titleId : undefined}
        aria-describedby={isWeb ? descriptionId : undefined}
        accessibilityLabel="Live slot spike panel"
        accessibilityHint="Proof content rendered through the candidate live slot"
        p="$3"
        gap="$3"
        rounded="$3"
        bg="$background"
        borderWidth={1}
        borderColor="$color8"
      >
        <H2 id={titleId} {...testProps('live-slot-title')} size="$5">
          Live slot spike panel
        </H2>
        <Paragraph id={descriptionId} {...testProps('live-slot-description')} size="$3">
          Content authored in the source branch and rendered once in the target branch.
        </Paragraph>
        <Text {...testProps('live-slot-context')}>{contextProof}</Text>
        <Text {...testProps('live-slot-instance')}>
          live-slot instance: {instanceIdRef.current}
        </Text>
        <Input
          {...testProps('live-slot-focus-input')}
          aria-label="Live slot focus input"
          accessibilityLabel="Live slot focus input"
          autoFocus={isWeb}
          value={text}
          onChangeText={setText}
          placeholder="focus proof input"
        />
        <Button
          {...testProps('live-slot-focus-next')}
          aria-label="Live slot next focus"
          accessibilityLabel="Live slot next focus"
          onPress={() => setPressCount((x) => x + 1)}
        >
          Press in slot
        </Button>
        <Text {...testProps('live-slot-typed-value')}>typed: {text || 'empty'}</Text>
        <Text {...testProps('live-slot-press-count')}>press-count: {pressCount}</Text>
      </YStack>
    </FocusScope>
  )
}

function MeasuredV2StateBaselinePanel() {
  return (
    <YStack
      {...testProps('v2-measured-baseline-panel')}
      p="$3"
      gap="$3"
      borderWidth={1}
      borderColor="$orange8"
      rounded="$4"
      flex={1}
      minW={140}
    >
      <Text fontWeight="700">measured v2 Adapt baseline</Text>
      <Text {...testProps('v2-measured-before')}>{measuredV2StateBaseline.before}</Text>
      <Text {...testProps('v2-measured-adapted')}>{measuredV2StateBaseline.adapted}</Text>
      <Text {...testProps('v2-measured-count-after-adapt')}>
        {measuredV2StateBaseline.countAfterAdapt}
      </Text>
      <Text {...testProps('v2-measured-count-after-return')}>
        {measuredV2StateBaseline.countAfterReturn}
      </Text>
    </YStack>
  )
}

function SlotStatePanel({ adapted }: { adapted: boolean }) {
  return (
    <YStack
      {...testProps('slot-state-panel')}
      p="$3"
      gap="$3"
      borderWidth={1}
      borderColor="$purple8"
      rounded="$4"
      flex={1}
      minW={140}
    >
      <Text fontWeight="700">candidate live slot</Text>
      <LiveSlotProvider>
        <YStack {...testProps('slot-state-target')} data-state-target="slot-target">
          <LiveSlotContents />
        </YStack>
        <YStack {...testProps('slot-state-source')} data-state-source="slot-source">
          <LiveSlotPublisher active={adapted}>
            <StateProbe name="slot" />
          </LiveSlotPublisher>
        </YStack>
      </LiveSlotProvider>
    </YStack>
  )
}

function StateProbe({ name }: { name: 'slot' }) {
  const [count, setCount] = React.useState(0)
  const instanceIdRef = React.useRef(0)

  if (!instanceIdRef.current) {
    nextStateProbeInstanceId += 1
    instanceIdRef.current = nextStateProbeInstanceId
  }

  return (
    <YStack {...testProps(`${name}-state-content`)} gap="$2">
      <Text {...testProps(`${name}-state-count`)}>
        {name} count: {count}
      </Text>
      <Text {...testProps(`${name}-state-instance`)}>
        {name} instance: {instanceIdRef.current}
      </Text>
      <Button
        {...testProps(`${name}-state-increment`)}
        onPress={() => setCount((x) => x + 1)}
      >
        increment {name}
      </Button>
    </YStack>
  )
}
