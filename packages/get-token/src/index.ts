import type { Variable, VariableValGeneric } from '@tamagui/web'
import { getTokens, isVariable } from '@tamagui/web'

// technically number | undefined just for compat with the generic VariableVal
type GetTokenBase = Variable | string | number | undefined | VariableValGeneric

type GetTokenOptions = {
  shift?: number
  bounds?: [number] | [number, number]
  excludeHalfSteps?: boolean
}

const defaultOptions: GetTokenOptions = {
  shift: 0,
  bounds: [0],
}

export const getSize = (size: GetTokenBase, options?: GetTokenOptions) => {
  return getTokenRelative('size', size, options)
}

export const getSpace = (space: GetTokenBase, options?: GetTokenOptions) => {
  return getTokenRelative('space', space, options)
}

export const getRadius = (radius: GetTokenBase, options?: GetTokenOptions) => {
  return getTokenRelative('radius', radius, options)
}

const cacheVariables: Record<string, Variable[]> = {}
const cacheWholeVariables: Record<string, Variable[]> = {}
const cacheKeys: Record<string, string[]> = {}
const cacheWholeKeys: Record<string, string[]> = {}

/** @deprecated use getSize, getSpace, or getTokenRelative instead */
export const stepTokenUpOrDown = (
  type: 'size' | 'space' | 'zIndex' | 'radius',
  current: GetTokenBase,
  options: GetTokenOptions = defaultOptions
): Variable<number> => {
  const tokens = getTokens({ prefixed: true })[type] as Record<string, Variable>

  if (!(type in cacheVariables)) {
    cacheKeys[type] = []
    cacheVariables[type] = []
    cacheWholeKeys[type] = []
    cacheWholeVariables[type] = []

    const sorted = Object.keys(tokens)
      .map((k) => tokens[k])
      .sort((a, b) => a.val - b.val)

    for (const token of sorted) {
      cacheKeys[type].push(token.key)
      cacheVariables[type].push(token)
    }

    const sortedExcludingHalfSteps = sorted.filter((x) => !x.key.endsWith('.5'))
    for (const token of sortedExcludingHalfSteps) {
      cacheWholeKeys[type].push(token.key)
      cacheWholeVariables[type].push(token)
    }
  }

  const isString = typeof current === 'string'
  const cache = options.excludeHalfSteps
    ? isString
      ? cacheWholeKeys
      : cacheWholeVariables
    : isString
      ? cacheKeys
      : cacheVariables

  const tokensOrdered = cache[type]

  const min = options.bounds?.[0] ?? 0
  const max = options.bounds?.[1] ?? tokensOrdered.length - 1
  const currentIndex = tokensOrdered.indexOf(current as any)

  let shift = options.shift || 0
  if (shift) {
    if (current === '$true' || (isVariable(current) && current.name === 'true')) {
      shift += shift > 0 ? 1 : -1
    }
  }

  const index = Math.min(max, Math.max(min, currentIndex + shift))
  const found = tokensOrdered[index]

  const result = (typeof found === 'string' ? tokens[found] : found) || tokens['$true']

  // console.log('found', { current, shift, index, found, result })

  // @ts-ignore
  return result
}

export const getTokenRelative = stepTokenUpOrDown
