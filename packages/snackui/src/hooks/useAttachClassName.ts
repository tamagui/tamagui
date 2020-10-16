import { RefObject, useLayoutEffect } from 'react'
import { Platform } from 'react-native'

import { getNode } from '../helpers/getNode'

// works with react-native-web
// should be simpler but we need lower level access
export function useAttachClassName(
  cn: string | undefined,
  ref: RefObject<any>,
  mountArgs: any[] = []
) {
  if (Platform.OS !== 'web') {
    return
  }

  useLayoutEffect(() => {
    if (!cn) return
    if (!ref.current) return
    const node = getNode(ref.current)
    if (!node) {
      return
    }
    const names = cn.trim().split(' ').filter(Boolean)

    addClassNames(node, names)

    if (!(node instanceof HTMLElement)) {
      // disable mutation observation in other envs
      return
    }

    const observer = new MutationObserver(() => {
      addClassNames(node, names)
    })
    observer.observe(node, {
      attributes: true,
    })

    return () => {
      observer.disconnect()
      for (const name of names) {
        node.classList.remove(name)
      }
    }
  }, [...mountArgs, cn])
}

function addClassNames(node: HTMLElement, names: string[]) {
  if (node.classList) {
    for (const name of names) {
      if (!node.classList.contains(name)) {
        node.classList.add(name)
      }
    }
  }
}
