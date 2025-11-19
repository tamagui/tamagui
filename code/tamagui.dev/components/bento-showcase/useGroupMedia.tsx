import type { UseMediaState, WidthHeight } from '@tamagui/web'
import { GroupContext, mediaKeyMatch, mergeIfNotShallowEqual } from '@tamagui/web'
import { useContext, useEffect, useRef, useState } from 'react'

export const useGroupMedia = (name: string): UseMediaState => {
  const groupsConext = useContext(GroupContext)
  const groups = groupsConext?.[name]
  const psuedo = groups?.state?.pseudo

  if (!psuedo) {
    throw new Error(`useGroupMedia: No parent group '${name}' found.`)
  }

  const mediaGroups = useRef<Set<string>>(new Set())

  const [finalState, setMediaState] = useState<UseMediaState>({} as any)

  useEffect(() => {
    const currentMedia = {}
    return groups.subscribe(({ layout }) => {
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

function getMediaState(mediaGroups: Set<string>, layout: WidthHeight) {
  return Object.fromEntries(
    [...mediaGroups].map((mediaKey) => {
      return [mediaKey, mediaKeyMatch(mediaKey, layout as any)]
    })
  )
}
