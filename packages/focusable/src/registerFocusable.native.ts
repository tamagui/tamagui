// used for focusing on native

import type { Focusable } from './focusable'

const InputsMap = new Map<string, Focusable>()

export const registerFocusable = (id: string, input: Focusable) => {
  if (process.env.NODE_ENV === 'development') {
    if (InputsMap.has(id)) {
      console.warn(`Warning, duplicate ID for input: ${id}`)
    }
  }
  InputsMap.set(id, input)
  return () => {
    InputsMap.delete(id)
  }
}

export const unregisterFocusable = (id: string) => {
  InputsMap.delete(id)
}

export const focusFocusable = (id: string, select = false) => {
  const input = InputsMap.get(id)
  if (!input) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('No input found for id', id)
    }
    return
  }
  if (select || !input.focusAndSelect) {
    input.focus()
  } else {
    input.focusAndSelect()
  }
}
