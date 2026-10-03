/**
 * Web pass-through: browsers resolve clamp(), cqi, vw, and rem natively.
 */
export function resolveNativeUnits(_key: string, value: any, _styleState?: any): any {
  return value
}

export function isDynamicUnitValue(_value: unknown): boolean {
  return false
}
