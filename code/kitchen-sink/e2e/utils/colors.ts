/**
 * Color utilities for screenshot-based testing
 */

import * as fs from 'fs'
import { PNG } from 'pngjs'

export type RGB = { r: number; g: number; b: number }

/**
 * Get the dominant color from a PNG screenshot
 * Samples pixels from the center region to avoid edges/text
 */
export function getDominantColor(screenshotPath: string): RGB {
  const data = fs.readFileSync(screenshotPath)
  const png = PNG.sync.read(data)

  // sample the center 50% of the image to avoid edges and text
  const startX = Math.floor(png.width * 0.25)
  const endX = Math.floor(png.width * 0.75)
  const startY = Math.floor(png.height * 0.25)
  const endY = Math.floor(png.height * 0.75)

  let totalR = 0,
    totalG = 0,
    totalB = 0,
    count = 0

  for (let y = startY; y < endY; y++) {
    for (let x = startX; x < endX; x++) {
      const idx = (png.width * y + x) * 4
      totalR += png.data[idx]
      totalG += png.data[idx + 1]
      totalB += png.data[idx + 2]
      count++
    }
  }

  return {
    r: Math.round(totalR / count),
    g: Math.round(totalG / count),
    b: Math.round(totalB / count),
  }
}

/**
 * Check if a color is predominantly blue (for $blue10)
 */
export function isBlueish(color: RGB): boolean {
  // blue should have high B, low R, and low-medium G
  return color.b > 100 && color.b > color.r && color.b > color.g
}

/**
 * Check if a color is predominantly red (for $red10)
 */
export function isReddish(color: RGB): boolean {
  // red should have high R, low B, and low G
  return color.r > 100 && color.r > color.b && color.r > color.g
}

/**
 * Check if a color is predominantly green (for $green10)
 */
export function isGreenish(color: RGB): boolean {
  // green should have high G, low R, and low B
  return color.g > 100 && color.g > color.r && color.g > color.b
}

/**
 * Format RGB color for error messages
 */
export function formatRGB(color: RGB): string {
  return `RGB(${color.r}, ${color.g}, ${color.b})`
}
