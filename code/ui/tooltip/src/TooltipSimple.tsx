import { createRefComponent, getVariableValue } from '@tamagui/core'
import { getRadius, getSize, getSpace } from '@tamagui/get-token'
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
          theme="Tooltip"
          y="enter:-4px exit:-4px"
          scale="1 enter:0.96 exit:0.96"
          opacity="1 enter:0 exit:0"
          pointerEvents="none"
          paddingHorizontal={getVariableValue(getSpace(tooltipProps.size ?? true))}
          paddingVertical={Math.max(
            0,
            Math.round(
              (getVariableValue(getSize(tooltipProps.size ?? true)) as number) * 0.36 - 9
            )
          )}
          borderRadius={getVariableValue(getRadius(tooltipProps.size ?? true))}
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
