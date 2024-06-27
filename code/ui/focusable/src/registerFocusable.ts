import type { Focusable } from './focusable'

export const registerFocusable = (id: string, input: Focusable) => () => {
  // noop focus is handed natively
}

export const unregisterFocusable = (id: string) => {
  // noop focus is handed natively
}

export const focusFocusable = (id: string) => {
  // noop focus is handed natively
}
