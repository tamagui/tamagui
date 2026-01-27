import type { ThumbCollisionBehavior } from './types'

/**
 * @deprecated Use resolveThumbCollision instead
 */
export function getNextSortedValues(
  prevValues: number[] = [],
  nextValue: number,
  atIndex: number
) {
  const nextValues = [...prevValues]
  nextValues[atIndex] = nextValue
  return nextValues.sort((a, b) => a - b)
}

interface ResolveThumbCollisionParams {
  behavior: ThumbCollisionBehavior
  values: number[]
  pressedIndex: number
  nextValue: number
  min: number
  max: number
  step: number
  minStepsBetweenValues: number
}

interface ResolveThumbCollisionResult {
  values: number[]
  thumbIndex: number
}

/**
 * Resolves thumb collision based on the specified behavior.
 */
export function resolveThumbCollision({
  behavior,
  values,
  pressedIndex,
  nextValue,
  min,
  max,
  step,
  minStepsBetweenValues,
}: ResolveThumbCollisionParams): ResolveThumbCollisionResult {
  if (values.length <= 1) {
    return {
      values: [nextValue],
      thumbIndex: 0,
    }
  }

  const minValueDifference = step * minStepsBetweenValues
  const candidateValues = values.slice()

  switch (behavior) {
    case 'swap': {
      // original radix behavior - values get sorted so thumbs can swap
      candidateValues[pressedIndex] = nextValue
      const sortedValues = candidateValues.sort((a, b) => a - b)
      return {
        values: sortedValues,
        thumbIndex: sortedValues.indexOf(nextValue),
      }
    }

    case 'push': {
      // thumbs push each other
      candidateValues[pressedIndex] = nextValue

      // push thumbs to the right
      for (let i = pressedIndex + 1; i < candidateValues.length; i++) {
        const minAllowed = candidateValues[i - 1] + minValueDifference
        if (candidateValues[i] < minAllowed) {
          candidateValues[i] = Math.min(
            minAllowed,
            max - (candidateValues.length - 1 - i) * minValueDifference
          )
        }
      }

      // push thumbs to the left
      for (let i = pressedIndex - 1; i >= 0; i--) {
        const maxAllowed = candidateValues[i + 1] - minValueDifference
        if (candidateValues[i] > maxAllowed) {
          candidateValues[i] = Math.max(maxAllowed, min + i * minValueDifference)
        }
      }

      return {
        values: candidateValues,
        thumbIndex: pressedIndex,
      }
    }

    default: {
      // 'none' - thumbs cannot pass each other - clamp to neighbors
      const previousNeighbor = candidateValues[pressedIndex - 1]
      const nextNeighbor = candidateValues[pressedIndex + 1]

      const lowerBound =
        previousNeighbor != null ? previousNeighbor + minValueDifference : min
      const upperBound = nextNeighbor != null ? nextNeighbor - minValueDifference : max

      candidateValues[pressedIndex] = Math.max(
        lowerBound,
        Math.min(upperBound, nextValue)
      )

      return {
        values: candidateValues,
        thumbIndex: pressedIndex,
      }
    }
  }
}

export function convertValueToPercentage(value: number, min: number, max: number) {
  const maxSteps = max - min
  const percentPerStep = 100 / maxSteps
  return percentPerStep * (value - min)
}

/**
 * Returns a label for each thumb when there are two or more thumbs
 */
export function getLabel(index: number, totalValues: number) {
  if (totalValues > 2) {
    return `Value ${index + 1} of ${totalValues}`
  }
  if (totalValues === 2) {
    return ['Minimum', 'Maximum'][index]
  }
  return undefined
}

/**
 * Given a `values` array and a `nextValue`, determine which value in
 * the array is closest to `nextValue` and return its index.
 *
 * @example
 * // returns 1
 * getClosestValueIndex([10, 30], 25);
 */
export function getClosestValueIndex(values: number[], nextValue: number) {
  if (values.length === 1) return 0
  const distances = values.map((value) => Math.abs(value - nextValue))
  const closestDistance = Math.min(...distances)
  return distances.indexOf(closestDistance)
}

/**
 * Offsets the thumb centre point while sliding to ensure it remains
 * within the bounds of the slider when reaching the edges
 */
export function getThumbInBoundsOffset(width: number, left: number, direction: number) {
  const quarterWidth = width / 4 // changed to quarter width to allow some overlap but not so much
  const halfPercent = 50
  const offset = linearScale([0, halfPercent], [0, quarterWidth])
  return (quarterWidth - offset(left)) * direction
}

/**
 * Gets an array of steps between each value.
 *
 * @example
 * // returns [1, 9]
 * getStepsBetweenValues([10, 11, 20]);
 */
function getStepsBetweenValues(values: number[]) {
  return values.slice(0, -1).map((value, index) => values[index + 1] - value)
}

/**
 * Verifies the minimum steps between all values is greater than or equal
 * to the expected minimum steps.
 *
 * @example
 * // returns false
 * hasMinStepsBetweenValues([1,2,3], 2);
 *
 * @example
 * // returns true
 * hasMinStepsBetweenValues([1,2,3], 1);
 */
export function hasMinStepsBetweenValues(
  values: number[],
  minStepsBetweenValues: number
) {
  if (minStepsBetweenValues > 0) {
    const stepsBetweenValues = getStepsBetweenValues(values)
    const actualMinStepsBetweenValues = Math.min(...stepsBetweenValues)
    return actualMinStepsBetweenValues >= minStepsBetweenValues
  }
  return true
}

// https://github.com/tmcw-up-for-adoption/simple-linear-scale/blob/master/index.js
export function linearScale(
  input: readonly [number, number],
  output: readonly [number, number]
) {
  return (value: number) => {
    if (input[0] === input[1] || output[0] === output[1]) return output[0]
    const ratio = (output[1] - output[0]) / (input[1] - input[0])
    return output[0] + ratio * (value - input[0])
  }
}

export function getDecimalCount(value: number) {
  return (String(value).split('.')[1] || '').length
}

export function roundValue(value: number, decimalCount: number) {
  const rounder = 10 ** decimalCount
  return Math.round(value * rounder) / rounder
}
