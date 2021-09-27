import React from 'react'

import { isTouchDevice } from '../platform'
import { Box } from './Box'
import { HoverablePopover } from './HoverablePopover'
import { IPopoverProps } from './Popover/types'
import { Text } from './Text'
import { Popover } from '..'

export type TooltipProps = IPopoverProps

export const Tooltip = (props: TooltipProps) => {
  if (isTouchDevice) {
    return props.trigger({} as any, { open: false })
  }
  return (
    <HoverablePopover placement="bottom" delay={200} {...props}>
      {({ open }) => {
        return open ? (
          <Popover.Content accessibilityLabel={`${props.children}`} margin={10}>
            <Box backgroundColor="#000" paddingHorizontal={9} borderRadius={1000}>
              <Text fontSize={13} color="#fff">
                {props.children}
              </Text>
            </Box>
          </Popover.Content>
        ) : null
      }}
    </HoverablePopover>
  )
}
