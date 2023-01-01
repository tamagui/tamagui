export const getBoundingClientRect = (node: HTMLElement | null): void | DOMRect => {
  if (!node || node.nodeType !== 1) return
  return node.getBoundingClientRect?.()
}
