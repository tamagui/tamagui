import { styled, View } from '@tamagui/core'
import { withStaticProperties } from '@tamagui/helpers'

import type { RovingFocusGroupProps, RovingFocusItemProps } from './RovingFocusGroup'

// noop native doesn't need keyboard accessibility

const ITEM_NAME = 'RovingFocusGroupItem'
const RovingFocusGroupItem = styled(View, {
  name: ITEM_NAME,
})

const GROUP_NAME = 'RovingFocusGroup'
const RovingFocusGroupFrame = styled(View, {
  name: GROUP_NAME,
})

const RovingFocusGroup = withStaticProperties(
  RovingFocusGroupFrame as typeof RovingFocusGroupFrame & {
    (props: RovingFocusGroupProps & { children?: any }): any
  },
  {
    Item: RovingFocusGroupItem as typeof RovingFocusGroupItem & {
      (props: RovingFocusItemProps & { children?: any }): any
    },
  }
)

RovingFocusGroup.displayName = GROUP_NAME

const createRovingFocusGroupScope = () => () => ({})

export { RovingFocusGroup, createRovingFocusGroupScope }
export type { RovingFocusGroupProps, RovingFocusItemProps }
