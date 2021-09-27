import React from 'react'
import { isTouchDevice } from '../platform'
import { Box } from './Box'
import { HoverablePopoverProps, HoverablePopover } from './HoverablePopover'
import { Text } from './Text'

export type TooltipProps = HoverablePopoverProps

export const Tooltip = (props: TooltipProps) => {
  if (isTouchDevice) {
    return props.trigger({} as any, { open: false })
  }
  return (
    <HoverablePopover placement="bottom" delay={200} {...props}>
      {({ open }) => {
        return open ? (
          <Box margin={10} backgroundColor="#000" paddingHorizontal={9} borderRadius={1000}>
            <Text ellipse fontSize={13} color="#fff">
              {props.children}
            </Text>
          </Box>
        ) : null
      }}
    </HoverablePopover>
  )
}
