// via radix
// https://github.com/radix-ui/primitives/blob/main/packages/react/switch/src/Switch.tsx

import {
  GetProps,
  ReactComponentWithRef,
  SizeTokens,
  SizeVariantSpreadFunction,
  getVariableValue,
  styled,
  themeable,
} from '@tamagui/core'
import * as React from 'react'
import { View } from 'react-native'

import { useComposedRefs } from '../helpers/composeRefs'
import { Scope, createContextScope } from '../helpers/createContext'
import { getSize } from '../helpers/getSize'
import { useControllableState } from '../hooks/useControllableState'
import { usePrevious } from '../hooks/usePrevious'
import { useLabelContext } from './Label'
import { getSquareSize } from './Square'
import { XStack, YStackProps } from './Stacks'

const SWITCH_NAME = 'Switch'

type ScopedProps<P> = P & { __scopeSwitch?: Scope }
const scopeContexts = createContextScope(SWITCH_NAME)
const [createSwitchContext] = scopeContexts
export const createSwitchScope = scopeContexts[1]

type SwitchContextValue = { checked: boolean; disabled?: boolean; size: SizeTokens }
const [SwitchProvider, useSwitchContext] = createSwitchContext<SwitchContextValue>(SWITCH_NAME)

/* -------------------------------------------------------------------------------------------------
 * Switch
 * -----------------------------------------------------------------------------------------------*/

const WIDTH_SIZE = 3
const HEIGHT_SIZE = 1

const getSwitchHeight: SizeVariantSpreadFunction<any> = (val, extras) =>
  getSquareSize(getSize(val, HEIGHT_SIZE), extras)
const getSwitchWidth: SizeVariantSpreadFunction<any> = (val, extras) =>
  getSquareSize(getSize(val, WIDTH_SIZE), extras)

const SwitchFrame = styled(XStack, {
  name: 'Switch',
  tag: 'button',
  borderRadius: 1000,
  borderWidth: 0,

  variants: {
    size: {
      '...size': (val, extras) => {
        console.log(getSwitchHeight(val, extras), getSwitchWidth(val, extras))
        const { height, minHeight, maxHeight } = getSwitchHeight(val, extras)!
        const { width, minWidth, maxWidth } = getSwitchWidth(val, extras)!
        return {
          height,
          minHeight,
          maxHeight,
          width,
          minWidth,
          maxWidth,
        }
      },
    },
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
      size = '$4',
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
      <SwitchProvider scope={__scopeSwitch} checked={checked} disabled={disabled} size={size}>
        <SwitchFrame
          size={size}
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

const SwitchThumbFrame = styled(XStack, {
  name: 'SwitchThumb',
  backgroundColor: '$color',
  borderRadius: 1000,

  variants: {
    size: {
      '...size': getSwitchHeight,
    },
  },

  defaultVariants: {
    size: '$4',
  },
})

const SwitchThumb = SwitchThumbFrame.extractable(
  React.forwardRef<React.ElementRef<'span'>, SwitchThumbProps>(
    (props: ScopedProps<SwitchThumbProps>, forwardedRef) => {
      const { __scopeSwitch, ...thumbProps } = props
      const { size, disabled, checked } = useSwitchContext(THUMB_NAME, __scopeSwitch)
      return (
        <SwitchThumbFrame
          size={size}
          data-state={getState(checked)}
          data-disabled={disabled ? '' : undefined}
          {...thumbProps}
          {...(checked && {
            x:
              getVariableValue(getSize(size, WIDTH_SIZE)) -
              getVariableValue(getSize(size, HEIGHT_SIZE)),
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
