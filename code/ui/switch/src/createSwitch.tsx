import type { NativeValue, SizeTokens, StackProps } from '@tamagui/core'
import {
  composeEventHandlers,
  getShorthandValue,
  getVariableValue,
  isWeb,
  shouldRenderNativePlatform,
  withStaticProperties,
} from '@tamagui/core'
import { registerFocusable } from '@tamagui/focusable'
import type {
  SwitchExtraProps as HeadlessSwitchExtraProps,
  SwitchState,
} from '@tamagui/switch-headless'
import { useSwitch } from '@tamagui/switch-headless'
import { useControllableState } from '@tamagui/use-controllable-state'
import * as React from 'react'
import type {
  LayoutChangeEvent,
  SwitchProps as NativeSwitchProps,
  ViewStyle,
} from 'react-native'
import { Switch as NativeSwitch, View } from 'react-native'
import { SwitchStyledContext } from './StyledContext'
import { SwitchFrame as DefaultSwitchFrame, SwitchThumb } from './Switch'

type SwitchSharedProps = {
  size?: SizeTokens | number
  unstyled?: boolean
}

type SwitchBaseProps = StackProps & SwitchSharedProps

export type SwitchExtraProps = HeadlessSwitchExtraProps & {
  native?: NativeValue<'mobile' | 'ios' | 'android'>
  nativeProps?: NativeSwitchProps
}

export type SwitchProps = SwitchBaseProps & SwitchExtraProps

type SwitchThumbBaseProps = StackProps

export type SwitchThumbProps = SwitchThumbBaseProps & SwitchSharedProps

export const SwitchContext = React.createContext<{
  checked: SwitchState
  frameWidth: number
  disabled?: boolean
}>({
  checked: false,
  disabled: false,
  frameWidth: 0,
})

type SwitchComponent = (props: SwitchSharedProps & SwitchExtraProps) => any
type SwitchThumbComponent = (props: any) => any

export function createSwitch<
  F extends SwitchComponent,
  T extends SwitchThumbComponent,
