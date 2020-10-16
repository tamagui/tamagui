import { debounce } from 'lodash'
import { useEffect } from 'react'

export function useScrollPosition<
  A extends HTMLDivElement,
  T extends React.RefObject<A>
>(ref: T, cb: (ref: A | null) => any) {
  useEffect(() => {
    const node = ref.current
    const scrollParent = getScrollParent(node)
    if (!scrollParent) return
    const onScroll = debounce(() => {
      cb(ref.current)
    }, 32)
    // TODO can make this deduped by container :)
    scrollParent.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      scrollParent.removeEventListener('scroll', onScroll)
    }
  }, [ref.current])
}

function getScrollParent(element: HTMLElement | null, includeHidden?: boolean) {
  if (!element) {
    return null
  }
  var style = getComputedStyle(element)
  var excludeStaticParent = style.position === 'absolute'
  var overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/

  if (style.position === 'fixed') {
    return window
  }
  let parent: HTMLElement | null = element
  while (parent) {
    parent = parent.parentElement
    if (!parent) {
      return null
    }
    style = getComputedStyle(parent)
    if (excludeStaticParent && style.position === 'static') {
      continue
    }
    if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX))
      return parent
  }

  return window
}
