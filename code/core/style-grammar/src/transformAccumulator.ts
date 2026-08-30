export type TransformAccumulator = any[]

export function createTransformAccumulator(): TransformAccumulator {
  return []
}

export function cloneTransformAccumulator(
  source: TransformAccumulator
): TransformAccumulator {
  return [...source]
}

export function addTransformValue(
  accumulator: TransformAccumulator,
  key: string,
  value: any
): void {
  if (key === 'transform') {
    accumulator.length = 0
    accumulator.push('', value)
    return
  }

  if (accumulator[0] === '') accumulator.length = 0

  const outputKey = key === 'x' ? 'translateX' : key === 'y' ? 'translateY' : key

  if (outputKey === 'scale') {
    for (let index = accumulator.length - 2; index >= 0; index -= 2) {
      const key = accumulator[index]
      if (key === 'scale' || key === 'scaleX' || key === 'scaleY') {
        accumulator.splice(index, 2)
      }
    }
  } else if (outputKey === 'scaleX' || outputKey === 'scaleY') {
    const sibling = outputKey === 'scaleX' ? 'scaleY' : 'scaleX'
    for (let index = accumulator.length - 2; index >= 0; index -= 2) {
      if (accumulator[index] === 'scale') {
        accumulator[index] = sibling
      } else if (accumulator[index] === outputKey) {
        accumulator.splice(index, 2)
      }
    }
  } else {
    for (let index = accumulator.length - 2; index >= 0; index -= 2) {
      if (accumulator[index] === outputKey) {
        accumulator.splice(index, 2)
      }
    }
  }

  accumulator.push(outputKey, value)
}

export function removeTransformValue(
  accumulator: TransformAccumulator | undefined,
  key: string
): void {
  if (!accumulator) return
  const outputKey = key === 'x' ? 'translateX' : key === 'y' ? 'translateY' : key
  for (let index = accumulator.length - 2; index >= 0; index -= 2) {
    if (accumulator[index] === outputKey) {
      accumulator.splice(index, 2)
    }
  }
}

export function getTransformPartKeys(accumulator: TransformAccumulator): string[] {
  const keys: string[] = []
  for (let index = 0; index < accumulator.length; index += 2) {
    if (accumulator[index]) keys.push(accumulator[index])
  }
  return keys
}

export function finalizeTransformAccumulator(accumulator: TransformAccumulator): any {
  if (accumulator[0] === '') {
    return Array.isArray(accumulator[1]) ? [...accumulator[1]] : accumulator[1]
  }

  const output: Record<string, any>[] = []
  for (let index = 0; index < accumulator.length; index += 2) {
    const key = accumulator[index]
    const value = accumulator[index + 1]
    const nextKey = accumulator[index + 2]
    if (
      ((key === 'scaleX' && nextKey === 'scaleY') ||
        (key === 'scaleY' && nextKey === 'scaleX')) &&
      value === accumulator[index + 3]
    ) {
      output.push({ scale: value })
      index += 2
    } else {
      output.push({ [key]: value })
    }
  }
  return output
}