>(createProps: { disableActiveTheme?: boolean; Frame?: F; Thumb?: T }) {
  const {
    disableActiveTheme,
    Frame = DefaultSwitchFrame,
    Thumb = SwitchThumb,
  } = createProps as any as {
    disableActiveTheme?: boolean
    Frame: typeof DefaultSwitchFrame
    Thumb: typeof SwitchThumb
  }

  if (process.env.NODE_ENV === 'development') {
    if (
      (Frame !== DefaultSwitchFrame &&
        Frame.staticConfig.context &&
        Frame.staticConfig.context !== SwitchStyledContext) ||
      (Thumb !== SwitchThumb &&
        Thumb.staticConfig.context &&
        Thumb.staticConfig.context !== SwitchStyledContext)
    ) {
      console.warn(
        `Warning: createSwitch() needs to control context to pass checked state from Frame to Thumb, any custom context passed will be overridden.`
      )
    }
  }

  Frame.staticConfig.context = SwitchStyledContext
  Thumb.staticConfig.context = SwitchStyledContext

  const SwitchThumbComponent = Thumb.styleable<SwitchThumbProps>(
    function SwitchThumb(props, forwardedRef) {
      const { size: sizeProp, unstyled: unstyledProp, ...thumbProps } = props
      const context = React.useContext(SwitchContext)
      const { checked, disabled, frameWidth } = context
      const styledContext = SwitchStyledContext.useStyledContext()
      const { unstyled: unstyledContext, size: sizeContext } = styledContext
      const unstyled =
        process.env.TAMAGUI_HEADLESS === '1'
          ? true
          : (unstyledProp ?? unstyledContext ?? false)
      const size = sizeProp ?? sizeContext ?? '$true'

      const initialChecked = React.useRef(checked).current

      const initialWidth = getVariableValue(props.width, 'size')
      const [thumbWidth, setThumbWidth] = React.useState(
        typeof initialWidth === 'number' ? initialWidth : 0
      )
      const distance = frameWidth - thumbWidth
      const x = initialChecked ? (checked ? 0 : -distance) : checked ? distance : 0

      return (
        <Thumb
          ref={forwardedRef}
          unstyled={unstyled}
          {...(unstyled === false && {
            size,
            ...(!disableActiveTheme &&
              !unstyled && {
                theme: checked ? 'active' : null,
              }),
          })}
          alignSelf={initialChecked ? 'flex-end' : 'flex-start'}
          x={x}
          onLayout={composeEventHandlers(props.onLayout, (e) => {
            const next = e.nativeEvent.layout.width
            if (next !== thumbWidth) {
              setThumbWidth(next)
            }
          })}
          // expected variants
          checked={checked}
          disabled={disabled}
          {...thumbProps}
        />
      )
    }
  )

  const SwitchComponent = Frame.styleable<SwitchProps>(
    function SwitchFrame(_props, forwardedRef) {
      const {
        native,
        nativeProps,
        checked: checkedProp,
        defaultChecked,
        onCheckedChange,
        ...props
      } = _props
      const [checked, setChecked] = useControllableState({
        prop: checkedProp,
        defaultProp: defaultChecked || false,
        onChange: onCheckedChange,
        transition: true,
      })

      const styledContext = React.useContext(SwitchStyledContext.context)

      let estimatedInitialWidth = 0

      const estWidth = getVariableValue(getShorthandValue(props, 'width'), 'size')

      if (estWidth) {
        const estPad =
          getShorthandValue(props, 'paddingHorizontal') ??
          getShorthandValue(props, 'padding') ??
          0
        const estLeftPad = getShorthandValue(props, 'paddingLeft') ?? estPad ?? 0
        const estRightPad = getShorthandValue(props, 'paddingRight') ?? estPad ?? 0
        estimatedInitialWidth =
          estWidth -
          (estLeftPad ? getVariableValue(estLeftPad, 'size') : 0) -
          (estRightPad ? getVariableValue(estRightPad, 'size') : 0)
      }

      // this is actually inner width
      const [frameWidth, setFrameInnerWidth] = React.useState(estimatedInitialWidth)

      const { switchProps, bubbleInput, switchRef } = useSwitch(
        // @ts-ignore
        props as any,
        [checked, setChecked],
        forwardedRef
      )

      if (process.env.TAMAGUI_TARGET === 'native') {
        React.useEffect(() => {
          if (!props.id) return
          if (props.disabled) return

          return registerFocusable(props.id, {
            focusAndSelect: () => {
              setChecked?.((value) => !value)
            },
            focus: () => {},
          })
        }, [props.id, props.disabled])
      }

      const renderNative = shouldRenderNativePlatform(native)
      if (renderNative === 'android' || renderNative === 'ios') {
        return (
          <NativeSwitch value={checked} onValueChange={setChecked} {...nativeProps} />
        )
      }

      const disabled = props.disabled
      const value = React.useMemo(
        () => ({ checked, disabled, frameWidth }),
        [checked, disabled, frameWidth]
      )

      const handleLayout = (e: LayoutChangeEvent) => {
        const next = e.nativeEvent.layout.width
        if (next !== frameWidth) {
          setFrameInnerWidth(next)
        }
      }

      const unstyled = styledContext.unstyled ?? props.unstyled ?? false

      return (
        <SwitchContext.Provider value={value}>
          <Frame
            ref={switchRef}
            tag="button"
            {...(isWeb && { type: 'button' })}
            {...(!unstyled && {
              size: styledContext.size ?? props.size ?? '$true',
            })}
            unstyled={unstyled}
            {...props}
            {...(switchProps as any)}
            {...(!disableActiveTheme &&
              !props.unstyled && {
                theme: checked ? 'active' : null,
              })}
            // expected variants
            checked={checked}
            disabled={disabled}
          >
            <View style={measureContainerStyle} onLayout={handleLayout}>
              {!frameWidth ? null : props.children}
            </View>
          </Frame>

          {bubbleInput}
        </SwitchContext.Provider>
      )
    },
    {
      disableTheme: true,
    }
  )

  return withStaticProperties(SwitchComponent, {
    Thumb: SwitchThumbComponent,
  })
}

const measureContainerStyle = {
  alignSelf: 'stretch',
  flex: 1,
} satisfies ViewStyle
