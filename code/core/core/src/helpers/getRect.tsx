import { getBoundingClientRect } from './getBoundingClientRect'

export const getRect = (node: HTMLElement) => {
  const rect = getBoundingClientRect(node)
  if (!rect) return
  const { x, y, top, left } = rect
  return { x, y, width: node.offsetWidth, height: node.offsetHeight, top, left }
}
