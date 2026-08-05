import { createElement, type ComponentProps } from 'react'
import { styled, View } from '@tamagui/tailwind'

import { importedMinimumHeight } from './hmrValue'

// the cross-file value rides an arbitrary candidate, which the grammar claims as a
// Tamagui minHeight — the class base is the Tailwind frontend's only style input
const crossFileFrameRoot = styled(
  View,
  `min-h-[${importedMinimumHeight}px] rounded-4 hover:opacity-75 sm:mt-4 enter:opacity-50`,
  {
    variants: {
      tone: {
        accent: 'rounded-4',
        neutral: 'rounded-0',
      },
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

export type CrossFileFrameProps = ComponentProps<typeof crossFileFrameRoot>

export function CrossFileFrame(props: CrossFileFrameProps) {
  return createElement(crossFileFrameRoot, props)
}
