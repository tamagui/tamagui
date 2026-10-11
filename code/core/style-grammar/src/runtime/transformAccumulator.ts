export type TransformAccumulator = Map<string, any>

export function createTransformAccumulator(): TransformAccumulator {
  return new Map()
}

export function cloneTransformAccumulator(
  source: TransformAccumulator
): TransformAccumulator {
  return new Map(source)
}

export function addTransformValue(
  accumulator: TransformAccumulator,
  key: string,
  value: any
): void {
  if (key === 'transform') {
    accumulator.clear()
    accumulator.set('', value)
    return
  }
  if (accumulator.has('')) accumulator.clear()

  key = key === 'x' ? 'translateX' : key === 'y' ? 'translateY' : key
  if (key === 'scale') {
    accumulator.delete('scaleX')
    accumulator.delete('scaleY')
  } else if (key === 'scaleX' || key === 'scaleY') {
    if (accumulator.has('scale')) {
      const scale = accumulator.get('scale')
      accumulator.delete('scale')
      accumulator.set(key === 'scaleX' ? 'scaleY' : 'scaleX', scale)
    }
  }
  accumulator.delete(key)
  accumulator.set(key, value)
}

export function removeTransformValue(
  accumulator: TransformAccumulator | undefined,
  key: string
): void {
  accumulator?.delete(key === 'x' ? 'translateX' : key === 'y' ? 'translateY' : key)
}

export function getTransformPartKeys(accumulator: TransformAccumulator): string[] {
  return [...accumulator.keys()].filter(Boolean)
}

export function finalizeTransformAccumulator(accumulator: TransformAccumulator): any {
  if (accumulator.has('')) {
    const value = accumulator.get('')
    return Array.isArray(value) ? [...value] : value
  }

  const output: Record<string, any>[] = []
  for (const [key, value] of accumulator) {
    const previous = output[output.length - 1]
    if (
      (key === 'scaleX' || key === 'scaleY') &&
      value === previous?.[key === 'scaleX' ? 'scaleY' : 'scaleX']
    ) {
      output[output.length - 1] = { scale: value }
    } else {
      output.push({ [key]: value })
    }
  }
  return output
}
