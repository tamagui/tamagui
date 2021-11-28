import React, { createContext } from 'react'

import { rnw } from '../constants/rnw'

export const FallbackNativeContext = createContext(false)

export const TextAncestorContext = rnw?.TextAncestorContext ?? FallbackNativeContext

export const TextAncestorProvider = (props) => {
  return <TextAncestorContext.Provider value={false}>{props.children}</TextAncestorContext.Provider>
}
