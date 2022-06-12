import {
  GetProps,
  getTokens,
  getVariableValue,
  mergeProps,
  spacedChildren,
  styled,
} from '@tamagui/core'
import { ThemeableStack } from '@tamagui/stacks'
import React, { Children, cloneElement, forwardRef, isValidElement } from 'react'
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
        size: sizeProp,
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
      const disablePassBorderRadius = disablePassBorderRadiusProp ?? typeof radius !== 'number'
      const childrens = Children.toArray(childrenProp)
      const disablePassSize = disablePassSizeProp ?? sizeProp === undefined
      const children = childrens.map((child, i) => {
        if (!isValidElement(child)) return child
        const disabled = child.props.disabled ?? disabledProp
        const size = disablePassSize ? child.props.size : sizeProp

        if (i === 0) {
          return cloneElementWithPropOrder(child, {
            ...(!disablePassSize && {
              size,
            }),
            ...(!disablePassBorderRadius &&
              !vertical && {
                borderTopLeftRadius: radius,
                borderBottomLeftRadius: radius,
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
              }),
            ...(!disablePassBorderRadius &&
              vertical && {
                borderTopLeftRadius: radius,
                borderTopRightRadius: radius,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
              }),
            disabled,
          })
        }
        if (i === childrens.length - 1) {
          return cloneElementWithPropOrder(child, {
            ...(!disablePassSize && {
              size,
            }),
            ...(!disablePassBorderRadius &&
              !vertical && {
                borderTopRightRadius: radius,
                borderBottomRightRadius: radius,
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
              }),
            ...(!disablePassBorderRadius &&
              vertical && {
                borderBottomLeftRadius: radius,
                borderBottomRightRadius: radius,
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
              }),
            disabled,
          })
        }
        return cloneElementWithPropOrder(child, {
          disabled,
          ...(!disablePassSize && {
            size,
          }),
          ...(!disablePassBorderRadius && {
            borderRadius: 0,
          }),
        })
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
