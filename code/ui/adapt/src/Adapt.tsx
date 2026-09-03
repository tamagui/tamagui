import {
  isAndroid,
  isIos,
  isTouchable,
  isWeb,
  useIsomorphicLayoutEffect,
} from '@tamagui/constants'
import type { AllPlatforms, MediaQueryKey } from '@tamagui/core'
import { createStyledContext, useMedia } from '@tamagui/core'
import { withStaticProperties } from '@tamagui/helpers'
import { StackZIndexContext } from '@tamagui/z-index-stack'
import React, { createContext, useContext, useId } from 'react'

type AdaptSlotStore = {
  element: React.ReactNode
  version: number
  publish(element: React.ReactNode): void
  clear(): void
  notify(): void
  getSnapshot(): number
  subscribe(callback: () => void): () => void
}

function createAdaptSlotStore(): AdaptSlotStore {
  const listeners = new Set<() => void>()

  const store: AdaptSlotStore = {
    element: null,
    version: 0,
    publish(element) {
      store.element = element
    },
    clear() {
      store.element = null
    },
    notify() {
      store.version += 1
      for (const listener of listeners) {
        listener()
      }
    },
    getSnapshot() {
      return store.version
    },
    subscribe(callback) {
      listeners.add(callback)
      return () => {
        listeners.delete(callback)
      }
    },
  }

  return store
}

/**
 * Interfaces
 */

export type AdaptWhen = MediaQueryKeyString | boolean | null
export type AdaptPlatform = AllPlatforms | 'touch' | null
export type AdaptCapabilitiesValue = {
  scroll?: boolean
  overlay?: boolean
  dismiss?: boolean
}

// structurally matches @tamagui/sheet's SheetTransitionEvent (adapt cannot
// import it — sheet depends on adapt). the adapt target reports its position
// transition here so the parent can release the presence latch on real close
// completion instead of a timer.
export type AdaptTargetTransitionEvent = {
  phase: 'start' | 'end'
  cause: 'open' | 'close' | 'snap'
  finished?: boolean
}

export type AdaptTargetHandoff = {
  hidden: boolean
  skipNextAnimation?: boolean
  onTransition: (e: AdaptTargetTransitionEvent) => void
}

export type AdaptTarget<State = unknown> = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  handoff: AdaptTargetHandoff
  state: State
}

export type AdaptConfig = Pick<AdaptProps, 'when' | 'platform'>

export type AdaptParentContextI = {
  Contents: Component
  scopeName: string
  active: boolean
  setAdaptConfig: (config: AdaptConfig | null) => void
  portalName?: string
  lastScope?: string
  slot: AdaptSlotStore | null
  open?: boolean
  onOpenChange?: (open: boolean) => void
  state?: unknown
  handoff: AdaptTargetHandoff
  targetFullyHidden: boolean
  registerTarget: () => void
  unregisterTarget: () => void
  registerContents: () => void
  unregisterContents: () => void
  registerRenderCallback: () => void
  unregisterRenderCallback: () => void
}

type MediaQueryKeyString = MediaQueryKey extends string ? MediaQueryKey : never

export type AdaptRenderState<State = unknown> = {
  active: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  state: State
  handoff: AdaptTargetHandoff
}

export type AdaptProps = {
  scope?: string
  when?: AdaptWhen
  platform?: AdaptPlatform
  children:
    | React.JSX.Element
    | ((contents: React.ReactNode, adapt: AdaptRenderState) => React.ReactNode)
}

type Component = (props: any) => any

const adaptContextKeys = [
  'Contents',
  'scopeName',
  'portalName',
  'active',
  'setAdaptConfig',
  'slot',
  'handoff',
  'targetFullyHidden',
  'registerTarget',
  'unregisterTarget',
  'registerContents',
  'unregisterContents',
  'registerRenderCallback',
  'unregisterRenderCallback',
] as const

export const AdaptContext = createStyledContext<
  AdaptParentContextI,
  (typeof adaptContextKeys)[number]
