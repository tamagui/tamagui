import type { GetProps, UnionableString, Variable } from '@tamagui/core'
import {
  getConfig,
  getTokens,
  getVariableValue,
  isTamaguiElement,
  mergeProps,
  spacedChildren,
  styled,
  useProps,
} from '@tamagui/core'
import type { Scope } from '@tamagui/create-context'
import { createContextScope } from '@tamagui/create-context'
import { withStaticProperties } from '@tamagui/helpers'
import { ThemeableStack } from '@tamagui/stacks'
import { useControllableState } from '@tamagui/use-controllable-state'
import React from 'react'
import { ScrollView } from 'react-native'
import { useIndex, useIndexedChildren } from './useIndexedChildren'

type DisablePassBorderRadius = boolean | 'bottom' | 'top' | 'start' | 'end'

interface GroupContextValue {
  vertical: boolean
  disablePassBorderRadius: DisablePassBorderRadius
  onItemMount: () => void
  onItemUnmount: () => void
  radius?: number | UnionableString | Variable<any>
  disabled?: boolean
}

const GROUP_NAME = 'Group'

type ScopedProps<P> = P & { __scopeGroup?: Scope }
const [createGroupContext, createGroupScope] = createContextScope(GROUP_NAME)
const [GroupProvider, useGroupContext] = createGroupContext<GroupContextValue>(GROUP_NAME)

