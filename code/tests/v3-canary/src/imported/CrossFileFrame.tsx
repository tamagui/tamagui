import { createElement } from 'react'
import { styled, View, type GetProps } from 'tamagui'

import { CanaryVariantContext } from './CanaryVariantContext'
import { importedMinimumHeight } from './hmrValue'

const crossFileFrameRoot = styled(
  View,
  'rounded-4 hover:opacity-75 sm:mt-4 enter:opacity-50',
  {
    context: CanaryVariantContext,
    minH: importedMinimumHeight,
    variants: {
      emphasis: {
        quiet: 'opacity-75',
        strong: 'w-8 border-2',
      },
      selected: {
        true: 'h-8',
      },
    } as const,
    compoundVariants: [
      {
        emphasis: 'strong',
        selected: true,
        tone: 'accent',
        style: 'p-0 opacity-50',
      },
    ],
  }
)

export type CrossFileFrameProps = GetProps<typeof crossFileFrameRoot>

export function CrossFileFrame(props: CrossFileFrameProps) {
  return createElement(crossFileFrameRoot, props)
}
