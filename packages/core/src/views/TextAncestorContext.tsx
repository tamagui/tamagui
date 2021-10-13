import React from 'react'

import { rnw } from '../constants/rnw'

export const TextAncestorContext = rnw?.TextAncestorContext

export const TextAncestorProvider = (props) => {
  if (TextAncestorContext) {
    return <TextAncestorContext.Provider value={false}>{props.children}</TextAncestorContext.Provider>
  }
  return props.children
}
