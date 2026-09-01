// fork of radix
// https://github.com/radix-ui/primitives/tree/main/packages/react/checkbox/src/Checkbox.tsx

import type {
  CheckedState,
  CheckboxExtraProps as HeadlessCheckboxExtraProps,
} from '@tamagui/checkbox-headless'
import { isIndeterminate, useCheckbox } from '@tamagui/checkbox-headless'
import type { GetProps, NativeValue, SizeTokens, StylePiece } from '@tamagui/core'
import {
  createStyledHOC,
  isWeb,
  shouldRenderNativePlatform,
  styled,
  View,
  withStaticProperties,
} from '@tamagui/core'
import { registerFocusable } from '@tamagui/focusable'
import { useControllableState } from '@tamagui/use-controllable-state'
import React, { useMemo } from 'react'

import { CheckboxStyledContext } from './CheckboxStyledContext'

const INDICATOR_NAME = 'CheckboxIndicator'

export const CheckboxIndicatorFrame = styled(View, {
  // use Checkbox for easier themes
  displayName: INDICATOR_NAME,
  context: CheckboxStyledContext,
})

const CHECKBOX_NAME = 'Checkbox'

export const CheckboxFrame = styled(View, {
  displayName: CHECKBOX_NAME,
  render: 'button',
  context: CheckboxStyledContext,
  alignItems: 'center',
  justifyContent: 'center',

  variants: {
    disabled: {
      true: {
        pointerEvents: 'none',
        userSelect: 'none',
      },
    },
  } as const,
})

type CheckboxExpectingVariantProps = {
  size?: SizeTokens | true
}

type CheckboxExtraProps = HeadlessCheckboxExtraProps & {
  native?: NativeValue<'web'>
}

type CheckboxFrameActiveStyleProps = {
  activeStyle?: StylePiece
  activeTheme?: string | null
}

type CheckboxIndicatorActiveStyleProps = {
  activeStyle?: StylePiece
}

export type CheckboxProps = GetProps<typeof CheckboxFrame> &
  CheckboxExtraProps &
  CheckboxExpectingVariantProps &
  CheckboxFrameActiveStyleProps

type CheckboxIndicatorExtraProps = {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: boolean
}

export type CheckboxIndicatorProps = GetProps<typeof CheckboxIndicatorFrame> &
  CheckboxIndicatorExtraProps &
  CheckboxIndicatorActiveStyleProps

export const CheckboxContext = React.createContext<{
  checked: CheckedState
  disabled?: boolean
}>({
  checked: false,
  disabled: false,
})

const CheckboxComponent = createStyledHOC(
  CheckboxFrame,
  function Checkbox(propsIn: CheckboxProps, forwardedRef) {
    const {
      checked: checkedProp,
      defaultChecked,
      onCheckedChange,
      native,
      activeStyle,
      activeTheme,
      ...props
    } = propsIn

    const [checked = false, setChecked] = useControllableState({
      prop: checkedProp,
      defaultProp: defaultChecked!,
      onChange: onCheckedChange,
    })

    const { checkboxProps, checkboxRef, bubbleInput } = useCheckbox(
      props,
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
          style={checkboxProps.style as any}
        />
      )
    }

    const memoizedContext = useMemo(
      () => ({
        checked,
        disabled: checkboxProps.disabled,
      }),
      [checked, checkboxProps.disabled]
    )

    const isActive = !!checked
    const disabled = checkboxProps.disabled

    return (
      <CheckboxContext.Provider value={memoizedContext}>
        <CheckboxFrame
          render="button"
          ref={checkboxRef}
          theme={activeTheme ?? null}
          {...(isWeb && { type: 'button' })}
          checked={checked}
          {...(checkboxProps as CheckboxProps)}
          style={[checkboxProps.style, isActive && activeStyle]}
          active={isActive}
          disabled={disabled}
        >
          {props.children}
        </CheckboxFrame>
        {bubbleInput}
      </CheckboxContext.Provider>
    )
  }
)

const CheckboxIndicator = createStyledHOC(
  CheckboxIndicatorFrame,
  (props: CheckboxIndicatorProps, forwardedRef) => {
    const { children, forceMount, activeStyle, ...indicatorProps } = props
    const { active } = CheckboxStyledContext.useStyledContext()
    const context = React.useContext(CheckboxContext)

    if (forceMount || isIndeterminate(context.checked) || context.checked === true) {
      return (
        <CheckboxIndicatorFrame
          pointerEvents="none"
          {...indicatorProps}
          style={[indicatorProps.style, active && activeStyle]}
          ref={forwardedRef}
        >
          {children}
        </CheckboxIndicatorFrame>
      )
    }

    return null
  }
)

export const Checkbox = withStaticProperties(CheckboxComponent, {
  Indicator: CheckboxIndicator,
})
