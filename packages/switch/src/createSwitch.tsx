import { useComposedRefs } from '@tamagui/compose-refs'
import {
  NativeValue,
  SizeTokens,
  StackProps,
  TamaguiComponentExpectingVariants,
  TamaguiElement,
  composeEventHandlers,
  createStyledContext,
  getVariableValue,
  isWeb,
  useProps,
  withStaticProperties,
} from '@tamagui/core'
import { registerFocusable } from '@tamagui/focusable'
import { getSize } from '@tamagui/get-token'
import { useLabelContext } from '@tamagui/label'
import { useControllableState } from '@tamagui/use-controllable-state'
import { usePrevious } from '@tamagui/use-previous'
import * as React from 'react'
import {
  Switch as NativeSwitch,
  SwitchProps as NativeSwitchProps,
  Platform,
} from 'react-native'

export const SwitchContext = createStyledContext<{
  checked: boolean
  disabled?: boolean
  frameWidth: number
  size?: SizeTokens
  unstyled?: boolean
}>({
  checked: false,
  disabled: false,
  size: undefined,
  frameWidth: 0,
  unstyled: false,
})

type SwitchSharedProps = {
  size?: SizeTokens | number
  unstyled?: boolean
}

type SwitchBaseProps = StackProps & SwitchSharedProps

export type SwitchExtraProps = {
  labeledBy?: string
  name?: string
  value?: string
  checked?: boolean
  defaultChecked?: boolean
  required?: boolean
  native?: NativeValue<'mobile' | 'ios' | 'android'>
  nativeProps?: NativeSwitchProps
  onCheckedChange?(checked: boolean): void
}

export type SwitchProps = SwitchBaseProps & SwitchExtraProps

export function createSwitch<
  F extends TamaguiComponentExpectingVariants<
    SwitchProps,
    SwitchSharedProps & SwitchExtraProps
  >,
  T extends TamaguiComponentExpectingVariants<SwitchBaseProps, SwitchSharedProps>
>({ Frame, Thumb, acceptsUnstyled }: { Frame: F; Thumb: T; acceptsUnstyled?: boolean }) {
  const SwitchThumb = Thumb.styleable(function SwitchThumb(props, forwardedRef) {
    const { size: sizeProp, ...thumbProps } = props
    const { disabled, checked, unstyled, frameWidth } = React.useContext(SwitchContext)
    const [thumbWidth, setThumbWidth] = React.useState(0)
    const initialChecked = React.useRef(checked).current
    const distance = frameWidth - thumbWidth
    return (
      // @ts-ignore
      <Thumb
        theme={unstyled === false && checked ? 'active' : null}
        data-state={getState(checked)}
        data-disabled={disabled ? '' : undefined}
        alignSelf={initialChecked ? 'flex-end' : 'flex-start'}
        x={initialChecked ? (checked ? 0 : -distance) : checked ? distance : 0}
        {...thumbProps}
        // @ts-ignore
        onLayout={composeEventHandlers(props.onLayout, (e) =>
          // @ts-ignore
          setThumbWidth(e.nativeEvent.layout.width)
        )}
        ref={forwardedRef}
      />
    )
  })

  const SwitchComponent = Frame.extractable(
    React.forwardRef<TamaguiElement, SwitchProps>(function SwitchFrame(
      propsIn,
      forwardedRef
    ) {
      const styledContext = React.useContext(SwitchContext)
      const props = useProps(propsIn)
      const {
        labeledBy: ariaLabelledby,
        name,
        checked: checkedProp,
        defaultChecked,
        required,
        disabled,
        value = 'on',
        onCheckedChange,
        size = styledContext.size ?? '$true',
        unstyled = styledContext.unstyled ?? false,
        native: nativeProp,
        nativeProps,
        ...switchProps
      } = props

      const leftBorderWidth = (() => {
        let _: any = undefined
        for (const key in switchProps) {
          if (key === 'borderWidth' || key === 'borderLeftWidth') {
            _ = switchProps[key]
          }
        }
        if (acceptsUnstyled && _ === undefined && unstyled === false) {
          _ = 2 // default we use for styled
        }
        if (typeof _ === 'string') {
          _ = getVariableValue(getSize(_))
        }
        return +_
      })()

      const native = Array.isArray(nativeProp) ? nativeProp : [nativeProp]

      const shouldRenderMobileNative =
        (!isWeb && nativeProp === true) ||
        (!isWeb && native.includes('mobile')) ||
        (native.includes('android') && Platform.OS === 'android') ||
        (native.includes('ios') && Platform.OS === 'ios')

      const [button, setButton] = React.useState<HTMLButtonElement | null>(null)
      const composedRefs = useComposedRefs(forwardedRef, (node) => setButton(node as any))
      const labelId = useLabelContext(button)
      const labelledBy = ariaLabelledby || labelId
      const hasConsumerStoppedPropagationRef = React.useRef(false)
      // We set this to true by default so that events bubble to forms without JS (SSR)
      const isFormControl = isWeb
        ? button
          ? Boolean(button.closest('form'))
          : true
        : false

      const [frameWidth, setFrameWidth] = React.useState(0)

      const [checked = false, setChecked] = useControllableState({
        prop: checkedProp,
        defaultProp: defaultChecked || false,
        onChange: onCheckedChange,
        transition: true,
      })

      if (shouldRenderMobileNative) {
        return (
          <NativeSwitch
            value={checkedProp}
            onValueChange={onCheckedChange}
            {...nativeProps}
          />
        )
      }

      if (!isWeb) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        React.useEffect(() => {
          if (!props.id) return
          return registerFocusable(props.id, {
            focus: () => {
              setChecked((x) => !x)
            },
          })
        }, [props.id, setChecked])
      }

      return (
        <>
          {/* @ts-ignore */}
          <Frame
            unstyled={unstyled}
            size={size}
            checked={checked}
            disabled={disabled}
            frameWidth={frameWidth ? frameWidth - leftBorderWidth * 2 : 0}
            theme={checked ? 'active' : null}
            themeShallow
            role="switch"
            aria-checked={checked}
            aria-labelledby={labelledBy}
            aria-required={required}
            data-state={getState(checked)}
            data-disabled={disabled ? '' : undefined}
            // @ts-ignore
            tabIndex={disabled ? undefined : 0}
            // @ts-ignore
            value={value}
            {...switchProps}
            ref={composedRefs}
            onPress={composeEventHandlers(props.onPress, (event) => {
              setChecked((prevChecked) => !prevChecked)
              if (isWeb && isFormControl) {
                hasConsumerStoppedPropagationRef.current = event.isPropagationStopped()
                // if switch is in a form, stop propagation from the button so that we only propagate
                // one click event (from the input). We propagate changes from an input so that native
                // form validation works and form events reflect switch updates.
                if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation()
              }
            })}
            // @ts-ignore
            onLayout={composeEventHandlers(props.onLayout, (e) =>
              // @ts-ignore
              setFrameWidth(e.nativeEvent.layout.width)
            )}
          />
          {isWeb && isFormControl && (
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
        </>
      )
    })
  )

  /* ---------------------------------------------------------------------------------------------- */

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
    // const controlSize = useSize(control)

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

  const Switch = withStaticProperties(SwitchComponent, {
    Thumb: SwitchThumb,
  })

  return Switch
}
