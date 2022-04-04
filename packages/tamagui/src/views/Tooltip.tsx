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
  enterStyle?: StackProps['enterStyle']
  exitStyle?: StackProps['exitStyle']
  size?: SizableTextProps['size']
  contents?: string | any
  // TODO move this into a radix style separate components BUT make them optional:
  //  so you can do:
  //     <Tooltip contents="hello"><Button /></Tooltip>
  //  but also do:
  //     <Tooltip>
  //       <Tooltip.Container animated animation="bounce" enterStyle={{}}>
  //          <Tooltip.Arrow />
  //          <Tooltip.Frame />
  //       </Tooltip.Container>
  //       <Tooltip.Trigger />
  //     </Tooltip>
  tooltipFrameProps?: Omit<StackProps, 'children'>
  tooltipContainerProps?: Omit<StackProps, 'children'>
  alwaysDark?: boolean
  showArrow?: boolean
}

const TooltipFrame = styled(SizableStack, {
  name: 'Tooltip',
  borderWidth: 0,
})

const defaultOutStyle = {
  opacity: 0,
  y: -10,
}

export const Tooltip = ({
  size = '$4',
  contents,
  tooltipFrameProps,
  tooltipContainerProps = {
    opacity: 1,
    y: 0,
  },
  alwaysDark,
  showArrow,
  enterStyle = defaultOutStyle,
  exitStyle = defaultOutStyle,
  ...props
}: TooltipProps) => {
  const getContents = useCallback(
    ({ open }: { open: boolean }) => {
      if (!open) {
        return null
      }
      return (
        <YStack
          key="tooltip-child"
          animated
          // @ts-ignore
          animation="tooltip"
          // @ts-ignore
          enterStyle={enterStyle}
          // @ts-ignore
          exitStyle={exitStyle}
          {...tooltipContainerProps}
        >
          {!!showArrow && (
            //
            <HoverablePopover.Arrow backgroundColor="$background" />
          )}
          <Theme name={alwaysDark ? 'dark' : null}>
            <TooltipFrame
              elevation={size}
              pointerEvents="none"
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
