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
        vertical = verticalDefault,
        disabled: disabledProp,
        disablePassBorderRadius: disablePassBorderRadiusProp,
        borderRadius,
        forceUseItem,
        ...restProps
      } = getExpandedShorthands(activeProps)

      const [itemChildrenCount, setItemChildrenCount] = useControllableState({
        defaultProp: forceUseItem ? 1 : 0,
      })
      const isUsingItems = itemChildrenCount > 0
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

      return (
        <GroupProvider
          disablePassBorderRadius={disablePassBorderRadius}
          vertical={vertical}
          radius={radius}
          disabled={disabledProp}
          onItemMount={() => setItemChildrenCount((prev) => prev + 1)}
          onItemUnmount={() => setItemChildrenCount((prev) => prev - 1)}
          scope={__scopeGroup}
        >
          <GroupFrame
            ref={ref}
            size={size}
            flexDirection={!vertical ? 'row' : 'column'}
            borderRadius={borderRadius}
            {...restProps}
          >
            {wrapScroll(activeProps, indexedChildren)}
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
  return cloneElement(children, {
    ...children.props,
    ...propsToPass,
    style: { ...children.props.style, ...propsToPass.style },
  })
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
