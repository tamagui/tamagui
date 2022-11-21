export const getBoundingClientRect = (node: HTMLElement | null): void | DOMRect => {
  if (!node) return
  if (node.nodeType !== 1) return
  if (node.getBoundingClientRect) {
    return node.getBoundingClientRect()
  }
}
