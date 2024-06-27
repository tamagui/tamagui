import { useComposedRefs } from '@tamagui/compose-refs'
import { isWeb } from '@tamagui/constants'
import { composeEventHandlers } from '@tamagui/helpers'
import { useLabelContext } from '@tamagui/label'
import { usePrevious } from '@tamagui/use-previous'
import * as React from 'react'
import type { GestureResponderEvent, PressableProps, View, ViewProps } from 'react-native'

type SwitchBaseProps = ViewProps & Pick<PressableProps, 'onPress'>

export type SwitchExtraProps = {
  labeledBy?: string
  disabled?: boolean
  name?: string
  value?: string
  checked?: boolean
  defaultChecked?: boolean
  required?: boolean
  onCheckedChange?(checked: boolean): void
}

export type SwitchProps = SwitchBaseProps & SwitchExtraProps
export type SwitchState = boolean

function getState(checked: SwitchState) {
  return checked ? 'checked' : 'unchecked'
}

type InputProps = React.HTMLProps<'input'>

interface BubbleInputProps extends Omit<InputProps, 'checked'> {
  checked: boolean
  control: HTMLElement | null
  bubbles: boolean
}

// TODO make this native friendly
const BubbleInput = (props: BubbleInputProps) => {
  const { control, checked, bubbles = true, ...inputProps } = props
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
    // @ts-ignore
    <input
      type="checkbox"
      aria-hidden
      defaultChecked={checked}
      {...inputProps}
      tabIndex={-1}
      ref={ref}
      style={{
        ...props.style,
        position: 'absolute',
        pointerEvents: 'none',
        opacity: 0,
        margin: 0,
      }}
    />
  )
}

export function useSwitch<R extends View, P extends SwitchProps>(
  props: P,
  [checked, setChecked]: [SwitchState, React.Dispatch<React.SetStateAction<SwitchState>>],
  ref: React.Ref<R>
) {
  const { disabled, name, value, required } = props
  const hasConsumerStoppedPropagationRef = React.useRef(false)
  const [button, setButton] = React.useState<HTMLButtonElement | null>(null)
  const composedRefs = useComposedRefs<View>(ref, setButton as any)

  // We set this to true by default so that events bubble to forms without JS (SSR)
  const isFormControl = isWeb ? (button ? Boolean(button.closest('form')) : true) : false

  const labelId = useLabelContext(button)
  const ariaLabelledBy = props['aria-labelledby'] || props.labeledBy || labelId
  return {
    switchProps: {
      role: 'switch',
      'aria-checked': checked,
      ...(isWeb
        ? {
            tabIndex: disabled ? undefined : 0,
            'data-state': getState(checked),
            'data-disabled': disabled ? '' : undefined,
            disabled: disabled,
          }
        : {}),
      ...props,
      'aria-labelledby': ariaLabelledBy,
      onPress: composeEventHandlers(props.onPress, (event: GestureResponderEvent) => {
        setChecked((prevChecked) => !prevChecked)
        if (isWeb && isFormControl) {
          hasConsumerStoppedPropagationRef.current = event.isPropagationStopped()
          // if switch is in a form, stop propagation from the button so that we only propagate
          // one click event (from the input). We propagate changes from an input so that native
          // form validation works and form events reflect switch updates.
          if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation()
        }
      }),
    } satisfies SwitchBaseProps,
    switchRef: composedRefs,
    /**
     * insert as a sibling of your switch (should not be inside the switch)
     */
    bubbleInput:
      isWeb && isFormControl ? (
        <BubbleInput
          control={button}
          bubbles={!hasConsumerStoppedPropagationRef.current}
          name={name}
          value={value}
          checked={checked}
          required={required}
          disabled={disabled}
          // We transform because the input is absolutely positioned but we have
          // rendered it **after** the button. This pulls it back to sit on top
          // of the button.
          style={{ transform: 'translateX(-100%)' }}
        />
      ) : null,
  }
}
