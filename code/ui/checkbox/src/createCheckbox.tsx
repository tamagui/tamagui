import React from 'react'
import type {
  CheckedState,
  CheckboxExtraProps as HeadlessCheckboxExtraProps,
} from '@tamagui/checkbox-headless'
import { registerFocusable } from '@tamagui/focusable'
import { isIndeterminate, useCheckbox } from '@tamagui/checkbox-headless'
import type { NativeValue, SizeTokens, StackProps } from '@tamagui/core'
import {
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

export type CheckboxProps = CheckboxBaseProps &
  CheckboxExtraProps &
  CheckboxExpectingVariantProps

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
>(createProps: { disableActiveTheme?: boolean; Frame?: F; Indicator?: T }) {
  const {
    disableActiveTheme,
    Frame = CheckboxFrame,
    Indicator = CheckboxIndicatorFrame,
  } = createProps as any as {
    disableActiveTheme?: boolean
    Frame: typeof CheckboxFrame
    Indicator: typeof CheckboxIndicatorFrame
  }

  ensureContext(Frame)
  ensureContext(Indicator)

  const FrameComponent = Frame.styleable<CheckboxProps>(
    function Checkbox(_props, forwardedRef) {
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
            <Frame
              {...(!unstyled && {
                width: size,
                height: size,
              })}
              tag="button"
              ref={checkboxRef}
              unstyled={unstyled}
              {...(unstyled === false && {
                size,
                theme: checked ? 'active' : null,
              })}
              // potential variant
              checked={checked}
              disabled={checkboxProps.disabled}
              {...checkboxProps}
              // react 76 style prop mis-match, but should be fine
              style={checkboxProps.style}
            >
              {propsActive.children}
            </Frame>
            {bubbleInput}
          </CheckboxStyledContext.Provider>
        </CheckboxContext.Provider>
      )
    }
  )

  const IndicatorComponent = Indicator.styleable<CheckboxIndicatorProps>(
    (props, forwardedRef) => {
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

      const context = React.useContext(CheckboxContext)
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
