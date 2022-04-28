// via radix
// https://github.com/radix-ui/primitives/blob/main/packages/react/switch/src/Switch.tsx

import { GetProps, ReactComponentWithRef, styled, themeable } from '@tamagui/core'
import * as React from 'react'
import { View } from 'react-native'

import { useComposedRefs } from '../helpers/composeRefs'
// import { useComposedRefs } from '@radix-ui/react-compose-refs';
// import { createContextScope } from '@radix-ui/react-context';
// import { useControllableState } from '@radix-ui/react-use-controllable-state';
// import { usePrevious } from '@radix-ui/react-use-previous';
// import { useSize } from '@radix-ui/react-use-size';
// import { Primitive } from '@radix-ui/react-primitive';
// import { useLabelContext } from '@radix-ui/react-label';
import { Scope, createContextScope } from '../helpers/createContext'
import { useControllableState } from '../hooks/useControllableState'
import { usePrevious } from '../hooks/usePrevious'
import { Circle } from './Circle'
import { useLabelContext } from './Label'
import { SizableStack, getButtonSize } from './SizableStack'
import { XStack, YStack, YStackProps } from './Stacks'

const SWITCH_NAME = 'Switch'

type ScopedProps<P> = P & { __scopeSwitch?: Scope }
const [createSwitchContext, createSwitchScope] = createContextScope(SWITCH_NAME)

type SwitchContextValue = { checked: boolean; disabled?: boolean }
const [SwitchProvider, useSwitchContext] = createSwitchContext<SwitchContextValue>(SWITCH_NAME)

/* -------------------------------------------------------------------------------------------------
 * Switch
 * -----------------------------------------------------------------------------------------------*/

const SwitchFrame = styled(XStack, {
  name: 'Switch',
  tag: 'button',
  borderRadius: 100,
  borderWidth: 0,

  variants: {
    '...size': (val, extras) => getButtonSize(val, extras),
    // '...size': (val) => {
    //   return {
    //     width: 100,
    //     height: 40,
    //   }
    // },
  },

  defaultVariants: {
    size: '$4',
  },
})

type SwitchButtonProps = GetProps<typeof SwitchFrame>

export type SwitchProps = SwitchButtonProps & {
  'aria-labelledby'?: any
  name?: string
  value?: string
  checked?: boolean
  defaultChecked?: boolean
  required?: boolean
  onCheckedChange?(checked: boolean): void
}

const SwitchComponent = React.forwardRef<HTMLButtonElement | View, SwitchProps>(
  (props: ScopedProps<SwitchProps>, forwardedRef) => {
    const {
      __scopeSwitch,
      'aria-labelledby': ariaLabelledby,
      name,
      checked: checkedProp,
      defaultChecked,
      required,
      disabled,
      value = 'on',
      onCheckedChange,
      ...switchProps
    } = props
    const [button, setButton] = React.useState<HTMLButtonElement | null>(null)
    const composedRefs = useComposedRefs(forwardedRef, (node) => setButton(node as any))
    const labelId = useLabelContext(button)
    const labelledBy = ariaLabelledby || labelId
    const hasConsumerStoppedPropagationRef = React.useRef(false)
    // We set this to true by default so that events bubble to forms without JS (SSR)
    const isFormControl = button ? Boolean(button.closest('form')) : true
    const [checked = false, setChecked] = useControllableState({
      prop: checkedProp,
      defaultProp: defaultChecked || false,
      onChange: onCheckedChange,
    })

    return (
      <SwitchProvider scope={__scopeSwitch} checked={checked} disabled={disabled}>
        <SwitchFrame
          // @ts-ignore
          role="switch"
          aria-checked={checked}
          aria-labelledby={labelledBy}
          aria-required={required}
          data-state={getState(checked)}
          data-disabled={disabled ? '' : undefined}
          disabled={disabled}
          // @ts-ignore
          value={value}
          {...switchProps}
          ref={composedRefs}
          onPress={(event) => {
            props.onPress?.(event)
            setChecked((prevChecked) => !prevChecked)
            if (isFormControl) {
              hasConsumerStoppedPropagationRef.current = event.isPropagationStopped()
              // if switch is in a form, stop propagation from the button so that we only propagate
              // one click event (from the input). We propagate changes from an input so that native
              // form validation works and form events reflect switch updates.
              if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation()
            }
          }}
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
      </SwitchProvider>
    )
  }
)

SwitchComponent.displayName = SWITCH_NAME

export const Switch: ReactComponentWithRef<SwitchProps, HTMLButtonElement | View> & {
  Thumb: typeof SwitchThumb
} = SwitchFrame.extractable(themeable(SwitchComponent as any) as any, {
  neverFlatten: true,
})

/* -------------------------------------------------------------------------------------------------
 * SwitchThumb
 * -----------------------------------------------------------------------------------------------*/

const THUMB_NAME = 'SwitchThumb'

export type SwitchThumbProps = YStackProps

const SwitchThumbFrame = styled(Circle, {
  name: 'SwitchThumb',
  size: '$4',
})

const SwitchThumb = SwitchThumbFrame.extractable(
  React.forwardRef<React.ElementRef<'span'>, SwitchThumbProps>(
    (props: ScopedProps<SwitchThumbProps>, forwardedRef) => {
      const { __scopeSwitch, ...thumbProps } = props
      const context = useSwitchContext(THUMB_NAME, __scopeSwitch)
      return (
        <SwitchThumbFrame
          data-state={getState(context.checked)}
          data-disabled={context.disabled ? '' : undefined}
          {...thumbProps}
          {...(context.checked && {
            x: 20,
          })}
          ref={forwardedRef}
        />
      )
    }
  ),
  {
    neverFlatten: true,
  }
)

SwitchThumb.displayName = THUMB_NAME
Switch.Thumb = SwitchThumb

/* ---------------------------------------------------------------------------------------------- */

type InputProps = any //Radix.ComponentPropsWithoutRef<'input'>
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
  // const controlSize = useSize(control)

  // Bubble checked change to parents (e.g form change event)
  React.useEffect(() => {
    const input = ref.current!
    const inputProto = window.HTMLInputElement.prototype
    const descriptor = Object.getOwnPropertyDescriptor(inputProto, 'checked') as PropertyDescriptor
    const setChecked = descriptor.set
    if (prevChecked !== checked && setChecked) {
      const event = new Event('click', { bubbles })
      setChecked.call(input, checked)
      input.dispatchEvent(event)
    }
  }, [prevChecked, checked, bubbles])

  return (
    <input
      type="checkbox"
      aria-hidden
      defaultChecked={checked}
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

function getState(checked: boolean) {
  return checked ? 'checked' : 'unchecked'
}

// export {
//   createSwitchScope,
//   //
//   Switch,
//   SwitchThumb,
//   //
//   Root,
//   Thumb,
// }
// export type { SwitchProps, SwitchThumbProps }
