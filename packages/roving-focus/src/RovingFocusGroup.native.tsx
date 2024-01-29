import { Stack } from '@tamagui/core'
import { withStaticProperties } from '@tamagui/helpers'
import React from 'react'

import type { RovingFocusGroupProps, RovingFocusItemProps } from './RovingFocusGroup'

// noop native doesn't need keyboard accessibility

const ITEM_NAME = 'RovingFocusGroupItem'
const RovingFocusGroupItem = React.forwardRef(
  ({ children, ...props }: RovingFocusItemProps, _ref) => (
    <Stack {...props}>{children}</Stack>
  )
)
RovingFocusGroupItem.displayName = ITEM_NAME
const GROUP_NAME = 'RovingFocusGroup'

const RovingFocusGroup = withStaticProperties(
  React.forwardRef(({ children, ...props }: RovingFocusGroupProps, _ref) => (
    <Stack {...props}>{children}</Stack>
  )),
  {
    Item: RovingFocusGroupItem,
  }
)

RovingFocusGroup.displayName = GROUP_NAME

const createRovingFocusGroupScope = () => () => ({})

export { RovingFocusGroup, createRovingFocusGroupScope }
export type { RovingFocusGroupProps, RovingFocusItemProps }
