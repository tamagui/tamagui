import { GetProps, getTokens, getVariableValue, spacedChildren, styled } from '@tamagui/core'
import { YStack } from '@tamagui/stacks'
import { Children, cloneElement, forwardRef, isValidElement } from 'react'
import { ScrollView } from 'react-native'

export const GroupFrame = styled(YStack, {
  name: 'GroupFrame',
  borderWidth: 1,
  y: 0,
  borderColor: '$borderColor',
  overflow: 'hidden',
  hoverStyle: {
    borderColor: '$borderColorHover',
  },

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

type GroupProps = GetProps<typeof GroupFrame> & {
  scrollable?: boolean
}

const getGroup = (direction: 'X' | 'Y') =>
  forwardRef(
    (
      {
        children: childrenProp,
        space,
        spaceDirection,
        size = '$4',
        scrollable,
        ...props
      }: XGroupProps,
      ref
    ) => {
      const radius = getVariableValue(getTokens().radius[size]) - 1
      const childrens = Children.toArray(childrenProp)
      const children = childrens.map((child, i) => {
        if (!radius) return child
        if (!isValidElement(child)) return child
        if (i === 0) {
          return cloneElement(child, {
            borderTopLeftRadius: radius,
            borderBottomLeftRadius: radius,
          })
        }
        if (i === childrens.length - 1) {
          return cloneElement(child, {
            borderTopRightRadius: radius,
            borderBottomRightRadius: radius,
          })
        }
        return child
      })

      const wrapScroll = (children: any) => {
        if (scrollable)
          return (
            <ScrollView
              {...(direction === 'Y' && {
                showsVerticalScrollIndicator: false,
              })}
              {...(direction === 'X' && {
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
          size={size}
          flexDirection={direction === 'X' ? 'row' : 'column'}
          {...props}
        >
          {wrapScroll(
            spacedChildren({
              direction: spaceDirection,
              space,
              children,
            })
          )}
        </GroupFrame>
      )
    }
  )

export type XGroupProps = GroupProps
export const XGroup = getGroup('X')

export type YGroupProps = GroupProps
export const YGroup = getGroup('Y')
