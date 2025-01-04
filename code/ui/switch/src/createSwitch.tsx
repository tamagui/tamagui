import type { NativeValue, SizeTokens, StackProps } from '@tamagui/core'
import {
  Stack,
  composeEventHandlers,
  isWeb,
  shouldRenderNativePlatform,
  useProps,
  withStaticProperties,
} from '@tamagui/core'
import type {
  SwitchExtraProps as HeadlessSwitchExtraProps,
  SwitchState,
} from '@tamagui/switch-headless'
import { registerFocusable } from '@tamagui/focusable'
import { useSwitch } from '@tamagui/switch-headless'
import { useControllableState } from '@tamagui/use-controllable-state'
import * as React from 'react'
import type { SwitchProps as NativeSwitchProps, ViewProps } from 'react-native'
import { Switch as NativeSwitch } from 'react-native'

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
      const { size: sizeProp, unstyled: unstyledProp, nativeID, ...thumbProps } = props
      const context = React.useContext(SwitchContext)
      const { checked, disabled, frameWidth } = context
      // __scope?
      const styledContext = SwitchStyledContext.useStyledContext()
      const { unstyled: unstyledContext, size: sizeContext } = styledContext
      const unstyled =
        process.env.TAMAGUI_HEADLESS === '1'
          ? true
          : (unstyledProp ?? unstyledContext ?? false)
      const size = sizeProp ?? sizeContext ?? '$true'

      const initialChecked = React.useRef(checked).current

      const [thumbWidth, setThumbWidth] = React.useState(0)
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

      const [frameWidth, setFrameWidth] = React.useState(0)

      const propsActive = useProps(props, {
        noNormalize: true,
        noExpand: true,
        resolveValues: 'none',
        forComponent: Frame,
      })

      const { switchProps, bubbleInput, switchRef } = useSwitch(
        // @ts-ignore
        Object.assign(
          {
            size: styledContext.size ?? props.size ?? '$true',
            unstyled: styledContext.unstyled ?? props.unstyled ?? false,
          },
          propsActive
        ),
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

      return (
        <SwitchContext.Provider
          value={{ checked, disabled: switchProps.disabled, frameWidth }}
        >
          <Frame
            ref={switchRef}
            tag="button"
            {...(isWeb && { type: 'button' })}
            {...(switchProps as any)}
            {...(!disableActiveTheme &&
              !props.unstyled && {
                theme: checked ? 'active' : null,
                themeShallow: true,
              })}
            // expected variants
            checked={checked}
            disabled={switchProps.disabled}
          >
            <Stack
              alignSelf="stretch"
              flex={1}
              onLayout={(e) => {
                setFrameWidth(e.nativeEvent.layout.width)
              }}
            >
              {switchProps.children}
            </Stack>
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
