import React from 'react'
import { usePrevious } from '@tamagui/use-previous'

interface BubbleInputProps extends Omit<React.HTMLProps<HTMLInputElement>, 'checked'> {
  checked: boolean
  control: HTMLElement | null
  bubbles: boolean
  isHidden?: boolean
  accentColor?: string
}

export const BubbleInput = (props: BubbleInputProps) => {
  const { checked, bubbles = true, control, isHidden, accentColor, ...inputProps } = props
  const ref = React.useRef<HTMLInputElement>(null)
  const prevChecked = usePrevious(checked)

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
      setChecked.call(input, checked)
      input.dispatchEvent(event)
    }
  }, [prevChecked, checked, bubbles])

  return (
    <input
      type="radio"
      defaultChecked={checked}
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
              accentColor,
            }),

        ...props.style,
      }}
    />
  )
}
