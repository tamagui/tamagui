import { getBoundingClientRect } from './getBoundingClientRect'

export const getRect = (node: HTMLElement) => {
  const rect = getBoundingClientRect(node)
  if (!rect) return
  const { x, y, top, left } = rect
  return { x, y, width: node.offsetWidth, height: node.offsetHeight, top, left }
}

export const getOffsetRect = (node: HTMLElement) => {
  return {
    width: node.offsetWidth,
    height: node.offsetHeight,
    left: node.offsetLeft,
    top: node.offsetTop,
  }
}