>(
  {
    Contents: null as any,
    scopeName: '',
    portalName: '',
    active: false,
    setAdaptConfig: () => {},
    slot: null,
    handoff: {
      hidden: true,
      onTransition: () => {},
    },
    targetFullyHidden: true,
    registerTarget: () => {},
    unregisterTarget: () => {},
    registerContents: () => {},
    unregisterContents: () => {},
    registerRenderCallback: () => {},
    unregisterRenderCallback: () => {},
  },
  {
    keys: adaptContextKeys,
  }
)

const AdaptCapabilitiesContext = createContext<AdaptCapabilitiesValue>({})

const LastAdaptContextScope = createContext('')

export const ProvideAdaptContext = ({
  children,
  ...context
}: AdaptParentContextI & { children: any }) => {
  const scope = context.scopeName || ''
  const lastScope = useContext(LastAdaptContextScope)

  return (
    <LastAdaptContextScope.Provider value={lastScope || context.lastScope || ''}>
      <AdaptContext.Provider
        scope={scope}
        lastScope={lastScope || context.lastScope}
        {...context}
      >
        {children}
      </AdaptContext.Provider>
    </LastAdaptContextScope.Provider>
  )
}

export const useAdaptContext = (scope?: string) => {
  const lastScope = useContext(LastAdaptContextScope)
  const adaptScope = scope ?? lastScope
  return AdaptContext.useStyledContext(adaptScope)
}

/**
 * Hooks
 */

type AdaptParentProps = {
  children?: React.ReactNode
  // the children the user gave the adapting component, where their <Adapt /> lives.
  // AdaptParent's own children are that component's internals, one wrapper deep.
  adaptChildren?: React.ReactNode
  Contents?: AdaptParentContextI['Contents']
  scope: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  state?: unknown
}

// an <Adapt /> written into the adapting component's children is read off the
// element tree during render. learning it from the child's layout effect left
// every consumer seeing "inactive" on the first commit, so an adapted Select
// mounted SelectInlineImpl and swapped it for SelectSheetImpl one commit later,
// remounting the whole subtree. only direct children are scanned, descending
// into fragments: any deeper and a nested adapting component's own <Adapt />
// would adapt this one too. Children.toArray already flattens arrays and drops
// false, so `{cond && <Adapt />}` still reads. an <Adapt /> that a userland
// component renders is not in this tree, so it reports itself from its effect
// instead and still costs that extra commit.
function findAdaptConfig(children: React.ReactNode, scope: string): AdaptConfig | null {
  for (const child of React.Children.toArray(children)) {
    if (!React.isValidElement(child)) continue

    if (child.type === React.Fragment) {
      const found = findAdaptConfig(
        (child.props as { children?: React.ReactNode }).children,
        scope
      )
      if (found) return found
      continue
    }

    if (child.type === Adapt) {
      const childProps = child.props as AdaptProps
      if (childProps.scope == null || childProps.scope === scope) {
        return childProps
      }
    }
  }

  return null
}

