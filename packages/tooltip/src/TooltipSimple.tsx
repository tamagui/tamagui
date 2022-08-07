import { useDelayGroupContext } from '@floating-ui/react-dom-interactions'
import { ThemeInverse } from '@tamagui/core'
import { SizableStackProps } from '@tamagui/stacks'
import { Paragraph } from '@tamagui/text'
import * as React from 'react'

import { Tooltip, TooltipGroup, TooltipProps } from './Tooltip'

export type TooltipSimpleProps = TooltipProps & {
  label?: React.ReactNode
  children?: React.ReactNode
  contentProps?: SizableStackProps
}

export const TooltipSimple: React.FC<TooltipSimpleProps> = ({
  label,
  children,
  contentProps,
  ...tooltipProps
}) => {
  let context
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    context = useDelayGroupContext()
  } catch {
    // ok
  }

  const contents = (
    <Tooltip {...tooltipProps}>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <ThemeInverse>
        <Tooltip.Content
          enterStyle={{ x: 0, y: -10, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: -10, opacity: 0, scale: 0.9 }}
          x={0}
          scale={1}
          y={0}
          elevation="$1"
          opacity={1}
          animation={[
            'bouncy',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          {...contentProps}
        >
          <Tooltip.Arrow />
          <Paragraph size="$2" lineHeight="$1">
            {label}
          </Paragraph>
        </Tooltip.Content>
      </ThemeInverse>
    </Tooltip>
  )

  if (!context) {
    return <TooltipGroup delay={{ open: 3000, close: 100 }}>{contents}</TooltipGroup>
  }

  return contents
}
