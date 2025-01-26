import { ComponentContext, debounce } from 'tamagui'
import { useContext, useEffect, useRef, useState } from 'react'
import { mergeIfNotShallowEqual } from '@tamagui/web'
import { usePhoneScale } from '../general/_Showcase'
import { Platform } from 'react-native'

export type Dim = {
  width: number
  height: number
}

export const useContainerDim = (name: string): Dim => {
  const { groups } = useContext(ComponentContext.context)
  const { scale } = usePhoneScale()
  const psuedo = groups.state[name]?.pseudo
  if (!psuedo) {
    throw new Error(`useContainerDim: No parent group '${name}' found.`)
  }

  const mediaGroups = useRef<Set<string>>(new Set())

  const [dim, setDim] = useState<Dim>({ width: 0, height: 0 })

  const setDimDebounced = debounce(setDim, 50)

  useEffect(() => {
    const currentDim = {}
    return groups.subscribe((groupName, { layout }) => {
      if (groupName !== name) return
      if (layout) {
        const next = mergeIfNotShallowEqual(currentDim, {
          width: layout.width + layout.width * (1 - scale),
          height: layout.height + layout.height * (1 - scale),
        })
        if (next !== currentDim) {
          Object.assign(currentDim, next)
          setDimDebounced({ ...(currentDim as any) })
        }
      }
    })
  }, [name])

  return new Proxy(dim!, {
    get(target, prop) {
      mediaGroups.current?.add(prop as string)
      return target[prop]
    },
  })
}
