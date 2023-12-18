import { useComposedRefs } from '@tamagui/compose-refs'
import { isWeb } from '@tamagui/constants'
import { GestureReponderEvent } from '@tamagui/core/types'
import { Scope, createContextScope } from '@tamagui/create-context'
import { registerFocusable } from '@tamagui/focusable'
import { composeEventHandlers, withStaticProperties } from '@tamagui/helpers'
import { useLabelContext } from '@tamagui/label'
import { useControllableState } from '@tamagui/use-controllable-state'
import React, { RefAttributes } from 'react'
import { Pressable, PressableProps, View, ViewProps } from 'react-native'

import { BubbleInput } from './BubbleInput'
import { getState, isIndeterminate } from './utils'

type ScopedProps<P> = P & { __scopeCheckbox?: Scope }
// TODO: add nested button provider
// TODO: remove all ts-ignore's
export const CHECKBOX_NAME = 'Checkbox'
export const INDICATOR_NAME = 'CheckboxIndicator'

const [createCheckboxContext, createCheckboxScope] = createContextScope(CHECKBOX_NAME)

export type CheckedState = boolean | 'indeterminate'

type CheckboxContextValue = {
  state: CheckedState
  disabled?: boolean
}

export type CheckboxBaseProps = {
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
  native?: boolean
}

export const [CheckboxProvider, useCheckboxContext] =
  createCheckboxContext<CheckboxContextValue>(CHECKBOX_NAME)

export { createCheckboxScope }

export type CheckboxProps = Omit<PressableProps, 'children'> &
  Omit<CheckboxBaseProps, 'children'> & {
    children?: React.ReactNode | ((checked: CheckedState) => React.ReactNode)
  }

export type CheckboxIndicatorBaseProps = {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: boolean
}
export type CheckboxIndicatorProps = CheckboxIndicatorBaseProps & ViewProps
type CheckboxIndicatorComponent = React.ForwardRefExoticComponent<ViewProps>

export function createCheckbox<
  F extends React.FC<PressableProps & RefAttributes<View>>,
  T extends React.FC<ViewProps & RefAttributes<View>>
>({
  Frame: _Frame = Pressable as any,
  Indicator: _Indicator = View as any,
}: {
  Frame?: F
  Indicator?: T
}) {
  const Frame = _Frame as unknown as typeof Pressable
  const Indicator = _Indicator as unknown as typeof View
  const CheckboxComponent = React.forwardRef<
    typeof Pressable,
    ScopedProps<CheckboxProps>
  >(function Checkbox(props, forwardedRef) {
    const {
      __scopeCheckbox,
      labelledBy: ariaLabelledby,
      name,
      checked: checkedProp,
      defaultChecked,
      required,
      disabled,
      value = 'on',
      onCheckedChange,
      native,
      ...checkboxProps
    } = props
    const [button, setButton] = React.useState<HTMLButtonElement | null>(null)
    const composedRefs = useComposedRefs(forwardedRef, (node) => setButton(node as any))
    const hasConsumerStoppedPropagationRef = React.useRef(false)
    // We set this to true by default so that events bubble to forms without JS (SSR)
    const isFormControl = isWeb
      ? button
        ? Boolean(button.closest('form'))
        : true
      : false
    const [checked = false, setChecked] = useControllableState({
      prop: checkedProp,
      defaultProp: defaultChecked!,
      onChange: onCheckedChange,
    })

    const labelId = useLabelContext(button)
    const labelledBy = ariaLabelledby || labelId

    if (process.env.TAMAGUI_TARGET === 'native') {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      React.useEffect(() => {
        if (!props.id) return
        if (disabled) return

        return registerFocusable(props.id, {
          focusAndSelect: () => {
            setChecked((x) => !x)
          },
          focus: () => {},
        })
      }, [props.id, setChecked, disabled])
    }

    return (
      <CheckboxProvider scope={__scopeCheckbox} state={checked} disabled={disabled}>
        {isWeb && native ? (
          <BubbleInput
            control={button}
            bubbles={!hasConsumerStoppedPropagationRef.current}
            name={name}
            value={value}
            checked={checked}
            required={required}
            disabled={disabled}
            id={props.id}
          />
        ) : (
          <>
            <Frame
              role="checkbox"
              aria-labelledby={labelledBy}
              aria-checked={isIndeterminate(checked) ? 'mixed' : checked}
              aria-required={required}
              data-state={getState(checked)}
              data-disabled={disabled ? '' : undefined}
              disabled={disabled}
              {...checkboxProps}
              ref={composedRefs as any}
              {...(isWeb && {
                type: 'button',
                value,
                onKeyDown: composeEventHandlers(
                  (props as React.HTMLProps<HTMLButtonElement>).onKeyDown,
                  (event) => {
                    // According to WAI ARIA, Checkboxes don't activate on enter keypress
                    if (event.key === 'Enter') event.preventDefault()
                  }
                ),
              })}
              onPress={composeEventHandlers(
                props.onPress as any,
                (event: GestureReponderEvent) => {
                  setChecked((prevChecked) =>
                    isIndeterminate(prevChecked) ? true : !prevChecked
                  )
                  if (isFormControl && 'isPropagationStopped' in event) {
                    hasConsumerStoppedPropagationRef.current =
                      event.isPropagationStopped()
                    // if checkbox is in a form, stop propagation from the button so that we only propagate
                    // one click event (from the input). We propagate changes from an input so that native
                    // form validation works and form events reflect checkbox updates.
                    if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation()
                  }
                }
              )}
            >
              {typeof props.children === 'function'
                ? props.children(checked)
                : props.children}
            </Frame>
            {isWeb && isFormControl ? (
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
            ) : null}
          </>
        )}
      </CheckboxProvider>
    )
  })

  const CheckboxIndicator = React.forwardRef<
    CheckboxIndicatorComponent,
    CheckboxIndicatorProps
  >((props: ScopedProps<CheckboxIndicatorProps>, forwardedRef) => {
    const { __scopeCheckbox, children, forceMount, ...indicatorProps } = props
    if (process.env.NODE_ENV === 'development' && !children) {
      console.warn(
        `Warning: You created a Checkbox.Indicator without passing an child prop for it to use as an icon.`
      )
    }
    const context = useCheckboxContext(INDICATOR_NAME, __scopeCheckbox)
    if (forceMount || isIndeterminate(context.state) || context.state === true)
      return (
        <Indicator
          data-state={getState(context.state)}
          data-disabled={context.disabled ? '' : undefined}
          style={{
            pointerEvents: 'none',
          }}
          {...indicatorProps}
          ref={forwardedRef as any}
        >
          {children}
        </Indicator>
      )

    return null
  })

  return withStaticProperties(CheckboxComponent, {
    Indicator: CheckboxIndicator,
  })
}
