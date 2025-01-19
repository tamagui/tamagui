import { getSpace } from '@tamagui/get-token'
import type { SizableStackProps } from '@tamagui/stacks'
import { Paragraph } from '@tamagui/text'
import * as React from 'react'

import type { TooltipProps } from './Tooltip'
import { Tooltip } from './Tooltip'

export type TooltipSimpleProps = TooltipProps & {
  disabled?: boolean
  label?: React.ReactNode
  children?: React.ReactNode
  contentProps?: SizableStackProps
}

export const TooltipSimple: React.FC<TooltipSimpleProps> = React.forwardRef(
  ({ label, children, contentProps, disabled, ...tooltipProps }, ref) => {
    const child = React.Children.only(children)

    return (
      <Tooltip
        disableRTL
        offset={15}
        restMs={40}
        delay={40}
        {...tooltipProps}
        {...(disabled ? { open: false } : null)}
      >
        <Tooltip.Trigger
          {...(typeof label === 'string' && {
            'aria-label': label,
          })}
          asChild="except-style"
        >
          {ref && React.isValidElement(child)
            ? React.cloneElement(child, { ref } as any)
            : child}
        </Tooltip.Trigger>
        <Tooltip.Content
          zIndex={1_000_000_000}
          enterStyle={{ x: 0, y: -4, opacity: 0, scale: 0.96 }}
          exitStyle={{ x: 0, y: -4, opacity: 0, scale: 0.96 }}
          x={0}
          scale={1}
          y={0}
          elevation="$0.5"
          opacity={1}
          pointerEvents="none"
          paddingVertical={getSpace(tooltipProps.size || '$true', {
            shift: -4,
          })}
          animateOnly={['transform', 'opacity']}
          animation={[
            'quicker',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          {...contentProps}
        >
          <Tooltip.Arrow />
          <Paragraph size="$3">{label}</Paragraph>
        </Tooltip.Content>
      </Tooltip>
    )
  }
)
