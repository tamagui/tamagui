import { ComponentContext } from 'tamagui'
import { useContext, useEffect, useRef, useState } from 'react'
import type { LayoutEvent, UseMediaState } from '@tamagui/web'
import { mediaKeyMatch, mergeIfNotShallowEqual } from '@tamagui/web'

export const useGroupMedia = (name: string): UseMediaState => {
  const { groups } = useContext(ComponentContext.context)
  const psuedo = groups.state[name]?.pseudo
  if (!psuedo) {
    throw new Error(`useGroupMedia: No parent group '${name}' found.`)
  }

  const mediaGroups = useRef<Set<string>>(new Set())

  const [finalState, setMediaState] = useState<UseMediaState>({} as any)

  useEffect(() => {
    const currentMedia = {}
    return groups.subscribe((groupName, { layout }) => {
      if (groupName !== name) return
      if (layout && mediaGroups) {
        const mediaState = getMediaState(mediaGroups.current, layout)
        const next = mergeIfNotShallowEqual(currentMedia, mediaState)
        if (next !== currentMedia) {
          Object.assign(currentMedia, next)
          setMediaState({ ...(currentMedia as any) })
        }
      }
    })
  }, [name, setMediaState])

  return new Proxy(finalState!, {
    get(target, prop) {
      mediaGroups.current?.add(prop as string)
      return target[prop]
    },
  })
}

function getMediaState(
  mediaGroups: Set<string>,
  layout: LayoutEvent['nativeEvent']['layout']
) {
  return Object.fromEntries(
    [...mediaGroups].map((mediaKey) => {
      return [mediaKey, mediaKeyMatch(mediaKey, layout as any)]
    })
  )
}
