import { useComposedRefs } from '@tamagui/compose-refs'
import { isWeb } from '@tamagui/constants'
import { registerFocusable } from '@tamagui/focusable'
import { NativeValue, composeEventHandlers, withStaticProperties } from '@tamagui/helpers'
import { useLabelContext } from '@tamagui/label'
import { useControllableState } from '@tamagui/use-controllable-state'
import { usePrevious } from '@tamagui/use-previous'
import * as React from 'react'
import {
  GestureResponderEvent,
  Switch as NativeSwitch,
  SwitchProps as NativeSwitchProps,
  Platform,
  PressableProps,
  View,
  ViewProps,
} from 'react-native'

type SwitchBaseProps = ViewProps

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

export type SwitchProps = Omit<SwitchBaseProps & SwitchExtraProps, 'children'> & {
  children?: React.ReactNode | ((checked: boolean) => React.ReactNode)
  disabled?: boolean
  onPress?: PressableProps['onPress']
}

type SwitchComponent = React.FC<SwitchProps>

type SwitchThumbComponent = React.FC<SwitchBaseProps>

export const SwitchContext = React.createContext<{
  checked: boolean
  disabled?: boolean
}>({
  checked: false,
  disabled: false,
})

export function createSwitch<F extends SwitchComponent, T extends SwitchThumbComponent>({
  disableActiveTheme,
  Frame,
  Thumb,
}: {
  disableActiveTheme?: boolean
  Frame: F
  Thumb: T
}) {
  const SwitchThumbComponent = React.forwardRef<View>(function SwitchThumb(
    props,
    forwardedRef
  ) {
    const context = React.useContext(SwitchContext)
    const { disabled, checked } = context

    return (
      // @ts-expect-error TODO
      <Thumb
        data-state={getState(checked)}
        data-disabled={disabled ? '' : undefined}
        checked={checked}
        {...props}
        ref={forwardedRef}
      />
    )
  })

  const SwitchComponent = React.forwardRef<View, SwitchProps>(function SwitchFrame(
    props,
    forwardedRef
  ) {
    const {
      labeledBy: ariaLabelledby,
      name,
      checked: checkedProp,
      defaultChecked,
      required,
      disabled,
      value = 'on',
      onCheckedChange,
      native: nativeProp,
      nativeProps,
      children,
      ...switchProps
    } = props

    const native = Array.isArray(nativeProp) ? nativeProp : [nativeProp]

    const shouldRenderMobileNative =
      (!isWeb && nativeProp === true) ||
      (!isWeb && native.includes('mobile')) ||
      (native.includes('android') && Platform.OS === 'android') ||
      (native.includes('ios') && Platform.OS === 'ios')

    const [button, setButton] = React.useState<HTMLButtonElement | null>(null)
    const composedRefs = useComposedRefs(forwardedRef, setButton as any)
    const labelId = useLabelContext(button)
    const labelledBy = ariaLabelledby || labelId
    const hasConsumerStoppedPropagationRef = React.useRef(false)
    // We set this to true by default so that events bubble to forms without JS (SSR)
    const isFormControl = isWeb
      ? button
        ? Boolean(button.closest('form'))
        : true
      : false

    const [checked = false, setChecked] = useControllableState({
      prop: checkedProp,
      defaultProp: defaultChecked || false,
      onChange: onCheckedChange,
      transition: true,
    })

    let checkboxFrame = (
      <>
        {/* @ts-ignore */}
        <Frame
          checked={checked}
          disabled={disabled}
          themeShallow
          {...(!disableActiveTheme && {
            theme: checked ? 'active' : null,
            themeShallow: true,
          })}
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
          onPress={composeEventHandlers(props.onPress, (event: GestureResponderEvent) => {
            setChecked((prevChecked) => !prevChecked)
            if (isWeb && isFormControl && 'isPropagationStopped' in event) {
              hasConsumerStoppedPropagationRef.current = event.isPropagationStopped()
              // if switch is in a form, stop propagation from the button so that we only propagate
              // one click event (from the input). We propagate changes from an input so that native
              // form validation works and form events reflect switch updates.
              if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation()
            }
          })}
        >
          <View
            style={{
              alignSelf: 'stretch',
              flex: 1,
            }}
          >
            {typeof children === 'function' ? children(checked) : children}
          </View>
        </Frame>
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

    if (shouldRenderMobileNative) {
      checkboxFrame = (
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
      <SwitchContext.Provider
        value={{
          checked,
          disabled,
        }}
      >
        {checkboxFrame}
      </SwitchContext.Provider>
    )
  })

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
    Thumb: SwitchThumbComponent,
  })

  return Switch
}
