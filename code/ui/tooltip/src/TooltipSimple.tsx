import { createRefComponent, getVariableValue } from '@tamagui/core'
import { getSize } from '@tamagui/get-token'
import type { YStackProps } from '@tamagui/stacks'
import { Paragraph } from '@tamagui/text'
import * as React from 'react'

import type { TooltipProps } from './Tooltip'
import { Tooltip } from './Tooltip'

export type TooltipSimpleProps = TooltipProps & {
  disabled?: boolean
  label?: React.ReactNode
  children?: React.ReactNode
  contentProps?: YStackProps
}

export const TooltipSimple: React.FC<TooltipSimpleProps> = createRefComponent(
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
        // ensure tooltips appear above dialogs and other portaled content
        zIndex={1_000_000}
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
          enterStyle={{ y: -4, opacity: 0, scale: 0.96 }}
          exitStyle={{ y: -4, opacity: 0, scale: 0.96 }}
          scale={1}
          elevation="$0.5"
          opacity={1}
          pointerEvents="none"
          paddingVertical={Math.max(
            0,
            Math.round(
              (getVariableValue(getSize(tooltipProps.size ?? true)) as number) * 0.36 - 9
            )
          )}
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
            $web={{
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
