import { useComposedRefs } from '@tamagui/compose-refs'
import { isWeb } from '@tamagui/constants'
import { registerFocusable } from '@tamagui/focusable'
import { composeEventHandlers } from '@tamagui/helpers'
import { useLabelContext } from '@tamagui/label'
import { useControllableState } from '@tamagui/use-controllable-state'
import type { StackProps } from '@tamagui/web'
import type { ReactElement } from 'react'
import { useContext, useEffect, useRef, useState } from 'react'
import type { GestureResponderEvent } from 'react-native'
import { BubbleInput } from './BubbleInput'
import { getState } from './utils'

interface UseRadioGroupParams {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  required?: boolean
  disabled?: boolean
  name?: string
  native?: boolean
  accentColor?: string
  orientation: 'horizontal' | 'vertical'
  ref?: React.Ref<ReactElement>
}
export function useRadioGroup(params: UseRadioGroupParams) {
  const {
    value: valueProp,
    onValueChange,
    defaultValue,
    required,
    disabled,
    name,
    native,
    accentColor,
    orientation,
    ref,
  } = params
  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue!,
    onChange: onValueChange,
  })

  return {
    providerValue: {
      value,
      onChange: setValue,
      required,
      disabled,
      name,
      native,
      accentColor,
    },
    frameAttrs: {
      role: 'radiogroup' as any,
      'aria-orientation': orientation,
      'data-disabled': disabled ? '' : undefined,
    },
    rovingFocusGroupAttrs: {
      orientation,
      loop: true,
    },
  }
}

interface UseRadioItemParams {
  radioGroupContext: React.Context<RadioGroupContextValue>
  value: string
  id?: string
  labelledBy?: string
  disabled?: boolean
  ref?: any
  onPress?: StackProps['onPress']
  onKeyDown?: React.HTMLProps<React.ReactElement>['onKeyDown']
  onFocus?: StackProps['onFocus']
}

export type RadioGroupContextValue = {
  value?: string
  disabled?: boolean
  required?: boolean
  onChange?: (value: string) => void
  name?: string
  native?: boolean
  accentColor?: string
}

const ARROW_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']

export const useRadioGroupItem = (params: UseRadioItemParams) => {
  const {
    radioGroupContext,
    value,
    labelledBy: ariaLabelledby,
    disabled: itemDisabled,
    ref: refProp,
    id,
    onPress,
    onKeyDown,
    onFocus,
  } = params
  const {
    value: groupValue,
    disabled,
    required,
    onChange,
    name,
    native,
    accentColor,
  } = useContext(radioGroupContext)

  const [button, setButton] = useState<HTMLButtonElement | null>(null)
  const hasConsumerStoppedPropagationRef = useRef(false)
  const ref = useRef<any>(null)
  const composedRefs = useComposedRefs(refProp, (node) => setButton(node), ref)
  const isArrowKeyPressedRef = useRef(false)

  const isFormControl = isWeb ? (button ? Boolean(button.closest('form')) : true) : false

  const checked = groupValue === value

  const labelId = useLabelContext(button)
  const labelledBy = ariaLabelledby || labelId

  useEffect(() => {
    if (isWeb) {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (ARROW_KEYS.includes(event.key)) {
          isArrowKeyPressedRef.current = true
        }
      }
      const handleKeyUp = () => {
        isArrowKeyPressedRef.current = false
      }
      document.addEventListener('keydown', handleKeyDown)
      document.addEventListener('keyup', handleKeyUp)
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
        document.removeEventListener('keyup', handleKeyUp)
      }
    }
  }, [])

  if (process.env.TAMAGUI_TARGET === 'native') {
    useEffect(() => {
      if (!id) return
      if (disabled) return

      return registerFocusable(id, {
        focusAndSelect: () => {
          onChange?.(value)
        },
        focus: () => {},
      })
    }, [id, value, disabled])
  }

  const isDisabled = disabled || itemDisabled

  return {
    providerValue: {
      checked,
    },
    checked,
    isFormControl,
    bubbleInput: (
      <BubbleInput
        isHidden={!native}
        control={button}
        bubbles={!hasConsumerStoppedPropagationRef.current}
        name={name}
        value={value}
        checked={checked}
        required={required}
        disabled={isDisabled}
        {...(isWeb &&
          native && {
            accentColor,
            id,
          })}
      />
    ),
    native,
    frameAttrs: {
      'data-state': getState(checked),
      'data-disabled': isDisabled ? '' : undefined,
      role: 'radio' as any,
      'aria-labelledby': labelledBy,
      'aria-checked': checked,
      'aria-required': required,
      disabled: isDisabled,
      ref: composedRefs,
      ...(isWeb && {
        type: 'button',
        value: value,
      }),
      id,
      onPress: composeEventHandlers(onPress as any, (event: GestureResponderEvent) => {
        if (!checked) {
          onChange?.(value)
        }

        if (isFormControl) {
          hasConsumerStoppedPropagationRef.current = event.isPropagationStopped()
          // if radio is in a form, stop propagation from the button so that we only propagate
          // one click event (from the input). We propagate changes from an input so that native
          // form validation works and form events reflect radio updates.
          if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation()
        }
      }),
      ...(isWeb && {
        onKeyDown: composeEventHandlers(onKeyDown as any, (event: KeyboardEvent) => {
          // According to WAI ARIA, Checkboxes don't activate on enter keypress
          if (event.key === 'Enter') event.preventDefault()
        }) as (event: KeyboardEvent) => void,
        onFocus: composeEventHandlers(onFocus, () => {
          /**
           * Our `RovingFocusGroup` will focus the radio when navigating with arrow keys
           * and we need to "check" it in that case. We click it to "check" it (instead
           * of updating `context.value`) so that the radio change event fires.
           */
          if (isArrowKeyPressedRef.current) {
            ;(ref.current as HTMLButtonElement)?.click()
          }
        }),
      }),
    },
    rovingFocusGroupAttrs: {
      asChild: 'expect-style' as boolean | 'web' | 'except-style' | 'except-style-web',
      focusable: !isDisabled,
      active: checked,
    },
  }
}

export type RadioGroupItemContextValue = {
  checked: boolean
  disabled?: boolean
}

type UseRadioGroupItemIndicatorParams = {
  radioGroupItemContext: React.Context<RadioGroupItemContextValue>
  disabled?: boolean
}
export function useRadioGroupItemIndicator(params: UseRadioGroupItemIndicatorParams) {
  const { radioGroupItemContext, disabled, ...rest } = params
  const { checked } = useContext(radioGroupItemContext)

  return {
    checked,
    'data-state': getState(checked),
    'data-disabled': disabled ? '' : undefined,
    ...rest,
  }
}
