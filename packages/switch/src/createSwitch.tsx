import {
  NativeValue,
  SizeTokens,
  StackProps,
  TamaguiComponentExpectingVariants,
  composeEventHandlers,
  isWeb,
  shouldRenderNativePlatform,
  useProps,
  withStaticProperties,
} from '@tamagui/core'
import {
  SwitchExtraProps as HeadlessSwitchExtraProps,
  SwitchState,
  useSwitch,
} from '@tamagui/switch-headless'
import { useControllableState } from '@tamagui/use-controllable-state'
import * as React from 'react'
import {
  Switch as NativeSwitch,
  SwitchProps as NativeSwitchProps,
  ViewProps,
} from 'react-native'

import { SwitchStyledContext } from './StyledContext'
import { SwitchFrame as DefaultSwitchFrame, SwitchThumb } from './Switch'

type ExpectingVariantProps = {
  size?: SizeTokens | number
  unstyled?: boolean
}

type SwitchBaseProps = StackProps & ExpectingVariantProps

export type SwitchExtraProps = HeadlessSwitchExtraProps & {
  native?: NativeValue<'mobile' | 'ios' | 'android'>
  nativeProps?: NativeSwitchProps
}

export type SwitchProps = SwitchBaseProps & SwitchExtraProps

type SwitchComponent = TamaguiComponentExpectingVariants<
  SwitchProps & ExpectingVariantProps,
  ExpectingVariantProps
>

type SwitchThumbBaseProps = StackProps
type SwitchThumbExtraProps = {}
export type SwitchThumbProps = SwitchThumbBaseProps & SwitchThumbExtraProps

type SwitchThumbComponent = TamaguiComponentExpectingVariants<
  SwitchThumbProps & ExpectingVariantProps,
  ExpectingVariantProps
>

export const SwitchContext = React.createContext<{
  checked: SwitchState
  disabled?: boolean
}>({
  checked: false,
  disabled: false,
})

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
    if (
      (Frame !== DefaultSwitchFrame && Frame.staticConfig.context) ||
      (Thumb !== SwitchThumb && Thumb.staticConfig.context)
    ) {
      console.warn(
        `Warning: createSwitch() needs to control context to pass checked state from Frame to Thumb, any custom context passed will be overridden.`
      )
    }
  }

  Frame.staticConfig.context = SwitchStyledContext
  Thumb.staticConfig.context = SwitchStyledContext

  const SwitchThumbComponent = Thumb.styleable(function SwitchThumb(props, forwardedRef) {
    const { size: sizeProp, unstyled: unstyledProp, nativeID, ...thumbProps } = props
    const context = React.useContext(SwitchContext)
    const { checked, disabled } = context
    const styledContext = React.useContext(SwitchStyledContext)
    const { frameWidth, unstyled: unstyledContext, size: sizeContext } = styledContext
    const unstyled =
      process.env.TAMAGUI_HEADLESS === '1'
        ? true
        : unstyledProp ?? unstyledContext ?? false
    const size = sizeProp ?? sizeContext ?? '$true'

    const initialChecked = React.useRef(checked).current

    const [thumbWidth, setThumbWidth] = React.useState(0)
    const distance = frameWidth - thumbWidth
    const x = initialChecked ? (checked ? 0 : -distance) : checked ? distance : 0
    return (
      // @ts-ignore
      <Thumb
        ref={forwardedRef}
        unstyled={unstyled}
        {...(unstyled === false && {
          size,
          ...(!disableActiveTheme && {
            theme: checked ? 'active' : null,
          }),
        })}
        alignSelf={initialChecked ? 'flex-end' : 'flex-start'}
        x={x}
        // TODO: remove ViewProps cast
        onLayout={composeEventHandlers((props as ViewProps).onLayout, (e) =>
          setThumbWidth(e.nativeEvent.layout.width)
        )}
        // expected variants
        checked={checked}
        disabled={disabled}
        {...thumbProps}
      />
    )
  })

  const SwitchComponent = Frame.styleable(
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

      const styledContext = React.useContext(SwitchStyledContext)

      const [frameWidth, setFrameWidth] = React.useState(0)

      const propsActive = useProps(props, {
        noNormalize: true,
        noExpand: true,
        resolveValues: 'none',
        forComponent: Frame,
      })
      propsActive.size = styledContext.size ?? props.size ?? '$true'
      propsActive.unstyled = styledContext.unstyled ?? props.unstyled ?? false

      const { switchProps, bubbleInput, switchRef } = useSwitch(
        // @ts-ignore
        propsActive,
        [checked, setChecked],
        forwardedRef
      )

      const renderNative = shouldRenderNativePlatform(native)
      if (renderNative === 'android' || renderNative === 'ios') {
        return (
          <NativeSwitch value={checked} onValueChange={setChecked} {...nativeProps} />
        )
      }

      return (
        <SwitchContext.Provider value={{ checked, disabled: switchProps.disabled }}>
          <Frame
            ref={switchRef}
            tag="button"
            {...(isWeb && { type: 'button' })}
            frameWidth={frameWidth}
            onLayout={composeEventHandlers((switchProps as ViewProps).onLayout, (e) => {
              setFrameWidth(e.nativeEvent.layout.width)
            })}
            {...(switchProps as any)}
            {...(!disableActiveTheme && {
              theme: checked ? 'active' : null,
              themeShallow: true,
            })}
            // expected variants
            checked={checked}
            disabled={switchProps.disabled}
          >
            {switchProps.children}
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
