import {
  isAndroid,
  isIos,
  isTouchable,
  isWeb,
  useIsomorphicLayoutEffect,
} from '@tamagui/constants'
import type { MediaQueryKey, UseMediaState } from '@tamagui/core'
import { useMedia, _disableMediaTouch } from '@tamagui/core'
import { withStaticProperties } from '@tamagui/helpers'
import { PortalHost, PortalItem } from '@tamagui/portal'
import React, { useContext } from 'react'

type MediaQueryKeyString = MediaQueryKey extends string ? MediaQueryKey : never

export type AdaptProps = {
  when?: MediaQueryKeyString | ((state: { media: UseMediaState }) => boolean)
  platform?: 'native' | 'web' | 'touch' | 'ios' | 'android'
  children: JSX.Element | ((children: React.ReactNode) => React.ReactNode)
}

type When = MediaQueryKeyString | boolean | null

type Component = (props: any) => any
type AdaptParentContextI = {
  Contents: Component
  setWhen: (when: When) => any
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

  const [when, setWhen] = React.useState<When>(null)

  const AdaptProvider = React.useMemo(() => {
    const context: AdaptParentContextI = {
      Contents,
      setWhen,
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
  }
}

export const Adapt = withStaticProperties(
  function Adapt({ platform, when, children }: AdaptProps) {
    const context = React.useContext(AdaptParentContext)
    const media = useMedia()

    let enabled = false

    console.log('when2', when)

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
      if (!enabled) return
      context?.setWhen((when || enabled) as When)

      return () => {
        context?.setWhen(null)
      }
    }, [when, context, enabled])

    console.log('enabled', enabled, children)

    if (!enabled) {
      return null
    }

    if (typeof children === 'function') {
      const Component = context?.Contents
      return children(Component ? <Component /> : null)
    }

    return children
  },
  {
    Contents: AdaptContents,
  }
)

export const AdaptPortalContents = (props: { children: React.ReactNode }) => {
  const adaptContext = useContext(AdaptParentContext)
  return <PortalItem hostName={adaptContext?.portalName}>{props.children}</PortalItem>
}

export const useAdaptWhenIsActive = (breakpoint?: MediaQueryKey | null | boolean) => {
  const media = useMedia(undefined, true)

  console.warn('useAdaptWhenIsActive', media.gtXs)

  if (typeof breakpoint === 'boolean' || !breakpoint) {
    return !!breakpoint
  }
  return media[breakpoint]
}
