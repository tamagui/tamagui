import type { ColorsStore } from '../state/ColorsStore'
import { useGlobalState } from '../state/useGlobalState'

export const ColorHeaderActions = () => {
  const state = useGlobalState()
  return null
  // return (
  //   <ExportActions
  //     hasUnsavedChanges={state.colors.hasChanges}
  //     onReset={() => state.colors.resetState()}
  //     onExport={() => {
  //       state.showDialog('export', {
  //         snippet: JSON.stringify(generateColorConfig(state.colors), null, 2),
  //       })
  //     }}
  //   />
  // )
}

export const generateColorConfig = (input: ColorsStore) => {
  const colors: Record<string, string> = {}

  for (const palette of Object.values(input.palettesByScheme)) {
    for (const scale of Object.values(palette.scales)) {
      let idx = 0
      for (const color of scale.colors) {
        const colorKey = [`${scale.name}${idx + 1}`]
        const key = `${colorKey}${palette.name}`
        colors[key] = `hsl(${color.hue}, ${color.saturation}%, ${color.lightness}%)`
        idx++
      }
    }
  }

  return colors
}
