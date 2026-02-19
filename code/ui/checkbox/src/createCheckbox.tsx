import type {
  CheckedState,
  CheckboxExtraProps as HeadlessCheckboxExtraProps,
} from '@tamagui/checkbox-headless'
import { isIndeterminate, useCheckbox } from '@tamagui/checkbox-headless'
import type { GetProps, NativeValue, SizeTokens, ViewProps } from '@tamagui/core'
import {
  getVariableValue,
  isWeb,
  shouldRenderNativePlatform,
  useProps,
  useTheme,
  withStaticProperties,
} from '@tamagui/core'
import { registerFocusable } from '@tamagui/focusable'
import { useIconSize } from '@tamagui/font-size'
import { getSize } from '@tamagui/get-token'
import { useGetThemedIcon } from '@tamagui/helpers-tamagui'
import { useControllableState } from '@tamagui/use-controllable-state'
import React, { useMemo } from 'react'

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
type CheckboxBaseProps = ViewProps

type DefaultCheckboxFrame = typeof CheckboxFrame
type DefaultIndicatorFrame = typeof CheckboxIndicatorFrame

type CheckboxFrameActiveStyleProps = {
  activeStyle?: GetProps<DefaultCheckboxFrame>
  activeTheme?: string | null
}

type CheckboxIndicatorActiveStyleProps = {
  activeStyle?: GetProps<DefaultIndicatorFrame>
}

export type CheckboxProps = CheckboxBaseProps &
  CheckboxExtraProps &
  CheckboxExpectingVariantProps &
  CheckboxFrameActiveStyleProps

// loose types for createCheckbox generics - actual components have stricter types
type CheckboxComponent = (props: any) => React.ReactNode
type CheckboxIndicatorComponent = (props: any) => React.ReactNode

type CheckboxIndicatorBaseProps = ViewProps
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
  CheckboxIndicatorExtraProps &
  CheckboxIndicatorActiveStyleProps

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
>(createProps: { Frame?: F; Indicator?: T }) {
  const { Frame = CheckboxFrame, Indicator = CheckboxIndicatorFrame } =
    createProps as any as {
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
        activeStyle,
        activeTheme,
        ...props
      } = _props
      const propsActive = useProps(props)

      const styledContext = React.useContext(CheckboxStyledContext.context)
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
              ...(checkboxProps.style as any),
            }}
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
            size={propsActive.size ?? styledContext?.size ?? '$true'}
            scaleIcon={scaleIcon ?? styledContext?.scaleIcon ?? 1}
            unstyled={unstyled}
            active={isActive}
            disabled={disabled}
          >
            <Frame
              render="button"
              ref={checkboxRef}
              unstyled={unstyled}
              theme={activeTheme ?? null}
              {...(isWeb && { type: 'button' })}
              {...(!unstyled && {
                width: size,
                height: size,
                size,
              })}
              checked={checked}
              disabled={disabled}
              {...(checkboxProps as CheckboxProps)}
              {...props}
              {...(isActive && {
                ...(!unstyled &&
                  !activeStyle && {
                    backgroundColor: '$backgroundActive',
                  }),
                ...activeStyle,
              })}
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
        children: childrenProp,
        forceMount,
        disablePassStyles,
        unstyled = false,
        activeStyle,
        ...indicatorProps
      } = props
      const styledContext = CheckboxStyledContext.useStyledContext()
      const { active } = styledContext
      let children = childrenProp

      if (!unstyled) {
        const iconSize = useIconSize({
          sizeToken: styledContext.size,
          scaleIcon: styledContext.scaleIcon ?? 0.65,
        })
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
          <Indicator
            pointerEvents="none"
            {...indicatorProps}
            {...(active && activeStyle)}
            ref={forwardedRef}
          >
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
