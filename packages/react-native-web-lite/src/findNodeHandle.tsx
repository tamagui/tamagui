import type React from 'react'
import { findDOMNode } from 'react-dom'

export const findNodeHandle = (host?: React.ReactInstance | Element | Text) => {
  let node
  try {
    // @ts-ignore
    node = findDOMNode(host)
  } catch {}
  return node
}
