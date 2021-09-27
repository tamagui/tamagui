// forked from NativeBase
// The MIT License (MIT)

// Copyright (c) 2021 GeekyAnts India Pvt Ltd

// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
// the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import React from 'react'

export function useControllableProp<T>(prop: T | undefined, state: T) {
  const { current: isControlled } = React.useRef(prop !== undefined)
  const value = isControlled && typeof prop !== 'undefined' ? prop : state
  return [isControlled, value] as const
}

export interface UseControllableStateProps<T> {
  /**
   * The value to used in controlled mode
   */
  value?: T
  /**
   * The initial value to be used, in uncontrolled mode
   */
  defaultValue?: T | (() => T)
  /**
   * The callback fired when the value changes
   */
  onChange?: (value: T) => void
  /**
   * The component name (for warnings)
   */
  name?: string
}

/**
 * React hook for using controlling component state.
 * @param props
 */
export function useControllableState<T>(props: UseControllableStateProps<T>) {
  const { value: valueProp, defaultValue, onChange } = props

  const [valueState, setValue] = React.useState(defaultValue as T)
  const isControlled = valueProp !== undefined

  const value = isControlled ? (valueProp as T) : valueState

  const updateValue = React.useCallback(
    (next: any) => {
      const nextValue = typeof next === 'function' ? next(value) : next
      if (!isControlled) {
        setValue(nextValue)
      }
      onChange && onChange(nextValue)
    },
    [isControlled, onChange, value]
  )

  return [value, updateValue] as [T, React.Dispatch<React.SetStateAction<T>>]
}
