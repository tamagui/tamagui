import { PixelRatio } from 'react-native'
import { getConfig } from '../config'

const remRegex = /(-?[\d.]+)rem/g

/**
 * Resolves rem values to pixel values on native platforms.
 * Uses PixelRatio.getFontScale() to account for user's font size preferences.
 *
 * @param value - A string value that may contain rem units (e.g., "1.5rem" or "calc(1rem + 2rem)")
 * @returns The numeric pixel value
 */
export function resolveRem(value: string): number {
  const config = getConfig()
  const baseFontSize = config?.settings?.remBaseFontSize ?? 16

  // Handle simple rem value like "1.5rem"
  if (value.endsWith('rem') && !value.includes(' ')) {
    const numericValue = Number.parseFloat(value)
    if (!Number.isNaN(numericValue)) {
      return PixelRatio.getFontScale() * baseFontSize * numericValue
    }
  }

  // Handle multiple rem values in a string (e.g., in calc expressions)
  let result = 0
  let match: RegExpExecArray | null
  while ((match = remRegex.exec(value)) !== null) {
    const numericValue = Number.parseFloat(match[1])
    if (!Number.isNaN(numericValue)) {
      result += PixelRatio.getFontScale() * baseFontSize * numericValue
    }
  }
  remRegex.lastIndex = 0 // Reset regex state

  return result
}

/**
 * Checks if a value is a rem string
 */
export function isRemValue(value: unknown): value is string {
  return typeof value === 'string' && value.includes('rem')
}
