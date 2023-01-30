// fork of radix
// https://github.com/radix-ui/primitives/tree/main/packages/react/checkbox/src/Checkbox.tsx

import {
  GetProps,
  TamaguiElement,
  composeEventHandlers,
  isWeb,
  styled,
  withStaticProperties,
} from '@tamagui/core'
import type { Scope } from '@tamagui/create-context'
import { createContextScope } from '@tamagui/create-context'
import { registerFocusable } from '@tamagui/focusable'
import { getButtonSized } from '@tamagui/get-button-sized'
import { SizableStack, ThemeableStack, ThemeableStackProps } from '@tamagui/stacks'
import { useControllableState } from '@tamagui/use-controllable-state'
// import { useSize } from '@tamagui/use-size'
import * as React from 'react'

import { BubbleInput } from './BubbleInput'
import { CheckedState, getState, isIndeterminate } from './helpers'

/* -------------------------------------------------------------------------------------------------
 * CheckboxIndicator
 * -----------------------------------------------------------------------------------------------*/

const INDICATOR_NAME = 'CheckboxIndicator'

const CheckboxIndicatorFrame = styled(ThemeableStack, {
  name: INDICATOR_NAME,
})

type CheckboxIndicatorFrameProps = GetProps<typeof CheckboxIndicatorFrame>

export type CheckboxIndicatorProps = CheckboxIndicatorFrameProps & {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true
}

const CheckboxIndicator = React.forwardRef<TamaguiElement, CheckboxIndicatorProps>(
  (props: ScopedProps<CheckboxIndicatorProps>, forwardedRef) => {
    const { __scopeCheckbox, forceMount, ...indicatorProps } = props
    const context = useCheckboxContext(INDICATOR_NAME, __scopeCheckbox)
    if (forceMount || isIndeterminate(context.state) || context.state === true)
      return (
        <CheckboxIndicatorFrame
          theme="active"
          data-state={getState(context.state)}
          data-disabled={context.disabled ? '' : undefined}
          pointerEvents="none"
          {...indicatorProps}
          ref={forwardedRef}
        />
      )

    return null
  }
)

CheckboxIndicator.displayName = INDICATOR_NAME

/* -------------------------------------------------------------------------------------------------
 * Checkbox
 * -----------------------------------------------------------------------------------------------*/

const CHECKBOX_NAME = 'Checkbox'

export const CheckboxFrame = styled(ThemeableStack, {
  name: CHECKBOX_NAME,
  tag: 'button',
  backgroundColor: '$background',
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 2,
  borderColor: 'transparent',

  focusStyle: {
    borderColor: '$borderColorFocus',
  },

  variants: {
    size: {
      '...size': (val, extras) => {
        const buttonStyles = getButtonSized(val, extras)
        return {
          height: buttonStyles.height,
          width: buttonStyles.height,
          borderRadius: buttonStyles.borderRadius,
        }
      },
    },
  } as const,

  defaultVariants: {
    size: '$true',
  },
})

type ScopedProps<P> = P & { __scopeCheckbox?: Scope }
const [createCheckboxContext, createCheckboxScope] = createContextScope(CHECKBOX_NAME)

type CheckboxContextValue = {
  state: CheckedState
  disabled?: boolean
}

const [CheckboxProvider, useCheckboxContext] =
  createCheckboxContext<CheckboxContextValue>(CHECKBOX_NAME)

type CheckboxElement = any // React.ElementRef<typeof Primitive.button>
type CheckboxFrameProps = GetProps<typeof CheckboxFrame>
export interface CheckboxProps
  extends Omit<CheckboxFrameProps, 'checked' | 'defaultChecked'> {
  checked?: CheckedState
  defaultChecked?: CheckedState
  required?: boolean
  onCheckedChange?(checked: CheckedState): void

  name?: string
  value?: string
}
// TODO: implement the `native` prop

export const Checkbox = withStaticProperties(
  CheckboxFrame.extractable(
    React.forwardRef<CheckboxElement, CheckboxProps>(
      (props: ScopedProps<CheckboxProps>, forwardedRef) => {
        const {
          __scopeCheckbox,
          name,
          checked: checkedProp,
          defaultChecked,
          required,
          disabled,
          value = 'on',
          onCheckedChange,
          ...checkboxProps
        } = props
        // const [button, setButton] = React.useState<HTMLButtonElement | null>(null)
        // const composedRefs = useComposedRefs(forwardedRef, (node) => setButton(node))
        const hasConsumerStoppedPropagationRef = React.useRef(false)
        // We set this to true by default so that events bubble to forms without JS (SSR)
        // const isFormControl = button ? Boolean(button.closest('form')) : true
        const [checked = false, setChecked] = useControllableState({
          prop: checkedProp,
          defaultProp: defaultChecked!,
          onChange: onCheckedChange,
        })

        if (!isWeb) {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          React.useEffect(() => {
            if (!props.id) return
            return registerFocusable(props.id, {
              focusAndSelect: () => {
                setChecked((x) => !x)
              },
              focus: () => {},
            })
          }, [props.id, setChecked])
        }

        return (
          <CheckboxProvider scope={__scopeCheckbox} state={checked} disabled={disabled}>
            <CheckboxFrame
              theme={checked ? 'active' : null}
              tag="button"
              //   type="button"
              role="checkbox"
              aria-checked={isIndeterminate(checked) ? 'mixed' : checked}
              aria-required={required}
              data-state={getState(checked)}
              data-disabled={disabled ? '' : undefined}
              disabled={disabled}
              //   value={value}
              {...checkboxProps}
              // ref={composedRefs}
              ref={forwardedRef}
              //   onKeyDown={composeEventHandlers(props.onKeyDown, (event) => {
              //     // According to WAI ARIA, Checkboxes don't activate on enter keypress
              //     if (event.key === 'Enter') event.preventDefault()
              //   })}
              onPress={composeEventHandlers(props.onPress as any, (event) => {
                setChecked((prevChecked) =>
                  isIndeterminate(prevChecked) ? true : !prevChecked
                )
                // if (isFormControl) {
                //   hasConsumerStoppedPropagationRef.current = event.isPropagationStopped()
                //   // if checkbox is in a form, stop propagation from the button so that we only propagate
                //   // one click event (from the input). We propagate changes from an input so that native
                //   // form validation works and form events reflect checkbox updates.
                //   if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation()
                // }
              })}
            />

            <BubbleInput
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
          </CheckboxProvider>
        )
      }
    )
  ),
  {
    Indicator: CheckboxIndicator,
  }
)

Checkbox.displayName = CHECKBOX_NAME

export { createCheckboxScope }
