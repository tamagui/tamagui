import { TextAncestorContext as RNWTextAncestorContext } from '@tamagui/rnw'
import React, { createContext } from 'react'

export const FallbackNativeContext = createContext(false)

export const TextAncestorContext = RNWTextAncestorContext ?? FallbackNativeContext

export const TextAncestorProvider = (props) => {
  return <TextAncestorContext.Provider value={false}>{props.children}</TextAncestorContext.Provider>
}
