import { GetProps, getTokens, getVariableValue, spacedChildren, styled } from '@tamagui/core'
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
        size: sizeProp = '$4',
        scrollable,
        vertical,
        disabled: disabledProp,
        disablePassBorderRadius,
        disablePassSize,
        ...props
      }: GroupProps,
      ref
    ) => {
      const radius = getVariableValue(getTokens().radius[sizeProp]) - 1
      const childrens = Children.toArray(childrenProp)
      const children = childrens.map((child, i) => {
        if (!radius) return child
        if (!isValidElement(child)) return child
        const disabled = child.props.disabled ?? disabledProp
        const size = child.props.size ?? sizeProp
        if (i === 0) {
          return cloneElement(child, {
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
          return cloneElement(child, {
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
        return cloneElement(child, {
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
