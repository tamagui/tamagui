import { createStyledContext } from '@tamagui/core'
import * as React from 'react'
import type { FieldControlContextValue, FieldState, FieldStyleState } from './types'
import { createDefaultValidityState } from './validation'

const noop = () => {}
const unregister = () => {}

export const defaultFieldState: FieldState = {
  name: undefined,
  value: undefined,
  error: '',
  errors: [],
  validity: createDefaultValidityState(),
  valid: null,
  touched: false,
  dirty: false,
  filled: false,
  focused: false,
  disabled: false,
}

export const defaultFieldControl: FieldControlContextValue = {
  name: undefined,
  disabled: false,
  ariaProps: {},
  dataProps: {},
  onFocus: noop,
  onBlur: noop,
  onChange: noop,
  onDisabledChange: noop,
  registerControl: () => unregister,
}

export const FieldControlContext =
  React.createContext<FieldControlContextValue>(defaultFieldControl)

export const FieldControlProvider = FieldControlContext.Provider

export function useFieldControl() {
  return React.useContext(FieldControlContext)
}

export const FieldStateContext = React.createContext<FieldState>(defaultFieldState)

export function useFieldState() {
  return React.useContext(FieldStateContext)
}

export const FieldStyledContext = createStyledContext<FieldStyleState>(
  {
    valid: false,
    invalid: false,
    touched: false,
    dirty: false,
    filled: false,
    focused: false,
    disabled: false,
  },
  'Field'
)
