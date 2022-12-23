import {
  GetProps,
  TamaguiElement,
  getConfig,
  getExpandedShorthands,
  getTokens,
  getVariableValue,
  isTamaguiElement,
  mergeProps,
  spacedChildren,
  styled,
  useMediaPropsActive,
} from '@tamagui/core'
import { ThemeableStack } from '@tamagui/stacks'
import React, { Children, forwardRef, isValidElement } from 'react'
import { ScrollView } from 'react-native'

export const GroupFrame = styled(ThemeableStack, {
  name: 'GroupFrame',
  backgroundColor: '$background',
  y: 0,
  overflow: 'hidden',

  variants: {
    size: (val, { tokens }) => {
      const borderRadius = tokens.radius[val] ?? val ?? tokens.radius['$4']
      return {
        borderRadius,
      }
    },
  } as const,

  defaultVariants: {
    size: '$4',
  },
})

export type GroupProps = GetProps<typeof GroupFrame> & {
  scrollable?: boolean
  /**
   * @default false
   */
  showScrollIndicator?: boolean
  disabled?: boolean
  vertical?: boolean
  disablePassBorderRadius?: boolean
}

function createGroup(verticalDefault: boolean) {
  return forwardRef<TamaguiElement, GroupProps>((props, ref) => {
    const activeProps = useMediaPropsActive(props)

    const {
      children: childrenProp,
      space,
      size = '$4',
      spaceDirection,
      separator,
      scrollable,
      vertical = verticalDefault,
      disabled: disabledProp,
      disablePassBorderRadius: disablePassBorderRadiusProp,
      borderRadius,
      ...restProps
    } = getExpandedShorthands(activeProps)

    const radius =
      borderRadius ??
      (size ? getVariableValue(getTokens(true).radius[size]) - 1 : undefined)
    const hasRadius = radius !== undefined
    const disablePassBorderRadius = disablePassBorderRadiusProp ?? !hasRadius
    const childrens = Children.toArray(childrenProp)
    const children = childrens.map((child, i) => {
      if (!isValidElement(child)) return child
      const disabled = child.props.disabled ?? disabledProp

      const isFirst = i === 0
      const isLast = i === childrens.length - 1

      const radiusStyles = disablePassBorderRadius
        ? null
        : {
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            ...(hasRadius && {
              ...(isFirst &&
                !vertical && {
                  borderTopLeftRadius: radius,
                  borderBottomLeftRadius: radius,
                }),
              ...(isFirst &&
                vertical && {
                  borderTopLeftRadius: radius,
                  borderTopRightRadius: radius,
                }),
              ...(isLast &&
                !vertical && {
                  borderTopRightRadius: radius,
                  borderBottomRightRadius: radius,
                }),
              ...(isLast &&
                vertical && {
                  borderBottomLeftRadius: radius,
                  borderBottomRightRadius: radius,
                }),
            }),
          }

      const props = {
        disabled,
        ...(isTamaguiElement(child) ? radiusStyles : { style: radiusStyles }),
      }

      return cloneElementWithPropOrder(child, props)
    })

    return (
      <GroupFrame
        ref={ref}
        size={size}
        flexDirection={!vertical ? 'row' : 'column'}
        borderRadius={borderRadius}
        {...restProps}
      >
        {wrapScroll(
          activeProps,
          spacedChildren({
            direction: spaceDirection,
            separator,
            space,
            children,
          }),
        )}
      </GroupFrame>
    )
  })
}

export const YGroup = createGroup(true)
export const XGroup = createGroup(false)

const wrapScroll = (
  { scrollable, vertical, showScrollIndicator = false }: GroupProps,
  children: any,
) => {
  if (scrollable)
    return (
      <ScrollView
        {...(vertical && {
          showsVerticalScrollIndicator: showScrollIndicator,
        })}
        {...(!vertical && {
          horizontal: true,
          showsHorizontalScrollIndicator: showScrollIndicator,
        })}
      >
        {children}
      </ScrollView>
    )
  return children
}

const cloneElementWithPropOrder = (child: any, props: Object) => {
  const next = mergeProps(child.props, props, false, getConfig().shorthands)[0]
  return React.cloneElement({ ...child, props: null }, next)
}