export const AdaptParent = ({
  children,
  adaptChildren,
  Contents,
  scope,
  open,
  onOpenChange,
  state,
}: AdaptParentProps) => {
  const id = useId()
  const portalName = `AdaptPortal${scope}${id}`

  const slotRef = React.useRef<AdaptSlotStore | null>(null)
  if (!slotRef.current) {
    slotRef.current = createAdaptSlotStore()
  }

  const staticConfig = React.useMemo(
    () => findAdaptConfig(adaptChildren, scope) ?? findAdaptConfig(children, scope),
    [adaptChildren, children, scope]
  )
  const [publishedConfig, setPublishedConfig] = React.useState<AdaptConfig | null>(null)
  const rawActive = useAdaptIsActiveGiven(staticConfig ?? publishedConfig)

  // written during render because a child's layout effect calls setAdaptConfig
  // before this component's own effects run
  const staticConfigRef = React.useRef(staticConfig)
  staticConfigRef.current = staticConfig

  const setAdaptConfig = React.useCallback((config: AdaptConfig | null) => {
    if (staticConfigRef.current) return
    setPublishedConfig(config)
  }, [])

  const [exiting, setExiting] = React.useState(false)
  const [present, setPresent] = React.useState(false)
  const [targetFullyHidden, setTargetFullyHidden] = React.useState(!open)
  const targetCountRef = React.useRef(0)
  const contentsCountRef = React.useRef(0)
  const renderCallbackCountRef = React.useRef(0)
  const rawActiveRef = React.useRef(false)
  const openRef = React.useRef(open)
  const wasTargetHiddenRef = React.useRef(!rawActive)
  const hasHadActiveTargetRef = React.useRef(false)

  const shouldStartExit = !rawActive && present && Boolean(open)
  const active = rawActive || exiting || shouldStartExit
  const targetHidden = !rawActive
  const skipNextAnimation = Boolean(
    rawActive && wasTargetHiddenRef.current && hasHadActiveTargetRef.current && open
  )

  const releasePresenceLatch = React.useCallback(() => {
    setExiting(false)
    if (!rawActiveRef.current) {
      setPresent(false)
    }
  }, [])

  useIsomorphicLayoutEffect(() => {
    if (shouldStartExit) {
      setExiting(true)
    }
  }, [shouldStartExit])

  useIsomorphicLayoutEffect(() => {
    // committed snapshot: skipNextAnimation compares the next render against
    // these, and onTransition reads them non-reactively
    rawActiveRef.current = rawActive
    openRef.current = open
    if (rawActive) {
      hasHadActiveTargetRef.current = true
    }
    wasTargetHiddenRef.current = targetHidden

    if (open && rawActive) {
      setTargetFullyHidden(false)
      return
    }

    // once closed and the target is no longer active (exit finished or never
    // started), mark it hidden. an active exit waits for the target's
    // close-complete transition to fire the handoff below.
    if (!open && !active) {
      setTargetFullyHidden(true)
    }
  }, [active, open, rawActive, targetHidden])

  useIsomorphicLayoutEffect(() => {
    if (rawActive) {
      setPresent(true)
    } else if (!active) {
      setPresent(false)
    }

    if (rawActive && exiting) {
      setExiting(false)
    }
  }, [active, exiting, rawActive])

  const handoff = React.useMemo<AdaptTargetHandoff>(
    () => ({
      hidden: targetHidden,
      skipNextAnimation,
      onTransition(e) {
        // only act on completed transitions; a started or interrupted
        // (finished === false) transition leaves the latch as-is.
        if (e.phase !== 'end' || e.finished === false) return

        if (e.cause !== 'close') {
          setTargetFullyHidden(false)
          return
        }

        if (openRef.current && rawActiveRef.current) {
          setTargetFullyHidden(false)
          return
        }

        setTargetFullyHidden(true)
        releasePresenceLatch()
      },
    }),
    [releasePresenceLatch, skipNextAnimation, targetHidden]
  )

  const registerTarget = React.useCallback(() => {
    targetCountRef.current += 1

    if (process.env.NODE_ENV === 'development' && targetCountRef.current > 1) {
      console.error(
        `Adapt expected exactly one target in scope "${scope}", but ${targetCountRef.current} targets registered.`
      )
    }
  }, [scope])

  const unregisterTarget = React.useCallback(() => {
    targetCountRef.current = Math.max(0, targetCountRef.current - 1)
  }, [])

  const registerContents = React.useCallback(() => {
    contentsCountRef.current += 1
  }, [])

  const unregisterContents = React.useCallback(() => {
    contentsCountRef.current = Math.max(0, contentsCountRef.current - 1)
  }, [])

  const registerRenderCallback = React.useCallback(() => {
    renderCallbackCountRef.current += 1
  }, [])

  const unregisterRenderCallback = React.useCallback(() => {
    renderCallbackCountRef.current = Math.max(0, renderCallbackCountRef.current - 1)
  }, [])

  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return
    if (!active) return

    const timer = setTimeout(() => {
      if (
        rawActiveRef.current &&
        targetCountRef.current === 0 &&
        contentsCountRef.current === 0 &&
        renderCallbackCountRef.current === 0
      ) {
        console.error(
          `Adapt is active in scope "${scope}" but no target registered with useAdaptTarget(), Adapt.Contents marker, or render callback consumed it.`
        )
      }
    })

    return () => clearTimeout(timer)
  }, [active, scope])

  const FinalContents = Contents || AdaptSlotContents

  return (
    <LastAdaptContextScope.Provider value={scope}>
      <ProvideAdaptContext
        Contents={FinalContents}
        active={active}
        setAdaptConfig={setAdaptConfig}
        portalName={portalName}
        scopeName={scope}
        slot={slotRef.current}
        open={open}
        onOpenChange={onOpenChange}
        state={state}
        handoff={handoff}
        targetFullyHidden={targetFullyHidden}
        registerTarget={registerTarget}
        unregisterTarget={unregisterTarget}
        registerContents={registerContents}
        unregisterContents={unregisterContents}
        registerRenderCallback={registerRenderCallback}
        unregisterRenderCallback={unregisterRenderCallback}
      >
        {children}
      </ProvideAdaptContext>
    </LastAdaptContextScope.Provider>
  )
}

