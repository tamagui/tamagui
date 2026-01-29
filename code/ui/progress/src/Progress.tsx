// forked from Radix UI
// https://github.com/radix-ui/primitives/blob/main/packages/react/progress/src/Progress.tsx

import type { GetProps } from '@tamagui/core'
import { getVariableValue, isWeb, styled } from '@tamagui/core'
import type { Scope } from '@tamagui/create-context'
import { createContextScope } from '@tamagui/create-context'
import { getSize } from '@tamagui/get-token'
import { withStaticProperties } from '@tamagui/helpers'
import { YStack } from '@tamagui/stacks'
import { useState } from 'react'

const PROGRESS_NAME = 'Progress'

const [createProgressContext, createProgressScope] = createContextScope(PROGRESS_NAME)

type ProgressContextValue = {
  value: number | null
  max: number
  width: number
}

const [ProgressProvider, useProgressContext] =
  createProgressContext<ProgressContextValue>(PROGRESS_NAME)

/* -------------------------------------------------------------------------------------------------
 * ProgressIndicator
 * -----------------------------------------------------------------------------------------------*/

const INDICATOR_NAME = 'ProgressIndicator'

export const ProgressIndicatorFrame = styled(YStack, {
  name: INDICATOR_NAME,

  variants: {
    unstyled: {
      false: {
        height: '100%',
        width: '100%',
        backgroundColor: '$background',
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

export type ProgressIndicatorProps = GetProps<typeof ProgressIndicatorFrame>

const ProgressIndicator = ProgressIndicatorFrame.styleable(function ProgressIndicator(
  props: ScopedProps<ProgressIndicatorProps>,
  forwardedRef
) {
  const { __scopeProgress, transition, ...indicatorProps } = props
  const context = useProgressContext(INDICATOR_NAME, __scopeProgress)

  const progressRatio = (context.value ?? 0) / context.max

  // indicator is 2x container width so bouncy animations can overshoot
  // without visually extending past the right edge (parent has overflow:hidden)
  // translateX percentage is relative to element's own width (200% of container)
  // so we divide by 2 to get container-relative positioning:
  // at 0%: x = -100% of element = -200% of container (fully hidden left)
  // at 100%: x = -50% of element = -100% of container (right half visible)
  let x: string | number
  if (isWeb) {
    // web: use percentage-based translateX for SSR-friendly rendering
    // formula: -100% + (progressRatio * 50%) since translateX % is relative to element width
    x = `${-100 + progressRatio * 50}%`
  } else {
    // native: use pixel-based transform (RN doesn't support percentage transforms reliably)
    const baseWidth = context.width || 0
    x = Math.ceil(-baseWidth * (2 - progressRatio))
  }

  return (
    <ProgressIndicatorFrame
      data-state={getProgressState(context.value, context.max)}
      data-value={context.value ?? undefined}
      data-max={context.max}
      x={x}
      width="200%"
      {...(!props.unstyled && {
        animateOnly: ['transform'],
        // on native, hide until we have width measurement
        ...(!isWeb && context.width === 0 && { opacity: 0 }),
      })}
      {...indicatorProps}
      ref={forwardedRef}
      transition={!isWeb && !context.width ? null : transition}
    />
  )
})

/* ---------------------------------------------------------------------------------------------- */

function defaultGetValueLabel(value: number, max: number) {
  return `${Math.round((value / max) * 100)}%`
}

function getProgressState(
  value: number | undefined | null,
  maxValue: number
): ProgressState {
  return value == null ? 'indeterminate' : value === maxValue ? 'complete' : 'loading'
}

function isNumber(value: any): value is number {
  return typeof value === 'number'
}

function isValidMaxNumber(max: any): max is number {
  return isNumber(max) && !Number.isNaN(max) && max > 0
}

function isValidValueNumber(value: any, max: number): value is number {
  return isNumber(value) && !Number.isNaN(value) && value <= max && value >= 0
}

/* -------------------------------------------------------------------------------------------------
 * Progress
 * -----------------------------------------------------------------------------------------------*/

const DEFAULT_MAX = 100

type ScopedProps<P> = P & { __scopeProgress?: Scope }

type ProgressState = 'indeterminate' | 'complete' | 'loading'

export const ProgressFrame = styled(YStack, {
  name: 'Progress',

  variants: {
    unstyled: {
      false: {
        borderRadius: 100_000,
        overflow: 'hidden',
        backgroundColor: '$background',
      },
    },

    size: {
      '...size': (val) => {
        const size = Math.round(getVariableValue(getSize(val)) * 0.25)
        return {
          height: size,
          minWidth: getVariableValue(size) * 20,
          width: '100%',
        }
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

export interface ProgressExtraProps {
  value?: number | null | undefined
  max?: number
  getValueLabel?(value: number, max: number): string
}

export type ProgressProps = GetProps<typeof ProgressFrame> & ProgressExtraProps

const Progress = withStaticProperties(
  ProgressFrame.styleable<ProgressExtraProps>(function Progress(props, forwardedRef) {
    const {
      // @ts-expect-error
      __scopeProgress,
      value: valueProp,
      max: maxProp,
      getValueLabel = defaultGetValueLabel,
      size = '$true',
      ...progressProps
    } = props

    const max = isValidMaxNumber(maxProp) ? maxProp : DEFAULT_MAX
    const value = isValidValueNumber(valueProp, max) ? Math.round(valueProp) : null
    const valueLabel = isNumber(value) ? getValueLabel(value, max) : undefined

    // only needed for native where we can't use percentage-based transforms
    const [width, setWidth] = useState(0)

    return (
      <ProgressProvider scope={__scopeProgress} value={value} max={max} width={width}>
        <ProgressFrame
          aria-valuemax={max}
          aria-valuemin={0}
          aria-valuenow={isNumber(value) ? value : undefined}
          aria-valuetext={valueLabel}
          // @ts-ignore
          role="progressbar"
          data-state={getProgressState(value, max)}
          data-value={value ?? undefined}
          data-max={max}
          {...(progressProps.unstyled !== true && {
            size,
          })}
          {...progressProps}
          {...(!isWeb && {
            onLayout: (e) => {
              const newWidth = Math.round(e.nativeEvent.layout.width)
              if (newWidth !== width) {
                setWidth(newWidth)
              }
              progressProps.onLayout?.(e)
            },
          })}
          ref={forwardedRef}
        />
      </ProgressProvider>
    )
  }),
  {
    Indicator: ProgressIndicator,
  }
)

export { createProgressScope, Progress, ProgressIndicator }
