import { useComposedRefs } from '@tamagui/compose-refs'
import { isWeb } from '@tamagui/constants'
import type { GestureReponderEvent } from '@tamagui/core'
import { composeEventHandlers } from '@tamagui/helpers'
import { useLabelContext } from '@tamagui/label'
import React, { useMemo } from 'react'
import type { PressableProps, View, ViewProps } from 'react-native'

import { BubbleInput } from './BubbleInput'
import { getState, isIndeterminate } from './utils'

export type CheckedState = boolean | 'indeterminate'

type CheckboxBaseProps = ViewProps & Pick<PressableProps, 'onPress'>

export type CheckboxExtraProps = {
  children?: React.ReactNode
  id?: string
  disabled?: boolean
  checked?: CheckedState
  defaultChecked?: CheckedState
  required?: boolean
  /**
   *
   * @param checked Either boolean or "indeterminate" which is meant to allow for a third state that means "neither", usually indicated by a minus sign.
   */
  onCheckedChange?(checked: CheckedState): void
  labelledBy?: string
  name?: string
  value?: string
}

export type CheckboxProps = CheckboxBaseProps & CheckboxExtraProps

export function useCheckbox<R extends View, P extends CheckboxProps>(
  props: P,
  [checked, setChecked]: [
    CheckedState,
    React.Dispatch<React.SetStateAction<CheckedState>>,
  ],
  ref: React.Ref<R>
) {
  const {
    labelledBy: ariaLabelledby,
    name,
    required,
    disabled,
    value = 'on',
    onCheckedChange,
    ...checkboxProps
  } = props
  const [button, setButton] = React.useState<HTMLButtonElement | null>(null)
  const composedRefs = useComposedRefs(ref, setButton as any)
  const hasConsumerStoppedPropagationRef = React.useRef(false)
  // We set this to true by default so that events bubble to forms without JS (SSR)
  const isFormControl = isWeb ? (button ? Boolean(button.closest('form')) : true) : false

  const labelId = useLabelContext(button)
  const labelledBy = ariaLabelledby || labelId

  const parentKeyDown = (props as React.HTMLProps<HTMLButtonElement>).onKeyDown

  const handleKeyDown = useMemo(
    () =>
      composeEventHandlers(parentKeyDown, (event) => {
        // According to WAI ARIA, Checkboxes don't activate on enter keypress
        if (event.key === 'Enter') event.preventDefault()
      }),
    [parentKeyDown]
  )

  const handlePress = useMemo(
    () =>
      composeEventHandlers(props.onPress as any, (event: GestureReponderEvent) => {
        setChecked((prevChecked) => (isIndeterminate(prevChecked) ? true : !prevChecked))
        if (isFormControl && 'isPropagationStopped' in event) {
          hasConsumerStoppedPropagationRef.current = event.isPropagationStopped()
          // if checkbox is in a form, stop propagation from the button so that we only propagate
          // one click event (from the input). We propagate changes from an input so that native
          // form validation works and form events reflect checkbox updates.
          if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation()
        }
      }),
    [isFormControl]
  )

  return {
    bubbleInput:
      isWeb && isFormControl ? (
        <BubbleInput
          isHidden
          control={button}
          bubbles={!hasConsumerStoppedPropagationRef.current}
          name={name}
          value={value}
          checked={checked}
          required={required}
          disabled={disabled}
        />
      ) : null,
    checkboxRef: composedRefs,
    checkboxProps: {
      role: 'checkbox',
      'aria-labelledby': labelledBy,
      'aria-checked': isIndeterminate(checked) ? 'mixed' : checked,
      ...checkboxProps,
      ...(isWeb && {
        type: 'button',
        value,
        'data-state': getState(checked),
        'data-disabled': disabled ? '' : undefined,
        disabled: disabled,
        onKeyDown: handleKeyDown,
      }),
      onPress: handlePress,
    } satisfies CheckboxBaseProps,
  }
}