export const GroupFrame = styled(ThemeableStack, {
  name: 'GroupFrame',

  variants: {
    unstyled: {
      false: {
        size: '$true',
      },
    },

    size: (val, { tokens }) => {
      const borderRadius = tokens.radius[val] ?? val ?? tokens.radius['$true']
      return {
        borderRadius,
      }
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

export type GroupExtraProps = {
  /**
   * @deprecated use `orientation` instead
   */
  axis?: 'horizontal' | 'vertical'
  orientation?: 'horizontal' | 'vertical'
  scrollable?: boolean
  /**
   * @default false
   */
  showScrollIndicator?: boolean
  disabled?: boolean
  disablePassBorderRadius?: DisablePassBorderRadius
  /**
   * forces the group to use the Group.Item API
   */
  forceUseItem?: boolean
}

export type GroupProps = GetProps<typeof GroupFrame> & GroupExtraProps

function createGroup(verticalDefault: boolean) {
  return withStaticProperties(
    GroupFrame.styleable<ScopedProps<GroupExtraProps>>((props, ref) => {
      const activeProps = useProps(props)

      const {
        __scopeGroup,
        children: childrenProp,
        space,
        size = '$true',
        spaceDirection,
        separator,
        scrollable,
        axis = verticalDefault ? 'vertical' : 'horizontal',
        orientation = axis,
        disabled: disabledProp,
        disablePassBorderRadius: disablePassBorderRadiusProp,
        borderRadius,
        forceUseItem,
        ...restProps
      } = activeProps

      const vertical = orientation === 'vertical'
      const [itemChildrenCount, setItemChildrenCount] = useControllableState({
        defaultProp: forceUseItem ? 1 : 0,
      })
      const isUsingItems = itemChildrenCount > 0

      // 1 off given border to adjust for border radius? This should be user controllable
      const radius =
        borderRadius ??
        (size ? getVariableValue(getTokens().radius[size]) - 1 : undefined)

      const hasRadius = radius !== undefined
      const disablePassBorderRadius = disablePassBorderRadiusProp ?? !hasRadius

      const childrenArray = React.Children.toArray(childrenProp)
      const children = isUsingItems
        ? React.Children.toArray(childrenProp).filter(React.isValidElement)
        : childrenArray.map((child, i) => {
            if (!React.isValidElement(child) || child.type === React.Fragment) {
              return child
            }
            const disabled = child.props.disabled ?? disabledProp

            const isFirst = i === 0
            const isLast = i === childrenArray.length - 1

            const radiusStyles =
              disablePassBorderRadius === true
                ? null
                : getBorderRadius({
                    isFirst,
                    isLast,
                    radius,
                    vertical,
                    disable: disablePassBorderRadius,
                  })
            const props = {
              disabled,
              ...(isTamaguiElement(child) ? radiusStyles : { style: radiusStyles }),
            }

            return cloneElementWithPropOrder(child, props)
          })

      const indexedChildren = useIndexedChildren(
        spacedChildren({
          direction: spaceDirection,
          separator,
          space,
          children,
        })
      )

      const onItemMount = React.useCallback(
        () => setItemChildrenCount((prev) => prev + 1),
        []
      )
      const onItemUnmount = React.useCallback(
        () => setItemChildrenCount((prev) => prev - 1),
        []
      )

      return (
        <GroupProvider
          disablePassBorderRadius={disablePassBorderRadius}
          vertical={orientation === 'vertical'}
          // @ts-ignore this just popped up since new version expo 49
          radius={radius}
          disabled={disabledProp}
          onItemMount={onItemMount}
          onItemUnmount={onItemUnmount}
          scope={__scopeGroup}
        >
          <GroupFrame
            ref={ref}
            size={size}
            flexDirection={orientation === 'horizontal' ? 'row' : 'column'}
            borderRadius={borderRadius}
            {...restProps}
          >
            {wrapScroll({ ...activeProps, orientation }, indexedChildren)}
          </GroupFrame>
        </GroupProvider>
      )
    }),
    {
      Item: GroupItem,
    }
  )
}

export type GroupItemProps = {
  children: React.ReactNode
  /**
   * forces the item to be a starting, center or ending item and gets the respective styles
   */
  forcePlacement?: 'first' | 'center' | 'last'
}

const GroupItem = React.forwardRef(
  (
    props: ScopedProps<GroupItemProps>,
    // Note unused, breaks popper targets even if i try and compose it
    _ref
  ) => {
    const { __scopeGroup, children, forcePlacement } = props
    const groupItemProps = useGroupItem(
      { disabled: React.isValidElement(children) ? children.props.disabled : undefined },
      forcePlacement,
      __scopeGroup
    )

    if (!React.isValidElement(children) || children.type === React.Fragment) {
      return children as any
    }

    if (isTamaguiElement(children)) {
      return React.cloneElement(children, groupItemProps)
    }

    return React.cloneElement(children, {
      style: {
        // @ts-ignore
        ...children.props?.['style'],
        ...groupItemProps,
      },
    } as any)
  }
)

export const useGroupItem = (
  childrenProps: { disabled: boolean; ref?: any },
  forcePlacement?: GroupItemProps['forcePlacement'],
  __scopeGroup?: Scope
) => {
  const treeIndex = useIndex()
  const context = useGroupContext('GroupItem', __scopeGroup)

  React.useEffect(() => {
    context.onItemMount()
    return () => {
      context.onItemUnmount()
    }
  }, [])

  if (!treeIndex) {
    throw Error('<Group.Item/> should only be used within a <Group/>')
  }

  const isFirst =
    forcePlacement === 'first' || (forcePlacement !== 'last' && treeIndex.index === 0)
  const isLast =
    forcePlacement === 'last' ||
    (forcePlacement !== 'first' && treeIndex.index === treeIndex.maxIndex)

  const disabled = childrenProps.disabled ?? context.disabled

  let propsToPass: Record<string, any> = {
    disabled,
  }

  if (context.disablePassBorderRadius !== true) {
    const borderRadius = getBorderRadius({
      radius: context.radius,
      isFirst,
      isLast,
      vertical: context.vertical,
      disable: context.disablePassBorderRadius,
    })
    return { ...propsToPass, ...borderRadius }
  }
  return propsToPass
}

export const Group = createGroup(true)
export const YGroup = Group
export const XGroup = createGroup(false)

const wrapScroll = (
  { scrollable, orientation, showScrollIndicator = false }: GroupProps,
  children: any
) => {
  if (scrollable)
    return (
      <ScrollView
        {...(orientation === 'vertical' && {
          showsVerticalScrollIndicator: showScrollIndicator,
        })}
        {...(orientation === 'horizontal' && {
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
  disable,
}: {
  radius: any
  vertical: boolean
  isFirst: boolean
  isLast: boolean
  disable: DisablePassBorderRadius
}) => {
  // TODO: RTL support would be nice here
  return {
    borderTopLeftRadius: isFirst && disable !== 'top' && disable !== 'start' ? radius : 0,
    borderTopRightRadius:
      disable !== 'top' &&
      disable !== 'end' &&
      ((vertical && isFirst) || (!vertical && isLast))
        ? radius
        : 0,
    borderBottomLeftRadius:
      disable !== 'bottom' &&
      disable !== 'start' &&
      ((vertical && isLast) || (!vertical && isFirst))
        ? radius
        : 0,
    borderBottomRightRadius:
      isLast && disable !== 'bottom' && disable !== 'end' ? radius : 0,
  }
}

const cloneElementWithPropOrder = (child: any, props: Object) => {
  const next = mergeProps(child.props, props, getConfig().shorthands)
  return React.cloneElement({ ...child, props: null }, next)
}
