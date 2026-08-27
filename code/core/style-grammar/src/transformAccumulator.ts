export type TransformAccumulator = {
  keys: string[]
  values: any[]
  complete: any
  hasComplete: boolean
}

export function createTransformAccumulator(): TransformAccumulator {
  return { keys: [], values: [], complete: undefined, hasComplete: false }
}

export function cloneTransformAccumulator(
  source: TransformAccumulator
): TransformAccumulator {
  return {
    keys: [...source.keys],
    values: [...source.values],
    complete: Array.isArray(source.complete) ? [...source.complete] : source.complete,
    hasComplete: source.hasComplete,
  }
}

export function addTransformValue(
  accumulator: TransformAccumulator,
  key: string,
  value: any
): void {
  if (key === 'transform') {
    accumulator.keys.length = 0
    accumulator.values.length = 0
    accumulator.complete = value
    accumulator.hasComplete = true
    return
  }

  if (accumulator.hasComplete) {
    accumulator.complete = undefined
    accumulator.hasComplete = false
    accumulator.keys.length = 0
    accumulator.values.length = 0
  }

  const outputKey = key === 'x' ? 'translateX' : key === 'y' ? 'translateY' : key
  const keys = accumulator.keys
  const values = accumulator.values

  if (outputKey === 'scale') {
    for (let index = keys.length - 1; index >= 0; index--) {
      const key = keys[index]
      if (key === 'scale' || key === 'scaleX' || key === 'scaleY') {
        keys.splice(index, 1)
        values.splice(index, 1)
      }
    }
  } else if (outputKey === 'scaleX' || outputKey === 'scaleY') {
    const sibling = outputKey === 'scaleX' ? 'scaleY' : 'scaleX'
    for (let index = keys.length - 1; index >= 0; index--) {
      if (keys[index] === 'scale') {
        keys[index] = sibling
      } else if (keys[index] === outputKey) {
        keys.splice(index, 1)
        values.splice(index, 1)
      }
    }
  } else {
    for (let index = keys.length - 1; index >= 0; index--) {
      if (keys[index] === outputKey) {
        keys.splice(index, 1)
        values.splice(index, 1)
      }
    }
  }

  keys.push(outputKey)
  values.push(value)
}

export function removeTransformValue(
  accumulator: TransformAccumulator | undefined,
  key: string
): void {
  if (!accumulator) return
  const outputKey = key === 'x' ? 'translateX' : key === 'y' ? 'translateY' : key
  for (let index = accumulator.keys.length - 1; index >= 0; index--) {
    if (accumulator.keys[index] === outputKey) {
      accumulator.keys.splice(index, 1)
      accumulator.values.splice(index, 1)
    }
  }
}

export function getTransformPartKeys(accumulator: TransformAccumulator): string[] {
  return accumulator.keys
}

export function finalizeTransformAccumulator(accumulator: TransformAccumulator): any {
  if (accumulator.hasComplete) {
    return Array.isArray(accumulator.complete)
      ? [...accumulator.complete]
      : accumulator.complete
  }

  const output: Record<string, any>[] = []
  for (let index = 0; index < accumulator.keys.length; index++) {
    const key = accumulator.keys[index]
    const value = accumulator.values[index]
    const nextKey = accumulator.keys[index + 1]
    if (
      ((key === 'scaleX' && nextKey === 'scaleY') ||
        (key === 'scaleY' && nextKey === 'scaleX')) &&
      value === accumulator.values[index + 1]
    ) {
      output.push({ scale: value })
      index++
    } else {
      output.push({ [key]: value })
    }
  }
  return output
}
