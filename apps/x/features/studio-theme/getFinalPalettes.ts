import type { BuildPalettes } from './types'
import { getThemeSuitePalettes } from './getThemeSuitePalettes'

export function getFinalPalettes(palettes: BuildPalettes) {
  const next = Object.fromEntries(
    Object.entries(palettes).flatMap(([name, palette]) => {
      const palettes = getThemeSuitePalettes(palette)
      return [
        [`light_${name}`, palettes.light],
        [`dark_${name}`, palettes.dark],
      ] as const
    })
  )
  // console.log('next', next)
  return next
}
