const isStringLike = (x: any) => typeof x === 'string' || typeof x === 'number'

export function isStringChild(node: any) {
  return (
    isStringLike(node) ||
    (Array.isArray(node) && node.every(isStringLike))
  )
}
