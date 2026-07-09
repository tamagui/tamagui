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

export type AdaptTargetHandoff = {
  hidden: boolean
  skipNextAnimation?: boolean
  onAnimationComplete: (info: { open: boolean }) => void
}

export type AdaptTarget<State = unknown> = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  handoff: AdaptTargetHandoff
  state: State
}

export type AdaptParentContextI = {
  Contents: Component
  scopeName: string
  platform: AdaptPlatform
  setPlatform: (when: AdaptPlatform) => any
  when: AdaptWhen
  setWhen: (when: AdaptWhen) => any
  active: boolean
  rawActive: boolean
  setRawActive: (active: boolean) => void
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

export const AdaptContext = createStyledContext<AdaptParentContextI>({
  Contents: null as any,
  scopeName: '',
  portalName: '',
  platform: null as any,
  setPlatform: (x: AdaptPlatform) => {},
  when: null as any,
  setWhen: () => {},
  active: false,
  rawActive: false,
  setRawActive: () => {},
  slot: null,
  handoff: {
    hidden: true,
    onAnimationComplete: () => {},
  },
  targetFullyHidden: true,
  registerTarget: () => {},
  unregisterTarget: () => {},
  registerContents: () => {},
  unregisterContents: () => {},
  registerRenderCallback: () => {},
  unregisterRenderCallback: () => {},
})

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
  Contents?: AdaptParentContextI['Contents']
  scope: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  state?: unknown
  exitLatchTimeout?: number
  // unused, removed with the old paths in PRs B-E
  portal?:
    | boolean
    | {
        forwardProps?: any
      }
}

export const AdaptParent = ({
  children,
  Contents,
  scope,
  open,
  onOpenChange,
  state,
  exitLatchTimeout = 1_000,
}: AdaptParentProps) => {
  const id = useId()
  const portalName = `AdaptPortal${scope}${id}`

  const slotRef = React.useRef<AdaptSlotStore | null>(null)
  if (!slotRef.current) {
    slotRef.current = createAdaptSlotStore()
  }

  const [when, setWhen] = React.useState<AdaptWhen>(null)
  const [platform, setPlatform] = React.useState<AdaptPlatform>(null)
  const [rawActive, setRawActive] = React.useState(false)
  const [exiting, setExiting] = React.useState(false)
  const [present, setPresent] = React.useState(false)
  const [targetFullyHidden, setTargetFullyHidden] = React.useState(!open)
  const [closePending, setClosePending] = React.useState(false)
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

  rawActiveRef.current = rawActive
  openRef.current = open
  if (rawActive) {
    hasHadActiveTargetRef.current = true
  }
  wasTargetHiddenRef.current = targetHidden

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
    if (open && rawActive) {
      setTargetFullyHidden(false)
      setClosePending(false)
      return
    }

    if (!open) {
      if (active && !targetFullyHidden) {
        setClosePending(true)
      } else if (!active) {
        setTargetFullyHidden(true)
        setClosePending(false)
      }
    }
  }, [active, open, rawActive, targetFullyHidden])

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

  React.useEffect(() => {
    if (!exiting) return

    const timer = setTimeout(() => {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          `Adapt target did not report exit animation completion within ${exitLatchTimeout}ms; releasing the presence latch.`
        )
      }
      releasePresenceLatch()
    }, exitLatchTimeout)

    return () => clearTimeout(timer)
  }, [exiting, exitLatchTimeout, releasePresenceLatch])

  React.useEffect(() => {
    if (!closePending) return

    const timer = setTimeout(() => {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          `Adapt target did not report close animation completion within ${exitLatchTimeout}ms; marking target hidden.`
        )
      }
      setTargetFullyHidden(true)
      setClosePending(false)
    }, exitLatchTimeout)

    return () => clearTimeout(timer)
  }, [closePending, exitLatchTimeout])

  const handoff = React.useMemo<AdaptTargetHandoff>(
    () => ({
      hidden: targetHidden,
      skipNextAnimation,
      onAnimationComplete(info) {
        if (info.open) {
          setTargetFullyHidden(false)
          setClosePending(false)
          return
        }

        if (openRef.current && rawActiveRef.current) {
          setTargetFullyHidden(false)
          setClosePending(false)
          return
        }

        setTargetFullyHidden(true)
        setClosePending(false)
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
        when={when}
        platform={platform}
        setPlatform={setPlatform}
        setWhen={setWhen}
        active={active}
        rawActive={rawActive}
        setRawActive={setRawActive}
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
    const { platform, when, children, scope } = props
    const context = useAdaptContext(scope)
    const rawEnabled = useAdaptIsActiveGiven(props)
    const enabled = rawEnabled || context.active
    const isRenderCallback = typeof children === 'function'

    useIsomorphicLayoutEffect(() => {
      context?.setWhen?.((when || rawEnabled) as AdaptWhen)
      context?.setPlatform?.(platform || null)
      context?.setRawActive?.(rawEnabled)
    }, [
      when,
      platform,
      rawEnabled,
      context.setWhen,
      context.setPlatform,
      context.setRawActive,
    ])

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

    useIsomorphicLayoutEffect(() => {
      return () => {
        context?.setWhen?.(null)
        context?.setPlatform?.(null)
        context?.setRawActive?.(false)
      }
    }, [])

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
  passThrough?: boolean
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
  const publishedRef = React.useRef(false)

  // Publish the live element value after every commit. Do not memoize this handoff:
  // stale element deps caused the Sheet overlay-hoist regression this replaces.
  useIsomorphicLayoutEffect(() => {
    if (!slot) return

    if (isActive) {
      slot.publish(children)
      publishedRef.current = true
    } else {
      slot.clear()
      publishedRef.current = false
    }

    slot.notify()
  })

  useIsomorphicLayoutEffect(() => {
    return () => {
      if (publishedRef.current) {
        slot?.clear()
        slot?.notify()
        publishedRef.current = false
      }
    }
  }, [slot])

  return isActive ? null : <>{children}</>
}

const emptySubscribe = () => () => {}
const emptySnapshot = () => 0

const useAdaptIsActiveGiven = ({
  when,
  platform,
}: Pick<AdaptProps, 'when' | 'platform'>) => {
  const media = useMedia()

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
  const props = useAdaptContext(scope)
  const isActiveGiven = useAdaptIsActiveGiven(props)
  return props.active || isActiveGiven
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
