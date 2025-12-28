/**
 * Resolves rem values on web platforms.
 * On web, browsers handle rem natively, so we just return the value as-is.
 *
 * @param value - A string value containing rem units
 * @returns The same string value (browsers handle rem natively)
 */
export function resolveRem(value: string): string {
  return value
}

/**
 * Checks if a value is a rem string
 */
export function isRemValue(value: unknown): value is string {
  return typeof value === 'string' && value.includes('rem')
}
