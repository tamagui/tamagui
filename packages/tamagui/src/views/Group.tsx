import {
  GetProps,
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
import { useControllableState } from '@tamagui/use-controllable-state'
import React, { Children, cloneElement, forwardRef, isValidElement } from 'react'
import { ScrollView } from 'react-native'
import { useIndex, useIndexedChildren } from 'reforest'

interface GroupContextValue {
  vertical: boolean
  disablePassBorderRadius: boolean
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
        y: 0,
        backgroundColor: '$background',
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
    unstyled: false,
  },
})

export type GroupProps = GetProps<typeof GroupFrame> & {
  axis?: 'horizontal' | 'vertical'

  scrollable?: boolean
  /**
   * @default false
   */
  showScrollIndicator?: boolean
  disabled?: boolean
  disablePassBorderRadius?: boolean
  /**
   * forces the group to use the Group.Item API
   */
  forceUseItem?: boolean
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
        axis = verticalDefault ? 'vertical' : 'horizontal',
        disabled: disabledProp,
        disablePassBorderRadius: disablePassBorderRadiusProp,
        borderRadius,
        forceUseItem,
        ...restProps
      } = getExpandedShorthands(activeProps)

      const vertical = axis === 'vertical'
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

      const childrenArray = Children.toArray(childrenProp)
      const children = isUsingItems
        ? childrenProp
        : childrenArray.map((child, i) => {
            if (!isValidElement(child)) {
              return child
            }
            const disabled = child.props.disabled ?? disabledProp

            const isFirst = i === 0
            const isLast = i === childrenArray.length - 1

            const radiusStyles = disablePassBorderRadius
              ? null
              : getBorderRadius({ isFirst, isLast, radius, vertical })
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
          vertical={axis === 'vertical'}
          radius={radius}
          disabled={disabledProp}
          onItemMount={onItemMount}
          onItemUnmount={onItemUnmount}
          scope={__scopeGroup}
        >
          <GroupFrame
            ref={ref}
            size={size}
            flexDirection={axis === 'horizontal' ? 'row' : 'column'}
            borderRadius={borderRadius}
            {...restProps}
          >
            {wrapScroll({ ...activeProps, axis }, indexedChildren)}
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

  React.useEffect(() => {
    context.onItemMount()
    return () => {
      context.onItemUnmount()
    }
  }, [])

  if (!isValidElement(children)) {
    return children as any
  }

  const disabled = children.props.disabled ?? context.disabled

  if (!treeIndex) {
    throw Error('<Group.Item/> should only be used within a <Group/>')
  }

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

  return cloneElement(children, {
    ...propsToPass,
    // @ts-ignore
    style: {
      ...children.props?.['style'],
      ...propsToPass.style,
    },
  })
}

export const Group = createGroup(true)
export const YGroup = Group
export const XGroup = createGroup(false)

const wrapScroll = (
  { scrollable, axis, showScrollIndicator = false }: GroupProps,
  children: any
) => {
  if (scrollable)
    return (
      <ScrollView
        {...(axis === 'vertical' && {
          showsVerticalScrollIndicator: showScrollIndicator,
        })}
        {...(axis === 'horizontal' && {
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
