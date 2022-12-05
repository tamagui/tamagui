import { MediaQueryKey, withStaticProperties } from '@tamagui/core'
import { createContext, createElement, useContext, useLayoutEffect, useMemo, useState } from 'react'

export type AdaptProps = {
  when?: MediaQueryKey
  children?: any
}

type Component = (props: any) => any

type AdaptParentContextI = {
  Contents: Component
  setWhen: (when: MediaQueryKey) => any
}

const AdaptParentContext = createContext<AdaptParentContextI | null>(null)

export const AdaptContents = () => {
  const context = useContext(AdaptParentContext)
  if (!context || !context.Contents) {
    throw new Error(`Missing parent adapatable component, Adapt not supported here`)
  }
  return createElement(context.Contents)
}

export const useAdaptParent = ({ Contents }: { Contents: AdaptParentContextI['Contents'] }) => {
  const [when, setWhen] = useState<MediaQueryKey | null>(null)

  const AdaptProvider = useMemo(() => {
    const context: AdaptParentContextI = {
      Contents,
      setWhen,
    }

    return (props: { children?: any }) => (
      <AdaptParentContext.Provider value={context}>{props.children}</AdaptParentContext.Provider>
    )
  }, [Contents])

  return {
    AdaptProvider,
    when,
  }
}

export const Adapt = withStaticProperties(
  function Adapt({ when, children }: AdaptProps) {
    const context = useContext(AdaptParentContext)

    useLayoutEffect(() => {
      context?.setWhen(when as MediaQueryKey)
    }, [when, context])

    return children
  },
  {
    Contents: AdaptContents,
  }
)
