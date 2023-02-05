import { withStaticProperties } from '@tamagui/core'
import { createContextScope } from '@tamagui/create-context'
import React from 'react'

import { RovingFocusGroupProps, RovingFocusItemProps } from './RovingFocusGroup'

// noop native doesn't need keyboard accessibility

const ITEM_NAME = 'RovingFocusGroupItem'
const RovingFocusGroupItem = React.forwardRef(
  (props: RovingFocusItemProps, _ref) => props.children as any
)
RovingFocusGroupItem.displayName = ITEM_NAME
const GROUP_NAME = 'RovingFocusGroup'

const RovingFocusGroup = withStaticProperties(
  React.forwardRef((props: RovingFocusGroupProps, _ref) => props.children as any),
  {
    Item: RovingFocusGroupItem,
  }
)

RovingFocusGroup.displayName = GROUP_NAME

const [_, createRovingFocusGroupScope] = createContextScope(GROUP_NAME)

export { RovingFocusGroup, createRovingFocusGroupScope }
export type { RovingFocusGroupProps, RovingFocusItemProps }
