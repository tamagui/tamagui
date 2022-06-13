import {
  GetProps,
  getTokens,
  getVariableValue,
  mergeProps,
  spacedChildren,
  styled,
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
  },

  defaultVariants: {
    size: '$4',
  },
})

export type GroupProps = GetProps<typeof GroupFrame> & {
  scrollable?: boolean
  disabled?: boolean
  vertical?: boolean
  disablePassBorderRadius?: boolean
  disablePassSize?: boolean
}

export const Group = GroupFrame.extractable(
  forwardRef(
    (
      {
        children: childrenProp,
        space,
        spaceDirection,
        separator,
        size: sizeProp = '$4',
        scrollable,
        vertical,
        disabled: disabledProp,
        disablePassBorderRadius: disablePassBorderRadiusProp,
        disablePassSize: disablePassSizeProp,
        ...props
      }: GroupProps,
      ref
    ) => {
      const radius = sizeProp ? getVariableValue(getTokens().radius[sizeProp]) - 1 : undefined
      const hasRadius = typeof radius !== 'number'
      const disablePassBorderRadius = disablePassBorderRadiusProp ?? hasRadius
      const childrens = Children.toArray(childrenProp)
      const disablePassSize = disablePassSizeProp ?? sizeProp === undefined
      const children = childrens.map((child, i) => {
        if (!isValidElement(child)) return child
        const disabled = child.props.disabled ?? disabledProp
        const size = child.props.size ?? sizeProp

        const isFirst = i === 0
        const isLast = i === childrens.length - 1
        const props = {
          disabled,
          ...(!disablePassSize && {
            size,
          }),
          ...(!disablePassBorderRadius && {
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
          }),
        }
        return cloneElementWithPropOrder(child, props)
      })

      const wrapScroll = (children: any) => {
        if (scrollable)
          return (
            <ScrollView
              {...(vertical && {
                showsVerticalScrollIndicator: false,
              })}
              {...(!vertical && {
                horizontal: true,
                showsHorizontalScrollIndicator: false,
              })}
            >
              {children}
            </ScrollView>
          )
        return children
      }

      return (
        <GroupFrame
          ref={ref}
          size={sizeProp}
          flexDirection={!vertical ? 'row' : 'column'}
          {...props}
        >
          {wrapScroll(
            spacedChildren({
              direction: spaceDirection,
              separator,
              space,
              children,
            })
          )}
        </GroupFrame>
      )
    }
  )
)

const cloneElementWithPropOrder = (child: any, props: Object) => {
  const next = mergeProps(child.props, props)
  return React.cloneElement({ ...child, props: null }, next)
}
