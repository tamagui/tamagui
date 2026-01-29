import type { GetProps } from '@tamagui/core'
import { styled } from '@tamagui/core'
import type { Scope } from '@tamagui/create-context'
import { createContextScope } from '@tamagui/create-context'
import { withStaticProperties } from '@tamagui/helpers'
import { YStack } from '@tamagui/stacks'
import React from 'react'
import { useIndex, useIndexedChildren } from './useIndexedChildren'

interface GroupContextValue {
  vertical: boolean
  disabled?: boolean
}

const GROUP_NAME = 'Group'

type ScopedProps<P> = P & { __scopeGroup?: Scope }
const [createGroupContext, createGroupScope] = createContextScope(GROUP_NAME)
const [GroupProvider, useGroupContext] = createGroupContext<GroupContextValue>(GROUP_NAME)

export const GroupFrame = styled(YStack, {
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
  orientation?: 'horizontal' | 'vertical'
  disabled?: boolean
}

export type GroupProps = GetProps<typeof GroupFrame> & GroupExtraProps

function createGroup(verticalDefault: boolean) {
  return withStaticProperties(
    GroupFrame.styleable<ScopedProps<GroupExtraProps>>((props, ref) => {
      const {
        __scopeGroup,
        children: childrenProp,
        orientation = verticalDefault ? 'vertical' : 'horizontal',
        disabled,
        ...restProps
      } = props

      const vertical = orientation === 'vertical'
      const indexedChildren = useIndexedChildren(React.Children.toArray(childrenProp))

      return (
        <GroupProvider vertical={vertical} disabled={disabled} scope={__scopeGroup}>
          <GroupFrame
            ref={ref}
            flexDirection={vertical ? 'column' : 'row'}
            {...restProps}
          >
            {indexedChildren}
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

function GroupItem(props: ScopedProps<GroupItemProps>) {
  const { __scopeGroup, children, forcePlacement } = props
  const context = useGroupContext('GroupItem', __scopeGroup)
  const treeIndex = useIndex()

  if (!treeIndex) {
    throw Error('<Group.Item/> should only be used within a <Group/>')
  }

  if (!React.isValidElement(children)) {
    return children as any
  }

  const isFirst =
    forcePlacement === 'first' || (forcePlacement !== 'last' && treeIndex.index === 0)
  const isLast =
    forcePlacement === 'last' ||
    (forcePlacement !== 'first' && treeIndex.index === treeIndex.maxIndex)

  // zero out border radius on connecting sides
  const radiusStyles = getZeroedRadius(isFirst, isLast, context.vertical)

  const childProps: Record<string, any> = {
    ...radiusStyles,
  }

  if (context.disabled != null) {
    childProps.disabled = (children.props as any).disabled ?? context.disabled
  }

  return React.cloneElement(children, childProps)
}

export const useGroupItem = (
  childrenProps: { disabled?: boolean },
  forcePlacement?: GroupItemProps['forcePlacement'],
  __scopeGroup?: Scope
) => {
  const treeIndex = useIndex()
  const context = useGroupContext('GroupItem', __scopeGroup)

  if (!treeIndex) {
    throw Error('useGroupItem should only be used within a <Group/>')
  }

  const isFirst =
    forcePlacement === 'first' || (forcePlacement !== 'last' && treeIndex.index === 0)
  const isLast =
    forcePlacement === 'last' ||
    (forcePlacement !== 'first' && treeIndex.index === treeIndex.maxIndex)

  const radiusStyles = getZeroedRadius(isFirst, isLast, context.vertical)

  return {
    disabled: childrenProps.disabled ?? context.disabled,
    ...radiusStyles,
  }
}

export const Group = createGroup(true)
export const YGroup = Group
export const XGroup = createGroup(false)

/**
 * returns styles that zero out border radius on the connecting/interior sides
 * children keep their own border radius on the exterior sides
 */
function getZeroedRadius(isFirst: boolean, isLast: boolean, vertical: boolean) {
  if (vertical) {
    // vertical: zero bottom radius of non-last items, zero top radius of non-first items
    return {
      ...(isFirst ? null : { borderTopLeftRadius: 0, borderTopRightRadius: 0 }),
      ...(isLast ? null : { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }),
    }
  }
  // horizontal: zero right radius of non-last items, zero left radius of non-first items
  return {
    ...(isFirst ? null : { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }),
    ...(isLast ? null : { borderTopRightRadius: 0, borderBottomRightRadius: 0 }),
  }
}

export { createGroupScope }
