import {
  isAndroid,
  isIos,
  isTouchable,
  isWeb,
  useIsomorphicLayoutEffect,
} from '@tamagui/constants'
import type { MediaQueryKey, UseMediaState } from '@tamagui/core'
import { createStyledContext, useMedia } from '@tamagui/core'
import { withStaticProperties } from '@tamagui/helpers'
import { PortalHost, PortalItem } from '@tamagui/portal'
import React, { createContext, useContext, useEffect, useId } from 'react'

/**
 * Interfaces
 */

type AdaptParentContextI = {
  Contents: Component
  scopeName: string
  when?: AdaptWhen
  setWhen: (when: AdaptWhen) => any
  setChildren: (children: any) => any
  portalName?: string
}

type MediaQueryKeyString = MediaQueryKey extends string ? MediaQueryKey : never

export type AdaptProps = {
  scope?: string
  when?: MediaQueryKeyString | ((state: { media: UseMediaState }) => boolean)
  platform?: 'native' | 'web' | 'touch' | 'ios' | 'android'
  children: JSX.Element | ((children: React.ReactNode) => React.ReactNode)
}

export type AdaptWhen = MediaQueryKeyString | boolean | null

type Component = (props: any) => any

/**
 * Contexts
 */

const CurrentAdaptContextScope = createContext('')

export const AdaptContext = createStyledContext<AdaptParentContextI>({
  Contents: null as any,
  scopeName: '',
  portalName: '',
  when: null as any,
  setChildren: null as any,
  setWhen: null as any,
})

const ProvideAdaptContext = ({
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
  const [children2, setChildren] = React.useState(null)

  return (
    <ProvideAdaptContext
      Contents={FinalContents}
      when={when}
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
  function Adapt({ platform, when, children, scope }: AdaptProps) {
    const context = useAdaptContext(scope)
    const scopeName = scope ?? context.scopeName
    const media = useMedia()

    let enabled = false

    if (typeof when === 'function') {
      enabled = when({ media })
    } else {
      enabled = !platform

      if (platform === 'touch') enabled = isTouchable
      if (platform === 'native') enabled = !isWeb
      if (platform === 'web') enabled = isWeb
      if (platform === 'ios') enabled = isIos
      if (platform === 'android') enabled = isAndroid

      if (when && !media[when]) {
        enabled = false
      }
    }

    useIsomorphicLayoutEffect(() => {
      context?.setWhen((when || enabled) as AdaptWhen)
    }, [when, context, enabled])

    useIsomorphicLayoutEffect(() => {
      return () => {
        context?.setWhen(null)
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
    useEffect(() => {
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

export const useAdaptIsActive = (scope?: string) => {
  const { when } = useAdaptContext(scope)
  const media = useMedia()
  if (typeof when === 'boolean' || !when) {
    return !!when
  }
  return media[when]
}
