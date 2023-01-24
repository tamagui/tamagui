import {
  MediaQueryKey,
  isTouchable,
  isWeb,
  useIsomorphicLayoutEffect,
  withStaticProperties,
} from '@tamagui/core'
import { createContext, createElement, useContext, useMemo, useState } from 'react'

type MediaQueryKeyString = MediaQueryKey extends string ? MediaQueryKey : never

export type AdaptProps = {
  when?: MediaQueryKeyString
  platform?: 'native' | 'web' | 'touch'
  children?: any
}

type When = MediaQueryKeyString | boolean | null

type Component = (props: any) => any
type AdaptParentContextI = {
  Contents: Component
  setWhen: (when: When) => any
}

export const AdaptParentContext = createContext<AdaptParentContextI | null>(null)

// forward props
export const AdaptContents = (props: any) => {
  const context = useContext(AdaptParentContext)
  if (!context?.Contents) {
    throw new Error('Adapt not supported by this component')
  }
  return createElement(context.Contents, props)
}

AdaptContents['shouldForwardSpace'] = true

export const useAdaptParent = ({
  Contents,
}: {
  Contents: AdaptParentContextI['Contents']
}) => {
  const [when, setWhen] = useState<When>(null)

  const AdaptProvider = useMemo(() => {
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
    const context = useContext(AdaptParentContext)

    let enabled = !platform
    if (platform === 'touch') enabled = isTouchable
    if (platform === 'native') enabled = !isWeb
    if (platform === 'web') enabled = isWeb

    useIsomorphicLayoutEffect(() => {
      if (!enabled) return
      context?.setWhen((when || enabled) as When)
    }, [when, context, enabled])

    if (!enabled) {
      return null
    }

    return children
  },
  {
    Contents: AdaptContents,
  }
)
