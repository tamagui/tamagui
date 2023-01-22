// forked from Radix UI
// https://github.com/radix-ui/primitives/blob/main/packages/react/progress/src/Progress.tsx

import { GetProps, getVariableValue, styled, withStaticProperties } from '@tamagui/core'
import { Scope, createContextScope } from '@tamagui/create-context'
import { getSize } from '@tamagui/get-size'
import { ThemeableStack, YStackProps } from '@tamagui/stacks'
import * as React from 'react'
import { View } from 'react-native'

const PROGRESS_NAME = 'Progress'

const [createProgressContext, createProgressScope] = createContextScope(PROGRESS_NAME)
type ProgressContextValue = { value: number | null; max: number; width: number }
const [ProgressProvider, useProgressContext] =
  createProgressContext<ProgressContextValue>(PROGRESS_NAME)

/* -------------------------------------------------------------------------------------------------
 * ProgressIndicator
 * -----------------------------------------------------------------------------------------------*/

const INDICATOR_NAME = 'ProgressIndicator'

type ProgressIndicatorElement = TamaguiElement
interface ProgressIndicatorProps extends YStackProps {}

export const ProgressIndicatorFrame = styled(ThemeableStack, {
  name: INDICATOR_NAME,
  height: '100%',
  width: '100%',
  backgrounded: true,
})

const ProgressIndicator = ProgressIndicatorFrame.extractable(
  React.forwardRef<ProgressIndicatorElement, ProgressIndicatorProps>(
    (props: ScopedProps<ProgressIndicatorProps>, forwardedRef) => {
      const { __scopeProgress, ...indicatorProps } = props
      const context = useProgressContext(INDICATOR_NAME, __scopeProgress)
      const pct = context.max - (context.value ?? 0)
      const x = -context.width * (pct / 100)
      return (
        <ProgressIndicatorFrame
          data-state={getProgressState(context.value, context.max)}
          data-value={context.value ?? undefined}
          data-max={context.max}
          x={x}
          width={context.width}
          {...indicatorProps}
          ref={forwardedRef}
        />
      )
    }
  )
)

ProgressIndicator.displayName = INDICATOR_NAME

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
  return isNumber(max) && !isNaN(max) && max > 0
}

function isValidValueNumber(value: any, max: number): value is number {
  return isNumber(value) && !isNaN(value) && value <= max && value >= 0
}

// Split this out for clearer readability of the error message.
function getInvalidMaxError(propValue: string, componentName: string) {
  return `Invalid prop \`max\` of value \`${propValue}\` supplied to \`${componentName}\`. Only numbers greater than 0 are valid max values. Defaulting to \`${DEFAULT_MAX}\`.`
}

function getInvalidValueError(propValue: string, componentName: string) {
  return `Invalid prop \`value\` of value \`${propValue}\` supplied to \`${componentName}\`. The \`value\` prop must be:
  - a positive number
  - less than the value passed to \`max\` (or ${DEFAULT_MAX} if no \`max\` prop is set)
  - \`null\` if the progress is indeterminate.

Defaulting to \`null\`.`
}

/* -------------------------------------------------------------------------------------------------
 * Progress
 * -----------------------------------------------------------------------------------------------*/

const DEFAULT_MAX = 100

type ScopedProps<P> = P & { __scopeProgress?: Scope }

type ProgressState = 'indeterminate' | 'complete' | 'loading'

type TamaguiElement = HTMLElement | View

type ProgressElement = TamaguiElement

export const ProgressFrame = styled(ThemeableStack, {
  name: PROGRESS_NAME,
  borderRadius: 100_000,
  overflow: 'hidden',
  backgrounded: true,

  variants: {
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
})

type ProgressProps = GetProps<typeof ProgressFrame> & {
  value?: number | null | undefined
  max?: number
  getValueLabel?(value: number, max: number): string
}

const Progress = withStaticProperties(
  ProgressFrame.extractable(
    React.forwardRef<ProgressElement, ProgressProps>(
      (props: ScopedProps<ProgressProps>, forwardedRef) => {
        const {
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
              size={size}
              aria-valuemax={max}
              aria-valuemin={0}
              aria-valuenow={isNumber(value) ? value : undefined}
              aria-valuetext={valueLabel}
              // @ts-ignore
              role="progressbar"
              data-state={getProgressState(value, max)}
              data-value={value ?? undefined}
              data-max={max}
              {...progressProps}
              onLayout={(e) => {
                setWidth(e.nativeEvent.layout.width)
                progressProps.onLayout?.(e)
              }}
              ref={forwardedRef}
            />
          </ProgressProvider>
        )
      }
    )
  ),
  {
    Indicator: ProgressIndicator,
  }
)

Progress.displayName = PROGRESS_NAME

Progress.propTypes = {
  max(props, propName, componentName) {
    const propValue = props[propName]
    const strVal = String(propValue)
    if (propValue && !isValidMaxNumber(propValue)) {
      return new Error(getInvalidMaxError(strVal, componentName))
    }
    return null
  },
  value(props, propName, componentName) {
    const valueProp = props[propName]
    const strVal = String(valueProp)
    const max = isValidMaxNumber(props.max) ? props.max : DEFAULT_MAX
    if (valueProp != null && !isValidValueNumber(valueProp, max)) {
      return new Error(getInvalidValueError(strVal, componentName))
    }
    return null
  },
}

export { createProgressScope, Progress, ProgressIndicator }
export type { ProgressProps, ProgressIndicatorProps }
