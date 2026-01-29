import {
  composeEventHandlers,
  getVariableValue,
  isWeb,
  View,
  withStaticProperties,
} from '@tamagui/core'
import { useSwitch } from '@tamagui/switch-headless'
import { useControllableState } from '@tamagui/use-controllable-state'
import * as React from 'react'
import type { LayoutChangeEvent } from 'react-native'
import { SwitchStyledContext } from './StyledContext'
import { SwitchFrame as DefaultSwitchFrame, SwitchThumb } from './Switch'
import type {
  SwitchComponent,
  SwitchExtraProps,
  SwitchProps,
  SwitchThumbComponent,
  SwitchThumbProps,
} from './types'
import { useSwitchNative } from './useSwitchNative'

export type { SwitchExtraProps, SwitchProps, SwitchThumbProps }

export function createSwitch<
  F extends SwitchComponent,
  T extends SwitchThumbComponent,
>(createProps: { Frame?: F; Thumb?: T }) {
  const { Frame = DefaultSwitchFrame, Thumb = SwitchThumb } = createProps as any as {
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
      const { size: sizeProp, unstyled: unstyledProp, activeStyle, ...thumbProps } = props
      const styledContext = SwitchStyledContext.useStyledContext()
      const {
        unstyled: unstyledContext,
        size: sizeContext,
        active,
        disabled,
        frameWidth = 0,
      } = styledContext
      const unstyled =
        process.env.TAMAGUI_HEADLESS === '1'
          ? true
          : (unstyledProp ?? unstyledContext ?? false)
      const size = sizeProp ?? sizeContext ?? '$true'
      const initialChecked = React.useRef(active).current
      const initialWidth = getVariableValue(props.width || size, 'size')
      const [thumbWidth, setThumbWidth] = React.useState(
        typeof initialWidth === 'number' ? initialWidth : 0
      )
      const distance = frameWidth - thumbWidth
      const x = initialChecked ? (active ? 0 : -distance) : active ? distance : 0

      return (
        <Thumb
          ref={forwardedRef}
          unstyled={unstyled}
          {...(unstyled === false && {
            size,
          })}
          alignSelf={initialChecked ? 'flex-end' : 'flex-start'}
          x={x}
          onLayout={composeEventHandlers(props.onLayout, (e) => {
            const next = e.nativeEvent.layout.width
            setThumbWidth(next)
          })}
          disabled={disabled}
          {...thumbProps}
          {...(active && activeStyle)}
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
        activeStyle,
        unstyled: unstyledProp,
        activeTheme: activeThemeProp,
        ...props
      } = _props
      const [checked, setChecked] = useControllableState({
        prop: checkedProp,
        defaultProp: defaultChecked || false,
        onChange: onCheckedChange,
        transition: true,
      })

      const styledContext = React.useContext(SwitchStyledContext.context)

      // this is actually inner width
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

      const handleLayout = (e: LayoutChangeEvent) => {
        const next = e.nativeEvent.layout.width
        if (next !== frameWidth) {
          setFrameInnerWidth(next)
        }
      }

      const unstyled = styledContext.unstyled ?? unstyledProp ?? false

      return (
        <>
          <SwitchStyledContext.Provider
            size={styledContext.size ?? props.size ?? '$true'}
            unstyled={unstyled}
            active={checked}
            disabled={disabled}
            frameWidth={frameWidth}
          >
            <Frame
              ref={switchRef}
              render="button"
              // activeThemeProp should be a theme name string like "active", not a style object
              theme={activeThemeProp ?? null}
              {...(isWeb && { type: 'button' })}
              {...(!unstyled && {
                size: styledContext.size ?? props.size ?? '$true',
              })}
              unstyled={unstyled}
              {...props}
              {...(switchProps as any)}
              disabled={disabled}
              {...(checked && {
                ...(!unstyled &&
                  !activeStyle && {
                    backgroundColor: '$backgroundActive',
                  }),
                ...activeStyle,
              })}
            >
              <View alignSelf="stretch" flex={1} onLayout={handleLayout}>
                {props.children}
              </View>
            </Frame>
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
    Thumb: SwitchThumbComponent,
  })
}
