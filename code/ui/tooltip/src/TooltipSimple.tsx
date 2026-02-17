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
    'use no memo'

    const child = React.Children.only(children)

    if (!label) {
      return children
    }

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
          enterStyle={{ y: -4, opacity: 0, scale: 0.96 }}
          exitStyle={{ y: -4, opacity: 0, scale: 0.96 }}
          scale={1}
          elevation="$0.5"
          opacity={1}
          pointerEvents="none"
          paddingVertical={getSpace(tooltipProps.size || '$true', {
            shift: -4,
          })}
          animateOnly={['transform', 'opacity']}
          transition={[
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
          <Paragraph
            maxWidth={350}
            overflow="hidden"
            size="$3"
            textAlign="center"
            $platform-web={{
              textWrap: 'balance',
            }}
          >
            {label}
          </Paragraph>
        </Tooltip.Content>
      </Tooltip>
    )
  }
)
