import {
  NativeValue,
  SizeTokens,
  StackProps,
  TamaguiComponent,
  TamaguiComponentExpectingVariants,
  composeEventHandlers,
  useProps,
} from '@tamagui/core'
import {
  SwitchContext,
  createSwitch as createHeadlessSwitch,
} from '@tamagui/switch-headless'
import * as React from 'react'
import { SwitchProps as NativeSwitchProps, ViewProps } from 'react-native'

import { SwitchStyledContext } from './StyledContext'
import { SwitchFrame as DefaultSwitchFrame, SwitchThumb } from './Switch'

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

export type SwitchProps = StackProps &
  Omit<SwitchBaseProps & SwitchExtraProps, 'children'> & {
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
    if (Frame !== DefaultSwitchFrame && Frame.staticConfig.context) {
      console.warn(
        `Warning: createSwitch() needs to control context to pass checked state from Frame to Thumb, any custom context passed will be overridden.`
      )
    }
    if (Thumb !== SwitchThumb && Thumb.staticConfig.context) {
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
    const { size: sizeProp, unstyled: unstyledProp, ...thumbProps } = props
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

  const SwitchComponent = Frame.styleable(function SwitchFrame(propsIn, forwardedRef) {
    const styledContext = React.useContext(SwitchStyledContext)
    const props = useProps(propsIn, {
      noNormalize: true,
      noExpand: true,
      resolveValues: 'none',
      forComponent: Frame,
    })
    const [frameWidth, setFrameWidth] = React.useState(0)

    props.size = styledContext.size ?? propsIn.size ?? '$true'
    props.unstyled = styledContext.unstyled ?? propsIn.unstyled ?? false

    return (
      // @ts-ignore
      <Frame
        ref={forwardedRef}
        tag="button"
        {...props}
        frameWidth={frameWidth}
        onLayout={
          composeEventHandlers((props as ViewProps).onLayout, (e) => {
            setFrameWidth(e.nativeEvent.layout.width)
          }) as ViewProps['onLayout']
        }
      />
    )
  })

  return createHeadlessSwitch({
    disableActiveTheme,
    Frame: SwitchComponent as any, // TODO: remove any
    Thumb: SwitchThumbComponent as any, // TODO: remove any
  }) as unknown as SwitchComponent & {
    Thumb: SwitchThumbComponent
  }
}
