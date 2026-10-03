import { PixelRatio } from 'react-native'
import { getConfig } from '../config'

const remRegex = /^-?(\d*\.?\d+)rem$/i

/**
 * Resolves rem values to pixel values on native platforms.
 * Uses PixelRatio.getFontScale() for layout props (margin, padding, radius).
 * For fontSize, leaves OS scaling to React Native Text component to avoid double-scaling.
 *
 * @param value - A string value containing rem units (e.g. "1.5rem")
 * @param isFontSize - Whether the target property is fontSize
 * @returns The numeric pixel value
 */
export function resolveRem(value: string, isFontSize = false): number {
  let baseFontSize = 16
  try {
    const config = getConfig()
    if (config?.settings?.remBaseFontSize) {
      baseFontSize = config.settings.remBaseFontSize
    }
  } catch {}
  const trimmed = value.trim()
  const match = remRegex.exec(trimmed)
  if (!match) return 0

  const numericValue = Number.parseFloat(match[1])
  if (Number.isNaN(numericValue)) return 0

  const scale =
    isFontSize || typeof PixelRatio === 'undefined' || !PixelRatio.getFontScale
      ? 1
      : PixelRatio.getFontScale()
  const sign = trimmed.startsWith('-') ? -1 : 1
  return sign * numericValue * baseFontSize * scale
}

/**
 * Checks if a value is a strict rem string (e.g. "1.5rem", "-0.5rem")
 */
export function isRemValue(value: unknown): value is string {
  return typeof value === 'string' && remRegex.test(value.trim())
}
