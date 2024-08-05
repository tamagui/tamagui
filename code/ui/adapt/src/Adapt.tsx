import React from 'react'
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

type MediaQueryKeyString = MediaQueryKey extends string ? MediaQueryKey : never

export type AdaptProps = {
  when?: MediaQueryKeyString | ((state: { media: UseMediaState }) => boolean)
  platform?: 'native' | 'web' | 'touch' | 'ios' | 'android'
  children?:
    | JSX.Element
    | ((state: { enabled: boolean; media: UseMediaState }) => JSX.Element)
}

type When = MediaQueryKeyString | boolean | null

type Component = (props: any) => any
type AdaptParentContextI = {
  Contents: Component
  setWhen: (when: When) => any
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

export const useAdaptParent = ({
  Contents,
}: { Contents: AdaptParentContextI['Contents'] }) => {
  const [when, setWhen] = React.useState<When>(null)

  const AdaptProvider = React.useMemo(() => {
    const context: AdaptParentContextI = {
      Contents,
      setWhen,
    }

    function AdaptProviderView(props: { children?: any }) {
      return (
        <AdaptParentContext.Provider value={context}>
          {props.children}
        </AdaptParentContext.Provider>
      )
    }

    return AdaptProviderView
  }, [Contents])

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
    }, [when, context, enabled])

    if (!enabled) {
      return null
    }

    if (typeof children === 'function') {
      return children({ enabled, media })
    }

    return children
  },
  {
    Contents: AdaptContents,
  }
)
