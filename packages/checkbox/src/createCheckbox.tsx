import {
  CheckboxBaseProps,
  CheckedState,
  isIndeterminate,
  useCheckbox,
} from '@tamagui/checkbox-headless'
import {
  NativeValue,
  SizeTokens,
  StackProps,
  TamaguiElement,
  getVariableValue,
  shouldRenderNativePlatform,
  useProps,
  useTheme,
  withStaticProperties,
} from '@tamagui/core'
import { Scope } from '@tamagui/create-context'
import { getFontSize } from '@tamagui/font-size'
import { getSize } from '@tamagui/get-token'
import { useGetThemedIcon } from '@tamagui/helpers-tamagui'
import { useControllableState } from '@tamagui/use-controllable-state'
import React, { useContext } from 'react'

import { CheckboxFrame, CheckboxIndicatorFrame } from './Checkbox'
import { CheckboxStyledContext } from './CheckboxStyledContext'

type ScopedProps<P> = P & { __scopeCheckbox?: Scope }
// TODO: add nested button provider
// TODO: remove all ts-ignore's

export type ExpectingVariantProps = {
  size?: SizeTokens
  unstyled?: boolean
}

export type CheckboxProps = CheckboxBaseProps & {
  scaleIcon?: number
  scaleSize?: number
  sizeAdjust?: number
  native?: NativeValue<'web'>
} & StackProps

export type CheckboxIndicatorProps = {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: boolean
  /**
   * Used to disable passing styles down to children.
   */
  disablePassStyles?: boolean
} & StackProps

export const CheckboxContext = React.createContext<{
  checked: CheckedState
  disabled?: boolean
}>({
  checked: false,
  disabled: false,
})

export function createCheckbox<
  F extends typeof CheckboxFrame,
  T extends typeof CheckboxIndicatorFrame
>({
  Frame: _Frame = CheckboxFrame as any,
  Indicator: _Indicator = CheckboxIndicatorFrame as any,
}: {
  Frame?: F
  Indicator?: T
}) {
  const Frame = _Frame as typeof CheckboxFrame
  const Indicator = _Indicator as typeof CheckboxIndicatorFrame
  const FrameComponent = React.forwardRef<
    TamaguiElement,
    ScopedProps<CheckboxProps & ExpectingVariantProps>
  >(function Checkbox(_props, forwardedRef) {
    const {
      scaleSize = 0.45,
      sizeAdjust = 0,
      scaleIcon,
      checked: checkedProp,
      defaultChecked,
      onCheckedChange,
      native,
      ...props
    } = _props
    const propsActive = useProps(props)

    // TODO: this could be null - fix the type
    const styledContext = React.useContext(CheckboxStyledContext)
    const adjustedSize = getVariableValue(
      getSize(propsActive.size ?? styledContext?.size ?? '$true', {
        shift: sizeAdjust,
      })
    ) as number
    const size = scaleSize ? Math.round(adjustedSize * scaleSize) : adjustedSize

    const [checked = false, setChecked] = useControllableState({
      prop: checkedProp,
      defaultProp: defaultChecked!,
      onChange: onCheckedChange,
    })

    const { checkboxProps, bubbleInput } = useCheckbox(
      // @ts-ignore
      propsActive,
      [checked, setChecked],
      forwardedRef
    )

    const renderNative = shouldRenderNativePlatform(native)
    if ((native && renderNative === 'android') || renderNative === 'web') {
      return (
        <input
          type="checkbox"
          defaultChecked={isIndeterminate(checked) ? false : checked}
          tabIndex={-1}
          ref={checkboxProps.ref}
          disabled={checkboxProps.disabled}
          style={{
            appearance: 'auto',
            accentColor: 'var(--color6)',
            ...(checkboxProps.style as any), // TODO: any
          }}
        />
      )
    }

    return (
      <Frame width={size} height={size} tag="button" {...checkboxProps}>
        <CheckboxContext.Provider
          value={{
            checked,
            disabled: checkboxProps.disabled,
          }}
        >
          <CheckboxStyledContext.Provider
            size={propsActive.size ?? styledContext?.size ?? '$true'}
            scaleIcon={scaleIcon ?? styledContext?.scaleIcon ?? 1}
          >
            {propsActive.children}
            {bubbleInput}
          </CheckboxStyledContext.Provider>
        </CheckboxContext.Provider>
      </Frame>
    )
  })

  const IndicatorComponent = React.forwardRef<TamaguiElement, CheckboxIndicatorProps>(
    (props: ScopedProps<CheckboxIndicatorProps>, forwardedRef) => {
      const {
        __scopeCheckbox,
        children: childrenProp,
        forceMount,
        disablePassStyles,
        ...indicatorProps
      } = props
      const styledContext = React.useContext(CheckboxStyledContext)
      const iconSize =
        (typeof styledContext.size === 'number'
          ? styledContext.size * 0.65
          : getFontSize(styledContext.size as any)) * styledContext.scaleIcon
      const theme = useTheme()
      const getThemedIcon = useGetThemedIcon({ size: iconSize, color: theme.color })

      const childrens = React.Children.toArray(childrenProp)
      const children = childrens.map((child) => {
        if (disablePassStyles || !React.isValidElement(child)) {
          return child
        }
        return getThemedIcon(child)
      })

      const context = useContext(CheckboxContext)
      if (forceMount || isIndeterminate(context.checked) || context.checked === true)
        return (
          <Indicator pointerEvents="none" {...indicatorProps} ref={forwardedRef}>
            {children}
          </Indicator>
        )

      return null
    }
  )

  return withStaticProperties(FrameComponent, {
    Indicator: IndicatorComponent,
  })
}
