import { StackProps, Text, Theme, isTamaguiElement, isWeb, styled } from '@tamagui/core'
import React, { useCallback } from 'react'

import { HoverablePopover, HoverablePopoverProps } from './HoverablePopover'
import { Paragraph } from './Paragraph'
import { SizableStack } from './SizableStack'
import { SizableTextProps } from './SizableText'
import { YStack } from './Stacks'

// bugfix esbuild strips react jsx: 'preserve'
React['createElement']

export type TooltipProps = Omit<HoverablePopoverProps, 'trigger'> & {
  size?: SizableTextProps['size']
  contents?: string | any
  tooltipFrameProps?: Omit<StackProps, 'children'>
  alwaysDark?: boolean
  showArrow?: boolean
}

const TooltipFrame = styled(SizableStack, {
  name: 'Tooltip',
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
  const getContents = useCallback(
    ({ open }: { open: boolean }) => {
      if (!open) {
        return null
      }
      return (
        // @ts-ignore
        <YStack animated animation="tooltip">
          {showArrow ? <HoverablePopover.Arrow backgroundColor="$background" /> : null}
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
          </Theme>
        </YStack>
      )
    },
    [showArrow, alwaysDark, contents, tooltipFrameProps, size]
  )

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
      {getContents}
    </HoverablePopover>
  )
}
