import { usePrevious } from '@tamagui/use-previous'
import * as React from 'react'

import type { CheckedState } from './useCheckbox'
import { isIndeterminate } from './utils'

export interface BubbleInputProps extends Omit<React.ComponentProps<'input'>, 'checked'> {
  checked: CheckedState
  control: HTMLElement | null
  bubbles: boolean

  isHidden?: boolean
}

export const BubbleInput = (props: BubbleInputProps) => {
  const { checked, bubbles = true, control, isHidden, ...inputProps } = props
  const ref = React.useRef<HTMLInputElement>(null)
  const prevChecked = usePrevious(checked)
  //   const controlSize = useSize(control)
  // Bubble checked change to parents (e.g form change event)
  React.useEffect(() => {
    const input = ref.current!
    const inputProto = window.HTMLInputElement.prototype
    const descriptor = Object.getOwnPropertyDescriptor(
      inputProto,
      'checked'
    ) as PropertyDescriptor
    const setChecked = descriptor.set

    if (prevChecked !== checked && setChecked) {
      const event = new Event('click', { bubbles })
      input.indeterminate = isIndeterminate(checked)
      setChecked.call(input, isIndeterminate(checked) ? false : checked)
      input.dispatchEvent(event)
    }
  }, [prevChecked, checked, bubbles])

  return (
    <input
      type="checkbox"
      defaultChecked={isIndeterminate(checked) ? false : checked}
      {...inputProps}
      tabIndex={-1}
      ref={ref}
      aria-hidden={isHidden}
      style={{
        ...(isHidden
          ? {
              // ...controlSize,
              position: 'absolute',
              pointerEvents: 'none',
              opacity: 0,
              margin: 0,
            }
          : {
              appearance: 'auto',
              accentColor: 'var(--color6)',
            }),

        ...props.style,
      }}
    />
  )
}
