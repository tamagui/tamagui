// fork of radix
// https://github.com/radix-ui/primitives/tree/main/packages/react/checkbox/src/Checkbox.tsx

import { usePrevious } from '@radix-ui/react-use-previous'
import { AnimatePresence } from '@tamagui/animate-presence'
import { useComposedRefs } from '@tamagui/compose-refs'
import { TamaguiElement, composeEventHandlers, withStaticProperties } from '@tamagui/core'
import type { Scope } from '@tamagui/create-context'
import { createContextScope } from '@tamagui/create-context'
import { ThemeableStack, ThemeableStackProps } from '@tamagui/stacks'
import { useControllableState } from '@tamagui/use-controllable-state'
// import { useSize } from '@tamagui/use-size'
import * as React from 'react'

type InputProps = any // Radix.ComponentPropsWithoutRef<'input'>
interface BubbleInputProps extends Omit<InputProps, 'checked'> {
  checked: CheckedState
  control: HTMLElement | null
  bubbles: boolean
}

const BubbleInput = (props: BubbleInputProps) => {
  const { control, checked, bubbles = true, ...inputProps } = props
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
      aria-hidden
      defaultChecked={isIndeterminate(checked) ? false : checked}
      {...inputProps}
      tabIndex={-1}
      ref={ref}
      style={{
        ...props.style,
        // ...controlSize,
        position: 'absolute',
        pointerEvents: 'none',
        opacity: 0,
        margin: 0,
      }}
    />
  )
}

function isIndeterminate(checked?: CheckedState): checked is 'indeterminate' {
  return checked === 'indeterminate'
}

function getState(checked: CheckedState) {
  return isIndeterminate(checked) ? 'indeterminate' : checked ? 'checked' : 'unchecked'
}

/* -------------------------------------------------------------------------------------------------
 * CheckboxIndicator
 * -----------------------------------------------------------------------------------------------*/

const INDICATOR_NAME = 'CheckboxIndicator'
export interface CheckboxIndicatorProps extends ThemeableStackProps {
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
    return (
      <AnimatePresence>
        {forceMount || isIndeterminate(context.state) || context.state === true ? (
          <ThemeableStack
            data-state={getState(context.state)}
            data-disabled={context.disabled ? '' : undefined}
            pointerEvents="none"
            {...indicatorProps}
            ref={forwardedRef}
          />
        ) : null}
      </AnimatePresence>
    )
  }
)

CheckboxIndicator.displayName = INDICATOR_NAME

/* -------------------------------------------------------------------------------------------------
 * Checkbox
 * -----------------------------------------------------------------------------------------------*/

const CHECKBOX_NAME = 'Checkbox'

type ScopedProps<P> = P & { __scopeCheckbox?: Scope }
const [createCheckboxContext, createCheckboxScope] = createContextScope(CHECKBOX_NAME)

type CheckedState = boolean | 'indeterminate'

type CheckboxContextValue = {
  state: CheckedState
  disabled?: boolean
}

const [CheckboxProvider, useCheckboxContext] =
  createCheckboxContext<CheckboxContextValue>(CHECKBOX_NAME)

type CheckboxElement = any // React.ElementRef<typeof Primitive.button>
export interface CheckboxProps
  extends Omit<ThemeableStackProps, 'checked' | 'defaultChecked'> {
  checked?: CheckedState
  defaultChecked?: CheckedState
  required?: boolean
  onCheckedChange?(checked: CheckedState): void

  name?: string
  value?: string
}
// TODO: implement the `native` prop

export const Checkbox = withStaticProperties(
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
      const [button, setButton] = React.useState<HTMLButtonElement | null>(null)
      const composedRefs = useComposedRefs(forwardedRef, (node) => setButton(node))
      const hasConsumerStoppedPropagationRef = React.useRef(false)
      // We set this to true by default so that events bubble to forms without JS (SSR)
      const isFormControl = button ? Boolean(button.closest('form')) : true
      const [checked = false, setChecked] = useControllableState({
        prop: checkedProp,
        defaultProp: defaultChecked!,
        onChange: onCheckedChange,
      })

      return (
        <CheckboxProvider scope={__scopeCheckbox} state={checked} disabled={disabled}>
          <ThemeableStack
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
            ref={composedRefs}
            //   onKeyDown={composeEventHandlers(props.onKeyDown, (event) => {
            //     // According to WAI ARIA, Checkboxes don't activate on enter keypress
            //     if (event.key === 'Enter') event.preventDefault()
            //   })}
            onPress={composeEventHandlers(props.onPress as any, (event) => {
              setChecked((prevChecked) =>
                isIndeterminate(prevChecked) ? true : !prevChecked
              )
              if (isFormControl) {
                hasConsumerStoppedPropagationRef.current = event.isPropagationStopped()
                // if checkbox is in a form, stop propagation from the button so that we only propagate
                // one click event (from the input). We propagate changes from an input so that native
                // form validation works and form events reflect checkbox updates.
                if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation()
              }
            })}
          />
          {isFormControl && (
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
          )}
        </CheckboxProvider>
      )
    }
  ),
  {
    Indicator: CheckboxIndicator,
  }
)

Checkbox.displayName = CHECKBOX_NAME

export { createCheckboxScope }
