import { StackProps, Text, Theme, isTouchDevice } from '@tamagui/core'
import React from 'react'

import { HoverablePopover, HoverablePopoverProps } from './HoverablePopover'
import { Paragraph } from './Paragraph'
import { YStack } from './Stacks'

export type TooltipProps = Omit<HoverablePopoverProps, 'trigger'> & {
  contents?: string | any
  tooltipFrameProps?: Omit<StackProps, 'children'>
}

export const Tooltip = ({ contents, tooltipFrameProps, ...props }: TooltipProps) => {
  // this causes ssr issues
  // if (isTouchDevice) {
  //   // TODO optionally have it show something on tap
  //   return <>{props.children}</>
  // }
  return (
    <HoverablePopover
      placement="bottom"
      delay={200}
      disableUntilSettled
      {...props}
      trigger={(triggerProps) =>
        React.isValidElement(props.children) ? (
          React.cloneElement(props.children, triggerProps)
        ) : (
          // TODO validate works on native (see Hero <Tooltip /> font)
          <Text fontFamily="inherit" fontSize="inherit" {...triggerProps}>
            {props.children}
          </Text>
        )
      }
    >
      {({ open }) => {
        return open ? (
          <Theme name="dark">
            <YStack
              margin={10}
              backgroundColor="$bg2"
              paddingHorizontal="$2"
              paddingVertical="$2"
              maxWidth={400}
              borderRadius="$2"
              shadowColor="$shadowColor"
              shadowRadius={2}
              shadowOffset={{ height: 2, width: 0 }}
              {...tooltipFrameProps}
            >
              <Paragraph textAlign="center" fontSize={14} color="$color">
                {contents}
              </Paragraph>
            </YStack>
          </Theme>
        ) : null
      }}
    </HoverablePopover>
  )
}
