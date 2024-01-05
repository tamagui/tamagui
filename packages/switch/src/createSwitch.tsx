import {
  NativeValue,
  SizeTokens,
  StackProps,
  TamaguiComponent,
  TamaguiComponentExpectingVariants,
  composeEventHandlers,
  shouldRenderNativePlatform,
  useProps,
  withStaticProperties,
} from '@tamagui/core'
import {
  SwitchBaseProps as HeadlessSwitchExtraProps,
  SwitchState,
  useSwitch,
} from '@tamagui/switch-headless'
import { useControllableState } from '@tamagui/use-controllable-state'
import * as React from 'react'
import { Switch as NativeSwitch } from 'react-native'
import { SwitchProps as NativeSwitchProps, ViewProps } from 'react-native'

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

type SwitchComponent = TamaguiComponentExpectingVariants<
  SwitchProps,
  SwitchSharedProps & SwitchExtraProps
>

type SwitchThumbComponent = TamaguiComponentExpectingVariants<
  SwitchBaseProps,
  SwitchSharedProps
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

  const SwitchThumbComponent = React.forwardRef<
    TamaguiComponent,
    SwitchBaseProps & ViewProps
  >(function SwitchThumb(props, forwardedRef) {
    const { size: sizeProp, unstyled: unstyledProp, nativeID, ...thumbProps } = props
    const context = React.useContext(SwitchContext)
    const { checked } = context
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
        onLayout={composeEventHandlers(props.onLayout, (e) =>
          setThumbWidth(e.nativeEvent.layout.width)
        )}
        {...thumbProps}
      />
    )
  })

  const SwitchComponent = Frame.styleable<SwitchProps>(function SwitchFrame(
    _props,
    forwardedRef
  ) {
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

    const { switchProps, bubbleInput } = useSwitch(
      // @ts-ignore
      propsActive,
      [checked, setChecked],
      forwardedRef
    )

    const renderNative = shouldRenderNativePlatform(native)
    if ((native && renderNative === 'android') || renderNative === 'ios') {
      return <NativeSwitch value={checked} onValueChange={setChecked} {...nativeProps} />
    }

    return (
      <SwitchContext.Provider value={{ checked, disabled: switchProps.disabled }}>
        <Frame
          tag="button"
          {...(!disableActiveTheme && {
            theme: checked ? 'active' : null,
            themeShallow: true,
          })}
          {...(switchProps as any)}
          frameWidth={frameWidth}
          onLayout={
            composeEventHandlers((switchProps as ViewProps).onLayout, (e) => {
              setFrameWidth(e.nativeEvent.layout.width)
            }) as ViewProps['onLayout']
          }
        >
          {switchProps.children}
          {bubbleInput}
        </Frame>
      </SwitchContext.Provider>
    )
  })

  return withStaticProperties(SwitchComponent, {
    Thumb: SwitchThumbComponent,
  })
}