/**
 * Components
 */

export const AdaptContents = ({ scope, ...rest }: { scope?: string }) => {
  const context = useAdaptContext(scope)

  if (!context?.Contents) {
    throw new Error(
      process.env.NODE_ENV === 'production'
        ? `tamagui.dev/docs/intro/errors#warning-002`
        : `You're rendering a Tamagui <Adapt /> component without nesting it inside a parent that is able to adapt.`
    )
  }

  useIsomorphicLayoutEffect(() => {
    if (!context.active) return

    context.registerContents()
    return () => {
      context.unregisterContents()
    }
  }, [context.active, context.registerContents, context.unregisterContents])

  // forwards props - see shouldForwardSpace
  return React.createElement(context.Contents, { ...rest, scope, key: `stable` })
}

AdaptContents.shouldForwardSpace = true

export const Adapt = withStaticProperties(
  function Adapt(props: AdaptProps) {
    const { children, platform, scope, when } = props
    const context = useAdaptContext(scope)
    const enabled = context.active
    const isRenderCallback = typeof children === 'function'

    // only reaches the parent when it could not read this element off its own
    // children, i.e. a userland component renders the <Adapt />
    useIsomorphicLayoutEffect(() => {
      context.setAdaptConfig({ when, platform })
      return () => {
        context.setAdaptConfig(null)
      }
    }, [when, platform, context.setAdaptConfig])

    useIsomorphicLayoutEffect(() => {
      if (!enabled || !isRenderCallback) return

      context.registerRenderCallback()
      return () => {
        context.unregisterRenderCallback()
      }
    }, [
      enabled,
      isRenderCallback,
      context.registerRenderCallback,
      context.unregisterRenderCallback,
    ])

    let output: React.ReactNode

    if (isRenderCallback) {
      const Component = context?.Contents
      output = children(Component ? <Component /> : null, getAdaptRenderState(context))
    } else {
      output = children
    }

    return <StackZIndexContext>{!enabled ? null : output}</StackZIndexContext>
  },
  {
    Contents: AdaptContents,
  }
)

export const AdaptPortalContents = (props: {
  children: React.ReactNode
  scope?: string
}) => {
  const isActive = useAdaptIsActive(props.scope)
  const { slot } = useAdaptContext(props.scope)

  return (
    <AdaptSlotPublisher isActive={isActive} slot={slot}>
      {props.children}
    </AdaptSlotPublisher>
  )
}

