import { StackProps, Text, Theme, isTamaguiElement, isWeb, styled } from '@tamagui/core'
import React from 'react'

import { HoverablePopover, HoverablePopoverProps } from './HoverablePopover'
import { InteractiveFrame } from './InteractiveFrame'
import { Paragraph } from './Paragraph'
import { SizableTextProps } from './SizableText'

export type TooltipProps = Omit<HoverablePopoverProps, 'trigger'> & {
  size?: SizableTextProps['size']
  contents?: string | any
  tooltipFrameProps?: Omit<StackProps, 'children'>
  alwaysDark?: boolean
}

const TooltipFrame = styled(InteractiveFrame, {
  tag: 'button',
  borderWidth: 0,
})

export const Tooltip = ({
  size = '$4',
  contents,
  tooltipFrameProps,
  alwaysDark,
  ...props
}: TooltipProps) => {
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
        isTamaguiElement(props.children) ? (
          React.cloneElement(props.children as any, triggerProps)
        ) : (
          // TODO validate works on native (see Hero <Tooltip /> font)
          <Text
            {...(isWeb && {
              fontFamily: 'inherit',
              fontSize: 'inherit',
            })}
            {...triggerProps}
          >
            {props.children}
          </Text>
        )
      }
    >
      {({ open }) => {
        return open ? (
          <Theme name={alwaysDark ? 'dark' : null}>
            <TooltipFrame
              elevation={size}
              margin={10}
              backgroundColor="$bg2"
              maxWidth={400}
              size={size}
              {...tooltipFrameProps}
            >
              <Paragraph textAlign="center" fontSize={14} color="$color">
                {contents}
              </Paragraph>
            </TooltipFrame>
          </Theme>
        ) : null
      }}
    </HoverablePopover>
  )
}
