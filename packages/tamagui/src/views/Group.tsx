import {
  GetProps,
  Slot,
  TamaguiElement,
  UnionableString,
  Variable,
  getConfig,
  getExpandedShorthands,
  getTokens,
  getVariableValue,
  isTamaguiElement,
  mergeProps,
  spacedChildren,
  styled,
  useMediaPropsActive,
  withStaticProperties,
} from '@tamagui/core'
import { Scope, createContextScope } from '@tamagui/create-context'
import { ThemeableStack } from '@tamagui/stacks'
import React, { Children, forwardRef, isValidElement } from 'react'
import { ScrollView } from 'react-native'
import {
  useIndex,
  useIndexedChildren,
  useRovingIndex,
  useTree,
  useTreeNode,
  useTreeState,
} from 'reforest'

interface GroupContextValue {
  vertical: boolean
  disablePassBorderRadius: boolean
  radius?: number | UnionableString | Variable<any>
  disabled?: boolean
}

const GROUP_NAME = 'Group'

type ScopedProps<P> = P & { __scopeGroup?: Scope }
const [createGroupContext, createGroupScope] = createContextScope(GROUP_NAME)
const [GroupProvider, useGroupContext] = createGroupContext<GroupContextValue>(GROUP_NAME)

export const GroupFrame = styled(ThemeableStack, {
  name: 'GroupFrame',
  backgroundColor: '$background',
  y: 0,

  variants: {
    size: (val, { tokens }) => {
      const borderRadius = tokens.radius[val] ?? val ?? tokens.radius['$true']
      return {
        borderRadius,
      }
    },
  } as const,

  defaultVariants: {
    size: '$true',
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
  return withStaticProperties(
    forwardRef<TamaguiElement, ScopedProps<GroupProps>>((props, ref) => {
      const activeProps = useMediaPropsActive(props)

      const {
        __scopeGroup,
        children: childrenProp,
        space,
        size = '$true',
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
        (size ? getVariableValue(getTokens().radius[size]) - 1 : undefined)
      const hasRadius = radius !== undefined
      const disablePassBorderRadius = disablePassBorderRadiusProp ?? !hasRadius

      const childrens = Children.toArray(childrenProp)
      const children = childrens.map((child, i) => {
        // this block is for backward compatibility, when Group.Item is not provided
        if (!isValidElement(child)) {
          return child
        }
        const disabled = child.props.disabled ?? disabledProp

        const isFirst = i === 0
        const isLast = i === childrens.length - 1

        const radiusStyles = disablePassBorderRadius
          ? null
          : getBorderRadius({ isFirst, isLast, radius, vertical })
        const props = {
          disabled,
          ...(isTamaguiElement(child) ? radiusStyles : { style: radiusStyles }),
        }
        return cloneElementWithPropOrder(child, props)
      })

      const tree = useTree(
        spacedChildren({
          direction: spaceDirection,
          separator,
          space,
          children,
        })
      )

      return (
        <GroupProvider
          disablePassBorderRadius={disablePassBorderRadius}
          vertical={vertical}
          radius={radius}
          disabled={disabledProp}
          scope={__scopeGroup}
        >
          <GroupFrame
            ref={ref}
            size={size}
            flexDirection={!vertical ? 'row' : 'column'}
            borderRadius={borderRadius}
            {...restProps}
          >
            {wrapScroll(activeProps, tree.children)}
          </GroupFrame>
        </GroupProvider>
      )
    }),
    {
      Item: GroupItem,
    }
  )
}

const GroupItem = (props: ScopedProps<{ children: React.ReactNode }>) => {
  const { __scopeGroup, children } = props
  const treeIndex = useIndex()
  const context = useGroupContext('GroupItem', __scopeGroup)

  if (!isValidElement(children)) return <>children</>
  const disabled = children.props.disabled ?? context.disabled

  if (!treeIndex) throw Error('<Group.Item/> should only be used within a <Group/>')

  const isFirst = treeIndex.index === 0
  const isLast = treeIndex.index === treeIndex.maxIndex

  let propsToPass: Record<string, any> = {
    disabled,
  }
  if (!context.disablePassBorderRadius) {
    const radiusStyles = getBorderRadius({
      radius: context.radius,
      isFirst,
      isLast,
      vertical: context.vertical,
    })
    if (isTamaguiElement(children)) {
      propsToPass = { ...propsToPass, ...radiusStyles }
    } else {
      propsToPass.style = radiusStyles
    }
  }

  return <Slot {...propsToPass}>{children}</Slot>
}

export const YGroup = createGroup(true)
export const XGroup = createGroup(false)

const wrapScroll = (
  { scrollable, vertical, showScrollIndicator = false }: GroupProps,
  children: any
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

const getBorderRadius = ({
  isFirst,
  isLast,
  radius,
  vertical,
}: {
  radius: any
  vertical: boolean
  isFirst: boolean
  isLast: boolean
}) => {
  // TODO: RTL support would be nice here
  return {
    borderTopLeftRadius: isFirst ? radius : 0,
    borderTopRightRadius: (vertical && isFirst) || (!vertical && isLast) ? radius : 0,
    borderBottomLeftRadius: (vertical && isLast) || (!vertical && isFirst) ? radius : 0,
    borderBottomRightRadius: isLast ? radius : 0,
  }
}

const cloneElementWithPropOrder = (child: any, props: Object) => {
  const next = mergeProps(child.props, props, false, getConfig().shorthands)[0]
  return React.cloneElement({ ...child, props: null }, next)
}
