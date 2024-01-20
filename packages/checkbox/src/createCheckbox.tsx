import {
  CheckedState,
  CheckboxExtraProps as HeadlessCheckboxExtraProps,
  isIndeterminate,
  useCheckbox,
} from '@tamagui/checkbox-headless'
import {
  NativeValue,
  SizeTokens,
  StackProps,
  getVariableValue,
  shouldRenderNativePlatform,
  useProps,
  useTheme,
  withStaticProperties,
} from '@tamagui/core'
import { getFontSize } from '@tamagui/font-size'
import { getSize } from '@tamagui/get-token'
import { useGetThemedIcon } from '@tamagui/helpers-tamagui'
import { useControllableState } from '@tamagui/use-controllable-state'
import React, { useContext } from 'react'

import { CheckboxFrame, CheckboxIndicatorFrame } from './Checkbox'
import { CheckboxStyledContext } from './CheckboxStyledContext'

type CheckboxExpectingVariantProps = {
  size?: SizeTokens
  unstyled?: boolean
}

type CheckboxExtraProps = HeadlessCheckboxExtraProps & {
  scaleIcon?: number
  scaleSize?: number
  sizeAdjust?: number
  native?: NativeValue<'web'>
}
type CheckboxBaseProps = StackProps
export type CheckboxProps = CheckboxBaseProps & CheckboxExtraProps

type CheckboxComponent = (
  props: CheckboxExtraProps & CheckboxExpectingVariantProps
) => any

type CheckboxIndicatorExpectingVariantProps = {}
type CheckboxIndicatorComponent = (props: CheckboxIndicatorExpectingVariantProps) => any

type CheckboxIndicatorBaseProps = StackProps
type CheckboxIndicatorExtraProps = {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: boolean
  /**
   * Used to disable passing styles down to children.
   */
  disablePassStyles?: boolean
}

export type CheckboxIndicatorProps = CheckboxIndicatorBaseProps &
  CheckboxIndicatorExtraProps

export const CheckboxContext = React.createContext<{
  checked: CheckedState
  disabled?: boolean
}>({
  checked: false,
  disabled: false,
})

const ensureContext = (x: any) => {
  if (!x.context) {
    x.context = CheckboxContext
  }
}

export function createCheckbox<
  F extends CheckboxComponent,
  T extends CheckboxIndicatorComponent,
>({
  Frame = CheckboxFrame as any,
  Indicator = CheckboxIndicatorFrame as any,
}: {
  Frame?: F
  Indicator?: T
}) {
  ensureContext(Frame)
  ensureContext(Indicator)

  // @ts-expect-error
  const FrameComponent = Frame.styleable(function Checkbox(_props, forwardedRef) {
    const {
      scaleSize = 0.45,
      sizeAdjust = 0,
      scaleIcon,
      checked: checkedProp,
      defaultChecked,
      onCheckedChange,
      native,
      unstyled = false,
      ...props
    } = _props
    const propsActive = useProps(props)

    // TODO: this could be null - fix the type
    const styledContext = React.useContext(CheckboxStyledContext)
    let adjustedSize = 0
    let size = 0
    if (!unstyled) {
      adjustedSize = getVariableValue(
        getSize(propsActive.size ?? styledContext?.size ?? '$true', {
          shift: sizeAdjust,
        })
      ) as number
      size = scaleSize ? Math.round(adjustedSize * scaleSize) : adjustedSize
    }

    const [checked = false, setChecked] = useControllableState({
      prop: checkedProp,
      defaultProp: defaultChecked!,
      onChange: onCheckedChange,
    })

    const { checkboxProps, checkboxRef, bubbleInput } = useCheckbox(
      // @ts-ignore
      propsActive,
      [checked, setChecked],
      forwardedRef
    )

    const renderNative = shouldRenderNativePlatform(native)
    if (renderNative === 'web') {
      return (
        <input
          type="checkbox"
          defaultChecked={isIndeterminate(checked) ? false : checked}
          tabIndex={-1}
          ref={checkboxRef as any}
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
          {/* @ts-ignore */}
          <Frame
            {...(!unstyled && {
              width: size,
              height: size,
            })}
            tag="button"
            ref={checkboxRef}
            {...(unstyled === false && {
              size,
              theme: checked ? 'active' : null,
            })}
            // expected variants
            checked={checked}
            disabled={checkboxProps.disabled}
            {...checkboxProps}
          >
            {propsActive.children}
          </Frame>
          {bubbleInput}
        </CheckboxStyledContext.Provider>
      </CheckboxContext.Provider>
    )
  })

  // @ts-expect-error
  const IndicatorComponent = Indicator.styleable((props, forwardedRef) => {
    const {
      // __scopeCheckbox,
      children: childrenProp,
      forceMount,
      disablePassStyles,
      unstyled = false,
      ...indicatorProps
    } = props
    const styledContext = React.useContext(CheckboxStyledContext)
    let children = childrenProp

    if (!unstyled) {
      const iconSize =
        (typeof styledContext.size === 'number'
          ? styledContext.size * 0.65
          : getFontSize(styledContext.size as any)) * styledContext.scaleIcon
      const theme = useTheme()
      const getThemedIcon = useGetThemedIcon({ size: iconSize, color: theme.color })

      const childrens = React.Children.toArray(childrenProp)
      children = childrens.map((child) => {
        if (disablePassStyles || !React.isValidElement(child)) {
          return child
        }
        return getThemedIcon(child)
      })
    }

    const context = useContext(CheckboxContext)
    if (forceMount || isIndeterminate(context.checked) || context.checked === true)
      return (
        // @ts-ignore
        <Indicator pointerEvents="none" {...indicatorProps} ref={forwardedRef}>
          {children}
        </Indicator>
      )

    return null
  })

  return withStaticProperties(FrameComponent, {
    Indicator: IndicatorComponent,
  })
}
