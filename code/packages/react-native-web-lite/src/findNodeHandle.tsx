import type React from 'react'
import { findDOMNode } from 'react-dom'

export const findNodeHandle = (host?: React.ReactInstance | Element | Text) => {
  let node
  try {
    if (host) {
      // @ts-ignore
      node = findDOMNode(host)
    }
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Couldn't find`, host, node, err)
    }
  }
  return node
}
