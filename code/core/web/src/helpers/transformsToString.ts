import { normalizeValueWithProperty } from './normalizeValueWithProperty'

export function transformsToString(transforms: object[]) {
  // { scale: 2 } => 'scale(2)'
  // { translateX: 20 } => 'translateX(20px)'
  // { matrix: [1,2,3,4,5,6] } => 'matrix(1,2,3,4,5,6)'
  // { perspective: 1000 } => perspective(1000px)
  let out = ''
  for (const transform of transforms) {
    // each transform object has exactly one key
    for (const type in transform) {
      const value = transform[type]
      if (out) out += ' '
      out +=
        type === 'matrix' || type === 'matrix3d'
          ? `${type}(${value.join(',')})`
          : `${type}(${normalizeValueWithProperty(value, type)})`
      break
    }
  }
  return out
}
