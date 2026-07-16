// fork of radix
// https://github.com/radix-ui/primitives/tree/main/packages/react/checkbox/src/Checkbox.tsx

import type {
  CheckedState,
  CheckboxExtraProps as HeadlessCheckboxExtraProps,
} from '@tamagui/checkbox-headless'
import { isIndeterminate, useCheckbox } from '@tamagui/checkbox-headless'
import type { GetProps, NativeValue, SizeTokens } from '@tamagui/core'
import {
  createStyledHOC,
  isWeb,
  shouldRenderNativePlatform,
  styled,
  useProps,
  View,
  withStaticProperties,
} from '@tamagui/core'
import { registerFocusable } from '@tamagui/focusable'
import { useControllableState } from '@tamagui/use-controllable-state'
import React, { useMemo } from 'react'

import { CheckboxStyledContext } from './CheckboxStyledContext'

const INDICATOR_NAME = 'CheckboxIndicator'

export const CheckboxIndicatorFrame = styled(
  View,
  {
    // use Checkbox for easier themes
    name: INDICATOR_NAME,
    context: CheckboxStyledContext,
  },
  {
    accept: {
      activeStyle: 'style',
    } as const,
  }
)

const CHECKBOX_NAME = 'Checkbox'

export const CheckboxFrame = styled(
  View,
  {
    name: CHECKBOX_NAME,
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
  },
  {
    accept: {
      activeStyle: 'style',
    } as const,
  }
)

type CheckboxExpectingVariantProps = {
  size?: SizeTokens | true
}

type CheckboxExtraProps = HeadlessCheckboxExtraProps & {
  native?: NativeValue<'web'>
}

type CheckboxFrameActiveStyleProps = {
  activeStyle?: GetProps<typeof CheckboxFrame>
  activeTheme?: string | null
}

type CheckboxIndicatorActiveStyleProps = {
  activeStyle?: GetProps<typeof CheckboxIndicatorFrame>
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

const CheckboxComponent = createStyledHOC(CheckboxFrame)<CheckboxProps>(
  function Checkbox(_props, forwardedRef) {
    const {
      checked: checkedProp,
      defaultChecked,
      onCheckedChange,
      native,
      activeStyle,
      activeTheme,
      ...props
    } = _props
    const propsActive = useProps(props)

    const styledContext = React.useContext(CheckboxStyledContext.context)
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
        <CheckboxStyledContext.Provider
          size={propsActive.size ?? styledContext?.size ?? true}
          active={isActive}
          disabled={disabled}
        >
          <CheckboxFrame
            render="button"
            ref={checkboxRef}
            theme={activeTheme ?? null}
            {...(isWeb && { type: 'button' })}
            checked={checked}
            disabled={disabled}
            {...(checkboxProps as CheckboxProps)}
            {...props}
            {...(isActive && activeStyle ? (activeStyle as object) : undefined)}
          >
            {propsActive.children}
          </CheckboxFrame>
          {bubbleInput}
        </CheckboxStyledContext.Provider>
      </CheckboxContext.Provider>
    )
  }
)

const CheckboxIndicator = createStyledHOC(CheckboxIndicatorFrame)<CheckboxIndicatorProps>(
  (props, forwardedRef) => {
    const { children, forceMount, activeStyle, ...indicatorProps } = props
    const { active } = CheckboxStyledContext.useStyledContext()
    const context = React.useContext(CheckboxContext)

    if (forceMount || isIndeterminate(context.checked) || context.checked === true) {
      return (
        <CheckboxIndicatorFrame
          pointerEvents="none"
          {...indicatorProps}
          {...(active && activeStyle ? (activeStyle as object) : undefined)}
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
