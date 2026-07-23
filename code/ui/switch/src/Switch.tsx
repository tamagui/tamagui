import {
  composeEventHandlers,
  createStyledHOC,
  getVariableValue,
  isWeb,
  styled,
  useStyle,
  View,
  withStaticProperties,
} from '@tamagui/core'
import { useSwitch } from '@tamagui/switch-headless'
import { useControllableState } from '@tamagui/use-controllable-state'
import * as React from 'react'
import type { LayoutChangeEvent } from 'react-native'
import { SwitchStyledContext } from './StyledContext'
import type { SwitchProps, SwitchThumbProps } from './types'
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

export const SwitchThumb = createStyledHOC(SwitchThumbFrame)<SwitchThumbProps>(
  function SwitchThumb(props, forwardedRef) {
    const { size: sizeProp, activeStyle, ...thumbProps } = props
    const resolvedActiveStyle = useStyle(activeStyle ?? {}, { resolveValues: 'value' })
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

    return (
      <SwitchThumbFrame
        ref={forwardedRef}
        size={size}
        alignSelf={initialChecked ? 'flex-end' : 'flex-start'}
        x={x}
        onLayout={composeEventHandlers(props.onLayout, (event) => {
          setThumbWidth(event.nativeEvent.layout.width)
        })}
        disabled={disabled}
        {...thumbProps}
        {...(active && resolvedActiveStyle)}
      />
    )
  }
)

const SwitchComponent = createStyledHOC(SwitchFrame)<SwitchProps>(
  function Switch(_props, forwardedRef) {
    const {
      native,
      nativeProps,
      checked: checkedProp,
      defaultChecked,
      onCheckedChange,
      activeStyle,
      activeTheme,
      ...props
    } = _props
    const resolvedActiveStyle = useStyle(activeStyle ?? {}, { resolveValues: 'value' })
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

    return (
      <>
        <SwitchStyledContext.Provider
          size={size}
          active={checked}
          disabled={disabled}
          frameWidth={frameWidth}
        >
          <SwitchFrame
            ref={switchRef}
            render="button"
            theme={checked ? (activeTheme ?? null) : null}
            {...(isWeb && { type: 'button' })}
            size={size}
            {...props}
            {...(switchProps as any)}
            disabled={disabled}
            {...(checked && resolvedActiveStyle)}
          >
            <View alignSelf="stretch" flex={1} onLayout={handleLayout}>
              {props.children}
            </View>
          </SwitchFrame>
        </SwitchStyledContext.Provider>

        {bubbleInput}
      </>
    )
  },
  {
    disableTheme: true,
  }
)

export const Switch = withStaticProperties(SwitchComponent, {
  Frame: SwitchFrame,
  Thumb: SwitchThumb,
})
