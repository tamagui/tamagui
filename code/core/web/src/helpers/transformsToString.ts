import { normalizeValueWithProperty } from './normalizeValueWithProperty'

export function transformsToString(transforms: Object[]) {
  return transforms
    .map(
      // { scale: 2 } => 'scale(2)'
      // { translateX: 20 } => 'translateX(20px)'
      // { matrix: [1,2,3,4,5,6] } => 'matrix(1,2,3,4,5,6)'
      (transform) => {
        const type = Object.keys(transform)[0]
        const value = transform[type]
        if (type === 'matrix' || type === 'matrix3d') {
          return `${type}(${value.join(',')})`
        }
        return `${type}(${normalizeValueWithProperty(value, type)})`
      }
    )
    .join(' ')
}
