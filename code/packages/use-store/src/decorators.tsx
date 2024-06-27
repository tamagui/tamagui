export type ComparisonFn = (a: any, b: any) => boolean

export function compare(comparator: ComparisonFn) {
  return (target: any, propertyKey: string): any => {
    target['_comparators'] = target['_comparators'] || {}
    target['_comparators'][propertyKey] = comparator
  }
}
