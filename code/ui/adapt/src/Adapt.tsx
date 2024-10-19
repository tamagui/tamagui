import {
  isAndroid,
  isIos,
  isTouchable,
  isWeb,
  useIsomorphicLayoutEffect,
} from '@tamagui/constants'
import type { MediaQueryKey, UseMediaState } from '@tamagui/core'
import { useMedia } from '@tamagui/core'
import { withStaticProperties } from '@tamagui/helpers'
import { PortalHost, PortalItem } from '@tamagui/portal'
import React, { useContext, useEffect, useId } from 'react'

type MediaQueryKeyString = MediaQueryKey extends string ? MediaQueryKey : never

export type AdaptProps = {
  when?: MediaQueryKeyString | ((state: { media: UseMediaState }) => boolean)
  platform?: 'native' | 'web' | 'touch' | 'ios' | 'android'
  children: JSX.Element | ((children: React.ReactNode) => React.ReactNode)
}

export type AdaptWhen = MediaQueryKeyString | boolean | null

type Component = (props: any) => any
type AdaptParentContextI = {
  Contents: Component
  when?: AdaptWhen
  setWhen: (when: AdaptWhen) => any
  setChildren: (children: any) => any
  portalName?: string
}

export const AdaptParentContext = React.createContext<AdaptParentContextI | null>(null)

// forward props
export const AdaptContents = (props: any) => {
  const context = React.useContext(AdaptParentContext)
  if (!context?.Contents) {
    throw new Error(
      process.env.NODE_ENV === 'production'
        ? `tamagui.dev/docs/intro/errors#warning-002`
        : `You're rendering a Tamagui <Adapt /> component without nesting it inside a parent that is able to adapt.`
    )
  }
  return React.createElement(context.Contents, props)
}

AdaptContents.shouldForwardSpace = true

export const useAdaptParent = (
  props:
    | { Contents: AdaptParentContextI['Contents'] }
    | { portal: string; forwardProps?: any; name?: string }
) => {
  const portalName = 'portal' in props ? props.portal : undefined

  const Contents =
    'Contents' in props
      ? props.Contents
      : React.useCallback(() => {
          return <PortalHost name={props.portal} forwardProps={props.forwardProps} />
        }, [props.portal])

  const [when, setWhen] = React.useState<AdaptWhen>(null)
  const [children, setChildren] = React.useState(null)

  const AdaptProvider = React.useMemo(() => {
    const context: AdaptParentContextI = {
      Contents,
      when,
      setWhen,
      setChildren,
      portalName,
    }

    function AdaptProviderView(props: { children?: any }) {
      return (
        <AdaptParentContext.Provider value={context}>
          {props.children}
        </AdaptParentContext.Provider>
      )
    }

    return AdaptProviderView
  }, [Contents, portalName])

  return {
    AdaptProvider,
    when,
    children,
  }
}

export const Adapt = withStaticProperties(
  function Adapt({ platform, when, children }: AdaptProps) {
    const context = React.useContext(AdaptParentContext)
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

    if (!enabled) {
      return null
    }

    return output
  },
  {
    Contents: AdaptContents,
  }
)

export const AdaptPortalContents = (props: { children: React.ReactNode }) => {
  const adaptContext = useContext(AdaptParentContext)

  const isActive = useAdaptWhenIsActive(adaptContext?.when)

  return (
    <PortalItem
      // passthrough={!isActive}
      hostName={adaptContext?.portalName}
    >
      {props.children}
    </PortalItem>
  )
}

export const useAdaptWhenIsActive = (breakpoint?: MediaQueryKey | null | boolean) => {
  const media = useMedia()
  if (typeof breakpoint === 'boolean' || !breakpoint) {
    return !!breakpoint
  }
  return media[breakpoint]
}
