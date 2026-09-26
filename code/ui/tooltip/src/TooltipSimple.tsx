import { createRefComponent } from '@tamagui/core'
import type { YStackProps } from '@tamagui/stacks'
import { Paragraph } from '@tamagui/text'
import * as React from 'react'

import type { TooltipProps } from './Tooltip'
import { Tooltip } from './Tooltip'

export type TooltipSimpleProps = TooltipProps & {
  disabled?: boolean
  /** arrow size in px */
  size?: number
  label?: React.ReactNode
  children?: React.ReactNode
  contentProps?: YStackProps
}

export const TooltipSimple: React.FC<TooltipSimpleProps> = createRefComponent(
  ({ label, children, contentProps, disabled, size = 7, ...tooltipProps }, ref) => {
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
          theme="brand"
          y="enter:-4px exit:-4px"
          scale="1 enter:0.96 exit:0.96"
          opacity="1 enter:0 exit:0"
          pointerEvents="none"
          paddingHorizontal="2"
          paddingVertical="1"
          borderRadius={6}
          boxShadow="0 2px 4px shadow-color"
          transition={{
            preset: 'quicker',
            properties: 'transform, opacity',
            opacity: { preset: 'quicker', spring: { overshootClamping: true } },
          }}
          {...contentProps}
        >
          <Tooltip.Arrow
            size={size}
            backgroundColor="background"
            borderColor="border-color"
          />
          <Paragraph
            maxWidth={350}
            overflow="hidden"
            textAlign="center"
            textWrap="web:balance"
            size="3"
          >
            {label}
          </Paragraph>
        </Tooltip.Content>
      </Tooltip>
    )
  }
)
