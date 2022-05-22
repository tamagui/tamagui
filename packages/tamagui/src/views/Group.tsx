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

export type GroupProps = GetProps<typeof GroupFrame> & {
  scrollable?: boolean
  disabled?: boolean
  vertical?: boolean
}

export const Group = forwardRef(
  (
    {
      children: childrenProp,
      space,
      spaceDirection,
      size: sizeProp = '$4',
      scrollable,
      vertical,
      disabled: disabledProp,
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
          ...(!vertical && {
            borderTopLeftRadius: radius,
            borderBottomLeftRadius: radius,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
          }),
          ...(vertical && {
            borderTopLeftRadius: radius,
            borderTopRightRadius: radius,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }),
          disabled,
          size,
        })
      }
      if (i === childrens.length - 1) {
        return cloneElement(child, {
          ...(!vertical && {
            borderTopRightRadius: radius,
            borderBottomRightRadius: radius,
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
          }),
          ...(vertical && {
            borderBottomLeftRadius: radius,
            borderBottomRightRadius: radius,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          }),
          disabled,
          size,
        })
      }
      return cloneElement(child, { disabled, size, borderRadius: 0 })
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
      <GroupFrame ref={ref} size={sizeProp} flexDirection={!vertical ? 'row' : 'column'} {...props}>
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
