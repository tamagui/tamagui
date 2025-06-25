export const getBoundingClientRect = (node: HTMLElement | null): undefined | DOMRect => {
  if (!node || node.nodeType !== 1) return
  return node.getBoundingClientRect?.()
}

export const getBoundingClientRectAsync = (
  element: HTMLElement
): Promise<DOMRectReadOnly | undefined> => {
  return new Promise((resolve) => {
    let didFallback = false
    function fallbackToSync() {
      didFallback = true
      resolve(getBoundingClientRect(element))
    }
    const tm = setTimeout(fallbackToSync, 32)
    const observer = new IntersectionObserver(
      (entries, ob) => {
        clearTimeout(tm)
        ob.disconnect()
        if (!didFallback) {
          resolve(entries[0]?.boundingClientRect)
        }
      },
      {
        threshold: 0.0001,
      }
    )
    observer.observe(element)
  })
}
