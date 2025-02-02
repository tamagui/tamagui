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
  children: JSX.Element | ((children: React.ReactNode) => React.ReactNode)
}

type Component = (props: any) => any

/**
 * Contexts
 */

const CurrentAdaptContextScope = createContext('')

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

export const ProvideAdaptContext = ({
  children,
  ...context
}: AdaptParentContextI & { children: any }) => {
  const scope = context.scopeName || ''

  return (
    <CurrentAdaptContextScope.Provider value={scope}>
      <AdaptContext.Provider scope={scope} {...context}>
        {children}
      </AdaptContext.Provider>
    </CurrentAdaptContextScope.Provider>
  )
}

export const useAdaptContext = (scope = '') => {
  const contextScope = useContext(CurrentAdaptContextScope)
  const context = AdaptContext.useStyledContext(
    scope === '' ? contextScope || scope : scope
  )
  return context
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
  const portalName = `AdaptPortal${scope}`
  const id = useId()

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
    const scopeName = scope ?? context.scopeName
    const enabled = useAdaptIsActiveGiven(props)

    useIsomorphicLayoutEffect(() => {
      context?.setWhen?.((when || enabled) as AdaptWhen)
      context?.setPlatform?.(platform || null)
    }, [when, platform, context, enabled])

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

    return (
      <CurrentAdaptContextScope.Provider value={scopeName}>
        {!enabled ? null : output}
      </CurrentAdaptContextScope.Provider>
    )
  },
  {
    Contents: AdaptContents,
  }
)

export const AdaptPortalContents = (props: {
  children: React.ReactNode
  scope?: string
}) => {
  // const isActive = useAdaptIsActive(props.scope)
  const { portalName } = useAdaptContext(props.scope)

  // if (!isActive) {
  //   return null
  // }

  return (
    <PortalItem
      // passthrough={!isWeb && !isActive}
      hostName={portalName}
    >
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
