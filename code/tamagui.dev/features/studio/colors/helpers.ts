import { toHex } from 'color2k'
import hsluv from 'hsluv'

import type { Color, Curve, DeepReadonly, Scale } from '../state/types'

export const removeComponentName = (str: string) => str.replace(/_[A-Z][a-zA-Z]+$/, '')

export const isComponentTheme = (name: string) => removeComponentName(name) !== name

export const removePseudoPostfix = (str: string) => str.replace(/[A-Z][a-z]+$/, '')

export function hexToColor(hex: string): Color {
  const [hue, saturation, lightness] = hsluv
    .hexToHsluv(toHex(hex))
    .map((value) => Math.round(value * 100) / 100)
  return { hue, saturation, lightness }
}

export function colorToHex(color: Color): string {
  return hsluv.hsluvToHex([color.hue, color.saturation, color.lightness])
}

export function randomIntegerInRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function getColor(
  curves: Record<string, DeepReadonly<Curve>>,
  scale: DeepReadonly<Scale>,
  index: number
) {
  const color = scale.colors[index]

  const hueCurve = curves[scale.curves.hue ?? '']?.values ?? []
  const saturationCurve = curves[scale.curves.saturation ?? '']?.values ?? []
  const lightnessCurve = curves[scale.curves.lightness ?? '']?.values ?? []

  const hue = color.hue + (hueCurve[index] ?? 0)
  const saturation = color.saturation + (saturationCurve[index] ?? 0)
  const lightness = color.lightness + (lightnessCurve[index] ?? 0)

  return { hue, saturation, lightness }
}

export function getRange(type: Curve['type']) {
  const ranges = {
    hue: { min: 0, max: 360 },
    saturation: { min: 0, max: 100 },
    lightness: { min: 0, max: 100 },
  }
  return ranges[type]
}

export function getAccentScore(accent: number) {
  return accent < 3 ? 'Fail' : accent < 4.5 ? 'AA Large' : accent < 7 ? 'AA' : 'AAA'
}
