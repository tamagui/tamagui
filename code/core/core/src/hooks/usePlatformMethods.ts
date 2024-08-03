import * as React from 'react'
import { useIsomorphicLayoutEffect } from '@tamagui/constants'

import { getRect } from '../helpers/getRect'
import { measureLayout } from './useElementLayout'

// react native compat (web only)
export function usePlatformMethods(hostRef: RefObject<Element>) {
  useIsomorphicLayoutEffect(() => {
    const node = hostRef.current
    if (node) {
      // @ts-ignore
      node.measure ||= (callback) => measureLayout(node, null, callback)
      // @ts-ignore
      node.measureLayout ||= (relativeToNode, success) =>
        measureLayout(node as HTMLElement, relativeToNode, success)
      // @ts-ignore
      node.measureInWindow ||= (callback) => {
        if (!node) return
        setTimeout(() => {
          const { height, left, top, width } = getRect(node as HTMLElement)!
          callback(left, top, width, height)
        }, 0)
      }
    }
  }, [hostRef])
}
