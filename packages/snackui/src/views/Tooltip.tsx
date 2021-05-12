import React from 'react'
import { isTouchDevice, isWeb } from 'snackui/src/platform'

import { Box } from './Box'
import { HoverablePopover } from './HoverablePopover'
import { PopoverProps } from './PopoverProps'
import { Text } from './Text'

export type TooltipProps = Omit<PopoverProps, 'contents'> & { contents: any }

export const Tooltip = ({ contents, ...props }: TooltipProps) => {
  if (isTouchDevice) {
    return null
  }
  return (
    <HoverablePopover
      noArrow
      delay={200}
      contents={
        open => open ? 
        <Box backgroundColor="#000" paddingHorizontal={9} borderRadius={1000}>
          <Text fontSize={13} color="#fff">
            {contents}
          </Text>
        </Box> : null
      }
      {...props}
    />
  )
}