function AdaptSlotContents({ scope }: { scope?: string }) {
  const { slot } = useAdaptContext(scope)

  React.useSyncExternalStore(
    slot?.subscribe ?? emptySubscribe,
    slot?.getSnapshot ?? emptySnapshot,
    slot?.getSnapshot ?? emptySnapshot
  )

  return <>{slot?.element ?? null}</>
}

function AdaptSlotPublisher({
  isActive,
  slot,
  children,
}: {
  isActive: boolean
  slot: AdaptSlotStore | null
  children: React.ReactNode
}) {
  const publishedRef = React.useRef<{
    isActive: boolean
    element: React.ReactNode
  } | null>(null)

  // Publish the live element value after every commit. Do not memoize this handoff
  // on a dep array: stale element deps caused the Sheet overlay-hoist regression
  // this replaces. Comparing against what was actually published is safe, and
  // keeps an unchanged element from re-rendering every slot consumer.
  useIsomorphicLayoutEffect(() => {
    if (!slot) return

    const published = publishedRef.current
    if (published && published.isActive === isActive && published.element === children) {
      return
    }

    publishedRef.current = { isActive, element: children }

    if (isActive) {
      slot.publish(children)
    } else {
      slot.clear()
    }

    slot.notify()
  })

  useIsomorphicLayoutEffect(() => {
    return () => {
      if (publishedRef.current?.isActive) {
        slot?.clear()
        slot?.notify()
      }
      publishedRef.current = null
    }
  }, [slot])

  return isActive ? null : <>{children}</>
}

const emptySubscribe = () => () => {}
const emptySnapshot = () => 0

const useAdaptIsActiveGiven = (config: AdaptConfig | null) => {
  const media = useMedia()
  const when = config?.when
  const platform = config?.platform

  if (when == null && platform == null) {
    return false
  }

  if (when === true) {
    return true
  }

  let enabled = false

  if (platform === 'touch') enabled = isTouchable
  else if (platform === 'native') enabled = !isWeb
  else if (platform === 'web') enabled = isWeb
  else if (platform === 'ios') enabled = isIos
  else if (platform === 'android') enabled = isAndroid

  if (platform && enabled == false) {
    return false
  }

  if (when && typeof when === 'string') {
    enabled = media[when]
  }

  return enabled
}

export const useAdaptIsActive = (scope?: string) => {
  return useAdaptContext(scope).active
}

export function useAdaptTarget<State = unknown>(
  scope?: string
): AdaptTarget<State> | null {
  const context = useAdaptContext(scope)

  useIsomorphicLayoutEffect(() => {
    if (!context.active) return

    context.registerTarget()
    return () => {
      context.unregisterTarget()
    }
  }, [context.active, context.registerTarget, context.unregisterTarget])

  if (!context.active) {
    return null
  }

  return {
    open: context.open,
    onOpenChange: context.onOpenChange,
    handoff: context.handoff,
    state: context.state as State,
  }
}

export const AdaptCapabilities = ({
  children,
  scroll,
  overlay,
  dismiss,
}: AdaptCapabilitiesValue & { children?: React.ReactNode }) => {
  const parent = useContext(AdaptCapabilitiesContext)
  const value = React.useMemo(
    () => ({
      scroll: scroll ?? parent.scroll,
      overlay: overlay ?? parent.overlay,
      dismiss: dismiss ?? parent.dismiss,
    }),
    [dismiss, overlay, parent.dismiss, parent.overlay, parent.scroll, scroll]
  )

  return (
    <AdaptCapabilitiesContext.Provider value={value}>
      {children}
    </AdaptCapabilitiesContext.Provider>
  )
}

export const useAdaptedCapabilities = () => {
  return useContext(AdaptCapabilitiesContext)
}

function getAdaptRenderState(context: AdaptParentContextI): AdaptRenderState {
  return {
    active: context.active,
    open: context.open,
    onOpenChange: context.onOpenChange,
    state: context.state,
    handoff: context.handoff,
  }
}
