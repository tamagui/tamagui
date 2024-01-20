import { useComposedRefs } from '@tamagui/compose-refs'
import { isWeb } from '@tamagui/constants'
import {
  NativeValue,
  SizeTokens,
  StackProps,
  TamaguiComponentExpectingVariants,
  useProps,
} from '@tamagui/core'
import { registerFocusable } from '@tamagui/focusable'
import { composeEventHandlers, withStaticProperties } from '@tamagui/helpers'
import { useLabelContext } from '@tamagui/label'
import { ButtonNestingContext, YStack } from '@tamagui/stacks'
import { useControllableState } from '@tamagui/use-controllable-state'
import { usePrevious } from '@tamagui/use-previous'
import * as React from 'react'
import {
  Switch as NativeSwitch,
  SwitchProps as NativeSwitchProps,
  Platform,
} from 'react-native'

import { SwitchFrame as DefaultSwitchFrame, SwitchThumb } from './Switch'
import { SwitchContext } from './SwitchContext'

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

export type SwitchProps = Omit<SwitchBaseProps & SwitchExtraProps, 'children'> & {
  children?: React.ReactNode | ((checked: boolean) => React.ReactNode)
}

type SwitchComponent = TamaguiComponentExpectingVariants<
  SwitchProps,
  SwitchSharedProps & SwitchExtraProps
>

type SwitchThumbComponent = TamaguiComponentExpectingVariants<
  SwitchBaseProps,
  SwitchSharedProps
>

export function createSwitch<F extends SwitchComponent, T extends SwitchThumbComponent>({
  disableActiveTheme,
  Frame = DefaultSwitchFrame as any,
  Thumb = SwitchThumb as any,
}: {
  disableActiveTheme?: boolean
  Frame?: F
  Thumb?: T
}) {
  if (process.env.NODE_ENV === 'development') {
    // @ts-ignore
    if (Frame !== DefaultSwitchFrame && Frame.staticConfig.context) {
      console.warn(
        `Warning: createSwitch() needs to control context to pass checked state from Frame to Thumb, any custom context passed will be overridden.`
      )
    }
    // @ts-ignore
    if (Thumb !== SwitchThumb && Thumb.staticConfig.context) {
      console.warn(
        `Warning: createSwitch() needs to control context to pass checked state from Frame to Thumb, any custom context passed will be overridden.`
      )
    }
  }

  Frame.staticConfig.context = SwitchContext
  Thumb.staticConfig.context = SwitchContext

  const SwitchThumbComponent = Thumb.styleable(function SwitchThumb(props, forwardedRef) {
    const { size: sizeProp, unstyled: unstyledProp, ...thumbProps } = props
    const context = React.useContext(SwitchContext)
    const {
      disabled,
      checked,
      unstyled: unstyledContext,
      frameWidth,
      size: sizeContext,
    } = context
    const [thumbWidth, setThumbWidth] = React.useState(0)
    const initialChecked = React.useRef(checked).current
    const distance = frameWidth - thumbWidth
    const x = initialChecked ? (checked ? 0 : -distance) : checked ? distance : 0
    const unstyled = unstyledProp ?? unstyledContext ?? false

    return (
      // @ts-ignore
      <Thumb
        {...(unstyled === false && {
          unstyled: process.env.TAMAGUI_HEADLESS === '1' ? true : false,
          size: sizeProp ?? sizeContext ?? '$true',
          ...(!disableActiveTheme && {
            theme: checked ? 'active' : null,
          }),
        })}
        data-state={getState(checked)}
        data-disabled={disabled ? '' : undefined}
        alignSelf={initialChecked ? 'flex-end' : 'flex-start'}
        checked={checked}
        x={x}
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

  const SwitchComponent = Frame.styleable<SwitchExtraProps>(
    function SwitchFrame(propsIn, forwardedRef) {
      const styledContext = React.useContext(SwitchContext)
      const props = useProps(propsIn, {
        noNormalize: true,
        noExpand: true,
        resolveValues: 'none',
        forComponent: Frame,
      })
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
      const composedRefs = useComposedRefs(forwardedRef, setButton)
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

      const isInsideButton = React.useContext(ButtonNestingContext)

      return (
        <>
          <ButtonNestingContext.Provider value={true}>
            {/* @ts-expect-error todo */}
            <Frame
              tag={isInsideButton ? 'span' : 'button'}
              unstyled={unstyled}
              size={size}
              checked={checked}
              disabled={disabled}
              frameWidth={frameWidth}
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
            >
              <YStack
                alignSelf="stretch"
                flex={1}
                onLayout={(e) => {
                  setFrameWidth(e.nativeEvent.layout.width)
                }}
              >
                {typeof children === 'function' ? children(checked) : children}
              </YStack>
            </Frame>
          </ButtonNestingContext.Provider>
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
    },
    {
      disableTheme: true,
    }
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
    Thumb: SwitchThumbComponent,
  })

  return Switch
}
