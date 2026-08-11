import type { GetProps } from '@tamagui/core'
import {
  composeEventHandlers,
  createStyledHOC,
  getVariableValue,
  isWeb,
  styled,
  Theme,
  type ThemeProps,
  View,
  withStaticProperties,
} from '@tamagui/core'
import { useSwitch } from '@tamagui/switch-headless'
import { useControllableState } from '@tamagui/use-controllable-state'
import * as React from 'react'
import type { LayoutChangeEvent } from 'react-native'
import { SwitchStyledContext } from './StyledContext'
import type {
  SwitchComponent as SwitchFrameComponent,
  SwitchProps,
  SwitchThumbComponent as SwitchThumbFrameComponent,
  SwitchThumbProps,
} from './types'
import { useSwitchNative } from './useSwitchNative'

export const SwitchThumbFrame = styled(View, {
  name: 'SwitchThumb',
  context: SwitchStyledContext,
})

export const SwitchFrame = styled(View, {
  name: 'Switch',
  context: SwitchStyledContext,
  render: 'button',
  tabIndex: 0,
})

export function createSwitch(createProps: {
  Frame?: SwitchFrameComponent
  Thumb?: SwitchThumbFrameComponent
  componentThemes?: {
    frame?: ThemeProps['name']
    thumb?: ThemeProps['name']
  }
}) {
  const Frame = (createProps.Frame ?? SwitchFrame) as typeof SwitchFrame
  const Thumb = (createProps.Thumb ?? SwitchThumbFrame) as typeof SwitchThumbFrame

  Frame.staticConfig.context = SwitchStyledContext
  Thumb.staticConfig.context = SwitchStyledContext

  const SwitchThumbComponent = createStyledHOC(
    Thumb,
    function SwitchThumb(
      props: Omit<GetProps<typeof Thumb>, keyof SwitchThumbProps> & SwitchThumbProps,
      forwardedRef
    ) {
      const { size: sizeProp, activeStyle, theme, ...thumbProps } = props
      const styledContext = SwitchStyledContext.useStyledContext()
      const { size: sizeContext, active, disabled, frameWidth = 0 } = styledContext
      const size = sizeProp ?? sizeContext ?? true
      const initialChecked = React.useRef(active).current
      const initialWidth = getVariableValue(props.width, 'size')
      const [thumbWidth, setThumbWidth] = React.useState(
        typeof initialWidth === 'number' ? initialWidth : 0
      )
      const distance = frameWidth - thumbWidth
      const x = initialChecked ? (active ? 0 : -distance) : active ? distance : 0

      const thumb = (
        <Thumb
          ref={forwardedRef}
          size={size}
          alignSelf={initialChecked ? 'flex-end' : 'flex-start'}
          x={x}
          onLayout={composeEventHandlers(props.onLayout, (event) => {
            setThumbWidth(event.nativeEvent.layout.width)
          })}
          disabled={disabled}
          {...thumbProps}
          {...(active && activeStyle)}
        />
      )

      const themeName = theme ?? createProps.componentThemes?.thumb
      return themeName ? <Theme name={themeName}>{thumb}</Theme> : thumb
    }
  )

  const SwitchComponent = createStyledHOC(
    Frame,
    function Switch(_props: SwitchProps, forwardedRef) {
      const {
        native,
        nativeProps,
        checked: checkedProp,
        defaultChecked,
        onCheckedChange,
        activeStyle,
        activeTheme,
        theme,
        ...props
      } = _props
      const [checked, setChecked] = useControllableState({
        prop: checkedProp,
        defaultProp: defaultChecked || false,
        onChange: onCheckedChange,
        transition: true,
      })
      const styledContext = React.useContext(SwitchStyledContext.context)
      const [frameWidth, setFrameInnerWidth] = React.useState(0)
      const { switchProps, bubbleInput, switchRef } = useSwitch(
        props as any,
        [checked, setChecked],
        // @ts-ignore TODO tamagui react 19 type error
        forwardedRef
      )
      const nativeSwitch = useSwitchNative({
        id: props.id,
        disabled: props.disabled,
        native,
        nativeProps,
        checked,
        setChecked,
      })

      if (nativeSwitch) {
        return nativeSwitch
      }

      const disabled = props.disabled
      const size = styledContext.size ?? props.size ?? true

      const handleLayout = (event: LayoutChangeEvent) => {
        const next = event.nativeEvent.layout.width
        if (next !== frameWidth) {
          setFrameInnerWidth(next)
        }
      }

      const frame = (
        <Frame
          ref={switchRef}
          render="button"
          {...(isWeb && { type: 'button' })}
          size={size}
          {...props}
          {...(switchProps as any)}
          disabled={disabled}
          {...(checked && activeStyle)}
        >
          <View alignSelf="stretch" flex={1} onLayout={handleLayout}>
            {props.children}
          </View>
        </Frame>
      )

      const frameTheme =
        (checked ? activeTheme : undefined) ?? theme ?? createProps.componentThemes?.frame

      return (
        <>
          <SwitchStyledContext.Provider
            size={size}
            active={checked}
            disabled={disabled}
            frameWidth={frameWidth}
          >
            {frameTheme ? <Theme name={frameTheme}>{frame}</Theme> : frame}
          </SwitchStyledContext.Provider>

          {bubbleInput}
        </>
      )
    },
    {
      disableTheme: true,
    }
  )

  return withStaticProperties(SwitchComponent, {
    Frame,
    Thumb: SwitchThumbComponent,
  })
}

export const Switch = createSwitch({
  Frame: SwitchFrame,
  Thumb: SwitchThumbFrame,
})

export const SwitchThumb = Switch.Thumb
