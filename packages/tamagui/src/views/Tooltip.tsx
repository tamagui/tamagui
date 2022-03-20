import { StackProps, Text, Theme, isTamaguiElement, isWeb, styled } from '@tamagui/core'
import React from 'react'

import { HoverablePopover, HoverablePopoverProps } from './HoverablePopover'
import { Paragraph } from './Paragraph'
import { SizableFrame } from './SizableFrame'
import { SizableTextProps } from './SizableText'

// bugfix esbuild strips react jsx: 'preserve'
React['createElement']

export type TooltipProps = Omit<HoverablePopoverProps, 'trigger'> & {
  size?: SizableTextProps['size']
  contents?: string | any
  tooltipFrameProps?: Omit<StackProps, 'children'>
  alwaysDark?: boolean
  showArrow?: boolean
}

const TooltipFrame = styled(SizableFrame, {
  tag: 'button',
  borderWidth: 0,
})

export const Tooltip = ({
  size = '$4',
  contents,
  tooltipFrameProps,
  alwaysDark,
  showArrow,
  ...props
}: TooltipProps) => {
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
        if (!open) {
          return null
        }
        return [
          showArrow ? <HoverablePopover.Arrow backgroundColor="$background" /> : null,
          <Theme name={alwaysDark ? 'dark' : null}>
            <TooltipFrame
              elevation={size}
              backgroundColor="$background"
              maxWidth={400}
              size={size}
              // TODO we could fix this i think with some fancy stuff
              {...(tooltipFrameProps as any)}
            >
              <Paragraph textAlign="center" color="$color" size={size}>
                {contents}
              </Paragraph>
            </TooltipFrame>
          </Theme>,
        ]
      }}
    </HoverablePopover>
  )
}
