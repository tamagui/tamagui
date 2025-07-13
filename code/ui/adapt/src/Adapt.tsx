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
import React, { createContext, useContext, useId, useMemo } from 'react'

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
  lastScope?: string
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

  const FinalContents = useMemo(() => {
    if (Contents) {
      return Contents
    }
    if (AdaptPortals.has(portalName)) {
      return AdaptPortals.get(portalName)
    }
    const element = () => {
      return (
        <PortalHost
          key={id}
          name={portalName}
          forwardProps={typeof portal === 'boolean' ? undefined : portal?.forwardProps}
        />
      )
    }
    AdaptPortals.set(portalName, element)
    return element
  }, [portalName, Contents])

  useIsomorphicLayoutEffect(() => {
    AdaptPortals.set(portalName, FinalContents)
    return () => {
      AdaptPortals.delete(portalName)
    }
  }, [portalName])

  const [when, setWhen] = React.useState<AdaptWhen>(null)
  const [platform, setPlatform] = React.useState<AdaptPlatform>(null)

  // TODO for inline adapt
  const [children2, setChildren] = React.useState(null)

  return (
    <LastAdaptContextScope.Provider value={scope}>
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
