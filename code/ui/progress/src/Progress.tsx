// forked from Radix UI
// https://github.com/radix-ui/primitives/blob/main/packages/react/progress/src/Progress.tsx

import type { GetProps } from '@tamagui/core'
import { getVariableValue, styled } from '@tamagui/core'
import type { Scope } from '@tamagui/create-context'
import { createContextScope } from '@tamagui/create-context'
import { getSize } from '@tamagui/get-token'
import { withStaticProperties } from '@tamagui/helpers'
import { ThemeableStack } from '@tamagui/stacks'
import * as React from 'react'

const PROGRESS_NAME = 'Progress'

const [createProgressContext, createProgressScope] = createContextScope(PROGRESS_NAME)
type ProgressContextValue = { value: number | null; max: number; width: number }
const [ProgressProvider, useProgressContext] =
  createProgressContext<ProgressContextValue>(PROGRESS_NAME)

/* -------------------------------------------------------------------------------------------------
 * ProgressIndicator
 * -----------------------------------------------------------------------------------------------*/

const INDICATOR_NAME = 'ProgressIndicator'

export const ProgressIndicatorFrame = styled(ThemeableStack, {
  name: INDICATOR_NAME,

  variants: {
    unstyled: {
      false: {
        height: '100%',
        width: '100%',
        backgrounded: true,
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
  const { __scopeProgress, animation, ...indicatorProps } = props
  const context = useProgressContext(INDICATOR_NAME, __scopeProgress)
  const pct = context.max - (context.value ?? 0)
  // default somewhat far off
  const x = -(context.width === 0 ? 300 : context.width) * (pct / 100)

  return (
    <ProgressIndicatorFrame
      data-state={getProgressState(context.value, context.max)}
      data-value={context.value ?? undefined}
      data-max={context.max}
      x={x}
      width={context.width}
      {...(!props.unstyled && {
        animateOnly: ['transform'],
        opacity: context.width === 0 ? 0 : 1,
      })}
      {...indicatorProps}
      ref={forwardedRef}
      // avoid animation on first render so the progress doesn't bounce to initial location
      animation={!context.width ? null : animation}
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

export const ProgressFrame = styled(ThemeableStack, {
  name: 'Progress',

  variants: {
    unstyled: {
      false: {
        borderRadius: 100_000,
        overflow: 'hidden',
        backgrounded: true,
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
    const value = isValidValueNumber(valueProp, max) ? valueProp : null
    const valueLabel = isNumber(value) ? getValueLabel(value, max) : undefined
    const [width, setWidth] = React.useState(0)

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
          onLayout={(e) => {
            setWidth(e.nativeEvent.layout.width)
            progressProps.onLayout?.(e)
          }}
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
