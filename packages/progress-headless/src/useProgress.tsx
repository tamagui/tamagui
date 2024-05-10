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

const DEFAULT_MAX = 100

type ProgressState = 'indeterminate' | 'complete' | 'loading'

interface UseProgressParams {
  value: number
  width: number
  max?: number
  getValueLabel?: (value: number, max: number) => string
}
export function useProgress(params: UseProgressParams) {
  const {
    value: valueProp,
    width,
    max: maxProp,
    getValueLabel = defaultGetValueLabel,
  } = params
  const max = isValidMaxNumber(maxProp) ? maxProp : DEFAULT_MAX
  const value = isValidValueNumber(valueProp, max) ? valueProp : null
  const valueLabel = isNumber(value) ? getValueLabel(value, max) : undefined

  const pct = max - (value ?? 0)
  const x = width ? -(width === 0 ? 300 : width) * (pct / 100) : 0

  return {
    frame: {
      'aria-valuemax': max,
      'aria-valuemin': 0,
      'aria-valuenow': isNumber(value) ? value : undefined,
      'aria-valuetext': valueLabel,
      // @ts-ignore
      role: 'progressbar',
      'data-state': getProgressState(value, max),
      'data-value': value ?? undefined,
      'data-max': max,
    } as const,
    indicator: {
      x,
    },
  }
}
