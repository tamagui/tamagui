import {
  CheckboxBaseProps,
  CheckboxIndicatorBaseProps,
  createCheckbox as createCheckboxHeadless,
} from '@tamagui/checkbox-headless'
import {
  SizeTokens,
  StackProps,
  TamaguiElement,
  getVariableValue,
  useProps,
  useTheme,
} from '@tamagui/core'
import { Scope } from '@tamagui/create-context'
import { getFontSize } from '@tamagui/font-size'
import { getSize } from '@tamagui/get-token'
import { useGetThemedIcon } from '@tamagui/helpers-tamagui'
import React from 'react'

import { CheckboxFrame, CheckboxIndicatorFrame } from './Checkbox'
import { CheckboxStyledContext } from './CheckboxStyledContext'

type ScopedProps<P> = P & { __scopeCheckbox?: Scope }
// TODO: add nested button provider
// TODO: remove all ts-ignore's

export type CheckedState = boolean | 'indeterminate'

export type ExpectingVariantProps = {
  size?: SizeTokens
  unstyled?: boolean
}

export type CheckboxProps = CheckboxBaseProps & {
  scaleIcon?: number
  scaleSize?: number
  sizeAdjust?: number
} & StackProps

export type CheckboxIndicatorProps = CheckboxIndicatorBaseProps & {
  /**
   * Used to disable passing styles down to children.
   */
  disablePassStyles?: boolean
} & StackProps

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
  >(function Checkbox(props, forwardedRef) {
    const { scaleSize = 0.45, sizeAdjust = 0, scaleIcon, ...checkboxProps } = props
    const propsActive = useProps(checkboxProps)

    // TODO: this could be null - fix the type
    const styledContext = React.useContext(CheckboxStyledContext)
    const adjustedSize = getVariableValue(
      // @ts-ignore
      getSize(propsActive.size ?? styledContext?.size ?? '$true', {
        shift: sizeAdjust,
      })
    ) as number
    const size = scaleSize ? Math.round(adjustedSize * scaleSize) : adjustedSize

    return (
      <Frame width={size} height={size} tag="button" {...propsActive} ref={forwardedRef}>
        <CheckboxStyledContext.Provider
          size={propsActive.size ?? styledContext?.size ?? '$true'}
          scaleIcon={scaleIcon ?? styledContext?.scaleIcon ?? 1}
        >
          {propsActive.children}
        </CheckboxStyledContext.Provider>
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

      return (
        // @ts-ignore
        <Indicator pointerEvents="none" {...indicatorProps} ref={forwardedRef}>
          {children}
        </Indicator>
      )
    }
  )

  const Checkbox = createCheckboxHeadless({
    Frame: FrameComponent as any,
    Indicator: IndicatorComponent as any,
  })
  Checkbox['Props'] = CheckboxStyledContext.Provider
  return Checkbox as typeof Checkbox & {
    Props: (typeof CheckboxStyledContext)['Provider']
  }
}
