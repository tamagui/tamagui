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
import { PortalHost, PortalItem } from '@tamagui/portal'
import { StackZIndexContext } from '@tamagui/z-index-stack'
import React, { createContext, useContext, useEffect, useId } from 'react'

/**
 * Interfaces
 */

export type AdaptWhen = MediaQueryKeyString | boolean | null
export type AdaptPlatform = AllPlatforms | 'touch' | null

export type AdaptParentContextI = {
  Contents: Component
  scopeName: string
  platform: AdaptPlatform
  setPlatform: (when: AdaptPlatform) => any
  when: AdaptWhen
  setWhen: (when: AdaptWhen) => any
  setChildren: (children: any) => any
  portalName?: string
}

type MediaQueryKeyString = MediaQueryKey extends string ? MediaQueryKey : never

export type AdaptProps = {
  scope?: string
  when?: AdaptWhen
  platform?: AdaptPlatform
  children: React.JSX.Element | ((children: React.ReactNode) => React.ReactNode)
}

type Component = (props: any) => any

export const AdaptContext = createStyledContext<AdaptParentContextI>({
  Contents: null as any,
  scopeName: '',
  portalName: '',
  platform: null as any,
  setPlatform: (x: AdaptPlatform) => {},
  when: null as any,
  setChildren: null as any,
  setWhen: () => {},
})

const LastAdaptContextScope = createContext('')

export const ProvideAdaptContext = ({
  children,
  ...context
}: AdaptParentContextI & { children: any }) => {
  const scope = context.scopeName || ''
  const lastScope = useContext(LastAdaptContextScope)

  return (
    <LastAdaptContextScope.Provider value={lastScope}>
      <AdaptContext.Provider scope={scope} {...context}>
        {children}
      </AdaptContext.Provider>
    </LastAdaptContextScope.Provider>
  )
}

export const useAdaptContext = (scope?: string) => {
  const lastScope = useContext(LastAdaptContextScope)
  console.groupCollapsed('scope', scope, lastScope)
  console.log(getCurrentComponentStack('short'))
  console.groupEnd()
  return AdaptContext.useStyledContext(scope ?? lastScope)
}

/**
 * Hooks
 */

type AdaptParentProps = {
  children?: React.ReactNode
  scope: string
  Contents?: AdaptParentContextI['Contents']
  portal?:
    | boolean
    | {
        forwardProps?: any
      }
}

const AdaptPortals = new Map()

export const AdaptParent = ({ children, Contents, scope, portal }: AdaptParentProps) => {
  const id = useId()
  const portalName = `AdaptPortal${scope}${id}`

  let FinalContents = Contents || AdaptPortals.get(id)

  if (!FinalContents) {
    FinalContents = () => {
      return (
        <PortalHost
          name={portalName}
          forwardProps={typeof portal === 'boolean' ? undefined : portal?.forwardProps}
        />
      )
    }
    AdaptPortals.set(id, FinalContents)
  }

  useEffect(() => {
    return () => {
      AdaptPortals.delete(id)
    }
  }, [])

  const [when, setWhen] = React.useState<AdaptWhen>(null)
  const [platform, setPlatform] = React.useState<AdaptPlatform>(null)

  // TODO for inline adapt
  const [children2, setChildren] = React.useState(null)

  return (
    <LastAdaptContextScope value={scope}>
      <ProvideAdaptContext
        Contents={FinalContents}
        when={when}
        platform={platform}
        setPlatform={setPlatform}
        setWhen={setWhen}
        setChildren={setChildren}
        portalName={portalName}
        scopeName={scope}
      >
        {children}
      </ProvideAdaptContext>
    </LastAdaptContextScope>
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

  // forwards props - see shouldForwardSpace
  return React.createElement(context.Contents, { ...rest, key: `stable` })
}

AdaptContents.shouldForwardSpace = true

export const Adapt = withStaticProperties(
  function Adapt(props: AdaptProps) {
    const { platform, when, children, scope } = props
    const context = useAdaptContext(scope)
    const enabled = useAdaptIsActiveGiven(props)

    useIsomorphicLayoutEffect(() => {
      context?.setWhen?.((when || enabled) as AdaptWhen)
      context?.setPlatform?.(platform || null)
    }, [when, platform, enabled, context.setWhen, context.setPlatform])

    useIsomorphicLayoutEffect(() => {
      return () => {
        context?.setWhen?.(null)
        context?.setPlatform?.(null)
      }
    }, [])

    let output: React.ReactNode

    if (typeof children === 'function') {
      const Component = context?.Contents
      output = children(Component ? <Component /> : null)
    } else {
      output = children
    }

    // TODO this isn't ideal using an effect to set children, will cause double-renders
    // on every change
    useIsomorphicLayoutEffect(() => {
      if (typeof children === 'function' && output !== undefined) {
        context?.setChildren(output)
      }
    }, [output])

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
  const { portalName } = useAdaptContext(props.scope)

  return (
    <PortalItem passThrough={!isActive} hostName={portalName}>
      {props.children}
    </PortalItem>
  )
}

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
  return useAdaptIsActiveGiven(props)
}

export const getCurrentComponentStack = (format?: 'short') => {
  if (process.env.NODE_ENV === 'development') {
    const stack =
      React[
        '__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE'
      ].getCurrentStack()

    if (format === 'short') {
      return formatStackToShort(stack)
    }

    return stack
  }

  return `(prod, no stack)`
}

const formatStackToShort = (stack: string): string => {
  if (process.env.NODE_ENV === 'development') {
    const lines = stack
      // huge stack was causing issues
      .slice(0, 5000)
      .split('\n')
    const componentNames: string[] = []

    for (const line of lines) {
      // Extract component names from patterns like "at ComponentName ("
      // Also handle cases like "at Route((chat))" or "Route() ("
      const match = line.match(/\s*at\s+([A-Z][a-zA-Z0-9_]*)\s*\(/)
      if (match) {
        const componentName = match[1]
        // Filter out framework internals and keep user components
        if (
          componentName &&
          componentName !== 'Array' &&
          componentName !== 'Root' &&
          componentName !== 'Route'
        ) {
          componentNames.push(componentName)
        }
      }
    }

    return componentNames.join(' < ')
  }

  return stack
}
