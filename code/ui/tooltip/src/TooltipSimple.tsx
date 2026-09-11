import { createRefComponent } from '@tamagui/style'
import { resolveSize } from '@tamagui/size'
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

    const { frame } = resolveSize(tooltipProps.size ?? true)

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
          paddingHorizontal="5"
          paddingVertical="4"
          borderRadius={frame.borderRadius}
          boxShadow="0 2px 4px shadow-color"
          transition={{
            preset: 'quicker',
            properties: 'transform, opacity',
            opacity: { preset: 'quicker', spring: { overshootClamping: true } },
          }}
          {...contentProps}
        >
          <Tooltip.Arrow
            size={tooltipProps.size ?? 7}
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
